// controllers/abonnement.controller.js
const { PrismaClient, Prisma } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");
const emailService = require("../services/email.service");
const prisma = new PrismaClient();

// Champs autorisés pour le tri
const SORTABLE = new Set(["createdAt", "updatedAt", "dateDebut", "dateExpiration", "montant"]);


// en haut du fichier
const getPrices = () => {
    const toNum = (v, d = 0) => {
        const n = Number(String(v || "").trim());
        return Number.isFinite(n) ? n : d;
    };
    return {
        institut: toNum(process.env.PRIX_INSTITUT, 0),
        universite: toNum(process.env.PRIX_UNIVERSITE, 0),
        currency: (process.env.PRIX_DEVISE || "USD").toUpperCase(),
    };
};
const computeAbonnementPriceForOrgType = (orgType) => {
    const P = getPrices();
    const map = { "INSTITUT": P.institut, "UNIVERSITE": P.universite };
    const amount = map[orgType.toUpperCase()] || 0;
    return { amount, currency: P.currency };
};


const shapeAbonnement = (a, opts = {}) => {
    const base = {
        id: a.id,
        organizationId: a.organizationId,
        dateDebut: a.dateDebut,
        dateExpiration: a.dateExpiration,
        montant: a.montant.toString(),
        isDeleted: a.isDeleted,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        deletedAt: a.deletedAt || null,
    };

    if (opts.withOrganization && a.organization) {
        base.organization = {
            id: a.organization.id,
            name: a.organization.name,
            slug: a.organization.slug,
            type: a.organization.type,
            country: a.organization.country,
        };
    }

    if (opts.withPayments && a.payments) {
        base.payments = a.payments.map((p) => ({
            id: p.id,
            provider: p.provider,
            providerRef: p.providerRef,
            status: p.status,
            amount: p.amount.toString(),
            currency: p.currency,
            paymentType: p.paymentType,
            createdAt: p.createdAt,
        }));
    }

    return base;
};

const sanitizePagination = (q) => {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit || 10)));
    const skip = (page - 1) * limit;
    const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "createdAt";
    const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
    return { page, limit, skip, sortBy, sortOrder };
};

// Vérifie le chevauchement de période pour une organisation
async function hasOverlap({ organizationId, dateDebut, dateExpiration, excludeId = null }) {
    const where = {
        organizationId,
        isDeleted: false,
        dateDebut: { lte: dateExpiration },
        dateExpiration: { gte: dateDebut },
    };

    if (excludeId) where.id = { not: excludeId };

    const count = await prisma.abonnement.count({ where });
    return count > 0;
}

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const {
            organizationId,
            activeOnly,
            expiredOnly,
            dateFrom,
            dateTo,
            minMontant,
            maxMontant,
            withOrg = "true",
            withPayments = "false",
        } = req.query;

        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);
        const where = { isDeleted: false };

        if (organizationId) where.organizationId = organizationId;

        // Filtres de statut
        const now = new Date();
        if (String(activeOnly) === "true") {
            where.dateDebut = { lte: now };
            where.dateExpiration = { gte: now };
        }
        if (String(expiredOnly) === "true") {
            where.dateExpiration = { lt: now };
        }

        // Plage de dates
        if (dateFrom || dateTo) {
            where.AND = [
                ...(where.AND || []),
                {
                    ...(dateFrom ? { dateDebut: { gte: new Date(dateFrom) } } : {}),
                    ...(dateTo ? { dateExpiration: { lte: new Date(dateTo) } } : {}),
                },
            ];
        }

        // Montants
        if (minMontant || maxMontant) {
            where.montant = {};
            if (minMontant) where.montant.gte = new Prisma.Decimal(minMontant);
            if (maxMontant) where.montant.lte = new Prisma.Decimal(maxMontant);
        }

        const include = {
            organization: String(withOrg) === "true",
            payments: String(withPayments) === "true",
        };

        const [rows, total] = await Promise.all([
            prisma.abonnement.findMany({
                where,
                include,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.abonnement.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENTS_LISTED",
            resource: "abonnements",
            details: {
                organizationId,
                activeOnly: String(activeOnly) === "true",
                expiredOnly: String(expiredOnly) === "true",
                dateFrom,
                dateTo,
                minMontant,
                maxMontant,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            abonnements: rows.map((r) =>
                shapeAbonnement(r, {
                    withOrganization: include.organization,
                    withPayments: include.payments,
                })
            ),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            filters: {
                organizationId: organizationId || null,
                activeOnly: String(activeOnly) === "true",
                expiredOnly: String(expiredOnly) === "true",
                dateFrom: dateFrom || null,
                dateTo: dateTo || null,
                minMontant: minMontant || null,
                maxMontant: maxMontant || null,
                sortBy,
                sortOrder,
            },
        });
    } catch (e) {
        console.error("ABO_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération abonnements", code: "GET_ABO_ERROR" });
    }
};

// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const withOrg = String(req.query.withOrg || "true") === "true";
        const withPayments = String(req.query.withPayments || "false") === "true";

        const abo = await prisma.abonnement.findUnique({
            where: { id },
            include: {
                organization: withOrg,
                payments: withPayments,
            },
        });

        if (!abo) {
            return res.status(404).json({ message: "Abonnement introuvable", code: "ABO_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_VIEWED",
            resource: "abonnements",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            abonnement: shapeAbonnement(abo, {
                withOrganization: withOrg,
                withPayments: withPayments,
            }),
        });
    } catch (e) {
        console.error("ABO_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération abonnement", code: "GET_ABO_ERROR" });
    }
};

// ============ CREATE ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }

        const { organizationId, dateDebut, dateExpiration } = req.body || {};
        let { montant } = req.body || {};


        if (!organizationId || !dateDebut || !dateExpiration || montant == null) {
            return res.status(400).json({
                message: "organizationId, dateDebut, dateExpiration et montant sont requis",
                code: "MISSING_REQUIRED_FIELDS",
            });
        }

        const dDeb = new Date(dateDebut);
        const dExp = new Date(dateExpiration);

        if (!(dDeb instanceof Date && !isNaN(dDeb)) ||
            !(dExp instanceof Date && !isNaN(dExp)) ||
            dDeb >= dExp) {
            return res.status(400).json({
                message: "Période invalide (dateDebut doit être antérieure à dateExpiration)",
                code: "INVALID_PERIOD",
            });
        }

        // Vérifier que l'organisation existe
        const org = await prisma.organization.findUnique({
            where: { id: organizationId },
        });

        if (montant == null) {
            const q = computeAbonnementPriceForOrgType(org.type);
            montant = q.amount;
        }

        if (!org) {
            return res.status(400).json({
                message: "Organisation introuvable",
                code: "ORGANIZATION_NOT_FOUND",
            });
        }
        const abo = await prisma.abonnement.create({
            data: {
                organizationId,
                dateDebut: dDeb,
                dateExpiration: dExp,
                montant: new Prisma.Decimal(montant),
                isDeleted: false,
            },
        });
        try {
            await emailService.sendAbonnementConfirmation(org, abo);

        } catch (mailErr) {
            console.warn("EMAIL_ABO_CONFIRM_FAILED:", mailErr.message);
            // optionnel: loguer un audit séparé
            await createAuditLog({
                userId: res.locals.user.id,
                action: "ABONNEMENT_CONFIRMATION_EMAIL_FAILED",
                resource: "abonnements",
                resourceId: abo.id,
                details: { reason: mailErr.message },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_CREATED",
            resource: "abonnements",
            resourceId: abo.id,
            details: {
                organizationId,
                dateDebut: dDeb,
                dateExpiration: dExp,
                montant,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({
            message: "Abonnement créé",
            abonnement: shapeAbonnement(abo),
        });
    } catch (e) {
        console.error("ABO_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création abonnement", code: "CREATE_ABO_ERROR" });
    }
};

// ============ UPDATE ============
exports.update = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }

        const { id } = req.params;
        const current = await prisma.abonnement.findUnique({
            where: { id },
            select: { organizationId: true, dateDebut: true, dateExpiration: true },
        });

        if (!current) {
            return res.status(404).json({
                message: "Abonnement introuvable",
                code: "ABO_NOT_FOUND",
            });
        }

        const patch = {...req.body };

        if (patch.dateDebut !== undefined) {
            patch.dateDebut = new Date(patch.dateDebut);
        }
        if (patch.dateExpiration !== undefined) {
            patch.dateExpiration = new Date(patch.dateExpiration);
        }
        if (patch.montant !== undefined) {
            patch.montant = new Prisma.Decimal(patch.montant);
        }

        // Vérifier la période si modifiée
        const dDeb = patch.dateDebut || current.dateDebut;
        const dExp = patch.dateExpiration || current.dateExpiration;

        if (!(dDeb instanceof Date && !isNaN(dDeb)) ||
            !(dExp instanceof Date && !isNaN(dExp)) ||
            dDeb >= dExp) {
            return res.status(400).json({
                message: "Période invalide (dateDebut doit être antérieure à dateExpiration)",
                code: "INVALID_PERIOD",
            });
        }

        // Vérifier qu'il n'y a pas de chevauchement
        if (await hasOverlap({
                organizationId: current.organizationId,
                dateDebut: dDeb,
                dateExpiration: dExp,
                excludeId: id,
            })) {
            return res.status(409).json({
                message: "Chevauchement d'abonnement pour cette organisation",
                code: "ABO_OVERLAP",
            });
        }

        const updated = await prisma.abonnement.update({
            where: { id },
            data: patch,
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_UPDATED",
            resource: "abonnements",
            resourceId: id,
            details: patch,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Abonnement mis à jour",
            abonnement: shapeAbonnement(updated),
        });
    } catch (e) {
        console.error("ABO_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour abonnement", code: "UPDATE_ABO_ERROR" });
    }
};

// ============ SOFT DELETE ============
exports.softDelete = async(req, res) => {
    try {
        const { id } = req.params;

        const abo = await prisma.abonnement.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!abo) {
            return res.status(404).json({
                message: "Abonnement introuvable",
                code: "ABO_NOT_FOUND",
            });
        }

        await prisma.abonnement.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_SOFT_DELETED",
            resource: "abonnements",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Abonnement archivé" });
    } catch (e) {
        console.error("ABO_SOFT_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec archivage abonnement", code: "SOFT_DELETE_ABO_ERROR" });
    }
};

// ============ RESTORE ============
exports.restore = async(req, res) => {
    try {
        const { id } = req.params;

        const abo = await prisma.abonnement.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!abo) {
            return res.status(404).json({
                message: "Abonnement introuvable",
                code: "ABO_NOT_FOUND",
            });
        }

        const restored = await prisma.abonnement.update({
            where: { id },
            data: { isDeleted: false, deletedAt: null },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_RESTORED",
            resource: "abonnements",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Abonnement restauré",
            abonnement: shapeAbonnement(restored),
        });
    } catch (e) {
        console.error("ABO_RESTORE_ERROR:", e);
        res.status(500).json({ message: "Échec restauration abonnement", code: "RESTORE_ABO_ERROR" });
    }
};

// ============ HARD DELETE ============
exports.hardDelete = async(req, res) => {
    try {
        const { id } = req.params;

        const abo = await prisma.abonnement.findUnique({
            where: { id },
            select: { isDeleted: true },
        });

        if (!abo) {
            return res.status(404).json({
                message: "Abonnement introuvable",
                code: "ABO_NOT_FOUND",
            });
        }

        if (!abo.isDeleted) {
            return res.status(400).json({
                message: "Archiver l'abonnement avant suppression définitive",
                code: "ABO_NOT_ARCHIVED",
            });
        }

        await prisma.abonnement.delete({ where: { id } });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_HARD_DELETED",
            resource: "abonnements",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Abonnement supprimé définitivement" });
    } catch (e) {
        console.error("ABO_HARD_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec suppression définitive", code: "HARD_DELETE_ABO_ERROR" });
    }
};

// ============ RENEW ============
exports.renew = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }

        const { id } = req.params;
        const { dateDebut, dateExpiration, montant } = req.body || {};

        const src = await prisma.abonnement.findUnique({
            where: { id },
            select: { organizationId: true },
        });

        if (!src) {
            return res.status(404).json({
                message: "Abonnement source introuvable",
                code: "ABO_NOT_FOUND",
            });
        }

        const dDeb = new Date(dateDebut);
        const dExp = new Date(dateExpiration);

        if (!(dDeb instanceof Date && !isNaN(dDeb)) ||
            !(dExp instanceof Date && !isNaN(dExp)) ||
            dDeb >= dExp) {
            return res.status(400).json({
                message: "Période invalide pour le renouvellement",
                code: "INVALID_PERIOD",
            });
        }

        if (await hasOverlap({
                organizationId: src.organizationId,
                dateDebut: dDeb,
                dateExpiration: dExp,
            })) {
            return res.status(409).json({
                message: "Chevauchement détecté sur la période de renouvellement",
                code: "ABO_OVERLAP",
            });
        }

        const renewed = await prisma.abonnement.create({
            data: {
                organizationId: src.organizationId,
                dateDebut: dDeb,
                dateExpiration: dExp,
                montant: new Prisma.Decimal(montant),
                isDeleted: false,
            },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ABONNEMENT_RENEWED",
            resource: "abonnements",
            resourceId: renewed.id,
            details: {
                sourceId: id,
                dateDebut: dDeb,
                dateExpiration: dExp,
                montant,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({
            message: "Renouvellement créé",
            abonnement: shapeAbonnement(renewed),
        });
    } catch (e) {
        console.error("ABO_RENEW_ERROR:", e);
        res.status(500).json({ message: "Échec renouvellement", code: "RENEW_ABO_ERROR" });
    }
};

// ============ ACTIVE FOR ORG ============
exports.getActiveForOrg = async(req, res) => {
    try {
        const { orgId } = req.params;
        const now = new Date();

        const abo = await prisma.abonnement.findFirst({
            where: {
                organizationId: orgId,
                isDeleted: false,
                dateDebut: { lte: now },
                dateExpiration: { gte: now },
            },
            orderBy: { dateExpiration: "desc" },
            include: { organization: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ACTIVE_ABONNEMENT_FOR_ORG_VIEWED",
            resource: "abonnements",
            details: { organizationId: orgId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            abonnement: abo ? shapeAbonnement(abo, { withOrganization: true }) : null,
        });
    } catch (e) {
        console.error("ABO_ACTIVE_FOR_ORG_ERROR:", e);
        res.status(500).json({ message: "Échec récupération actif org", code: "ACTIVE_FOR_ORG_ERROR" });
    }
};

// ============ EXPIRING SOON ============
exports.expiringSoon = async(req, res) => {
    try {
        const { days = 30, organizationId } = req.query;
        const now = new Date();
        const end = new Date(now.getTime() + Number(days) * 24 * 3600 * 1000);

        const where = {
            isDeleted: false,
            dateDebut: { lte: now },
            dateExpiration: { gt: now, lte: end },
        };

        if (organizationId) where.organizationId = organizationId;

        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const [rows, total] = await Promise.all([
            prisma.abonnement.findMany({
                where,
                include: { organization: true },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.abonnement.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "EXPIRING_ABONNEMENTS_VIEWED",
            resource: "abonnements",
            details: { days: Number(days), organizationId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            abonnements: rows.map((r) => shapeAbonnement(r, { withOrganization: true })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            filters: {
                days: Number(days),
                organizationId: organizationId || null,
            },
        });
    } catch (e) {
        console.error("ABO_EXPIRING_SOON_ERROR:", e);
        res.status(500).json({ message: "Échec récupération expirants", code: "EXPIRING_SOON_ERROR" });
    }
};

// ============ STATS ============

exports.stats = async(req, res) => {
        try {
            const orgId = req.query.organizationId || undefined;
            const now = new Date();

            const baseWhere = {
                isDeleted: false,
                ...(orgId ? { organizationId: orgId } : {}),
            };

            const [total, active, expired, sumAll, totalsByMonth] = await Promise.all([
                        prisma.abonnement.count({ where: baseWhere }),
                        prisma.abonnement.count({
                            where: {...baseWhere, dateDebut: { lte: now }, dateExpiration: { gte: now } },
                        }),
                        prisma.abonnement.count({
                            where: {...baseWhere, dateExpiration: { lt: now } },
                        }),
                        prisma.abonnement.aggregate({
                            where: baseWhere,
                            _sum: { montant: true },
                        }),
                        prisma.$queryRaw `
        SELECT
          date_trunc('month', "createdAt") AS month,
          SUM("montant")::numeric          AS total_montant,
          COUNT(*)::int                    AS nbr
        FROM "Abonnement"
        WHERE "isDeleted" = false
        ${orgId ? Prisma.sql`AND "organizationId" = ${orgId}` : Prisma.empty}
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    await createAuditLog({
      userId: res.locals.user.id,
      action: "ABONNEMENT_STATS_VIEWED",
      resource: "abonnements",
      details: { organizationId: orgId },
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({
      total,
      active,
      expired,
      revenueTotal: sumAll?._sum?.montant ? sumAll._sum.montant.toString() : "0",
      totalsByMonth: (totalsByMonth || []).map((r) => ({
        month: r.month instanceof Date ? r.month.toISOString() : r.month,
        totalMontant: r.total_montant ? r.total_montant.toString() : "0",
        count: Number(r.nbr) || 0,
      })),
    });
  } catch (e) {
    console.error("ABO_STATS_ERROR:", e);
    res.status(500).json({ message: "Échec stats abonnements", code: "ABO_STATS_ERROR" });
  }
};