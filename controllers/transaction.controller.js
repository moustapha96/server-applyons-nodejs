// controllers/transaction.controller.js
const { PrismaClient, Prisma } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");
const prisma = new PrismaClient();

const shapeTransaction = (tx) => ({
    id: tx.id,
    demandePartageId: tx.demandePartageId,
    userId: tx.userId,
    montant: tx.montant.toString(),
    dateTransaction: tx.dateTransaction,
    typePaiement: tx.typePaiement,
    typeTransaction: tx.typeTransaction,
    statut: tx.statut,
    isDeleted: tx.isDeleted,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
    user: tx.user ? {
        id: tx.user.id,
        email: tx.user.email,
        username: tx.user.username,
    } : null,
    demandePartage: tx.demandePartage ? {
        id: tx.demandePartage.id,
        code: tx.demandePartage.code,
        status: tx.demandePartage.status,
    } : null,
    payment: tx.payment ? {
        id: tx.payment.id,
        status: tx.payment.status,
        amount: tx.payment.amount.toString(),
        provider: tx.payment.provider,
    } : null,
});

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const { page = 1, limit = 10, statut, userId, from, to } = req.query;
        const where = { isDeleted: false };
        if (statut) where.statut = statut;
        if (userId) where.userId = userId;
        if (from || to) {
            where.dateTransaction = {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
            };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [rows, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: { user: true, demandePartage: true, payment: true },
                orderBy: { dateTransaction: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.transaction.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTIONS_LISTED",
            resource: "transactions",
            details: { statut, userId, from, to },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            transactions: rows.map(shapeTransaction),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: { statut, userId, from, to },
        });
    } catch (e) {
        console.error("TX_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération transactions", code: "GET_TX_ERROR" });
    }
};

// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const tx = await prisma.transaction.findUnique({
            where: { id },
            include: { user: true, demandePartage: true, payment: true },
        });

        if (!tx) {
            return res.status(404).json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_VIEWED",
            resource: "transactions",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ transaction: shapeTransaction(tx) });
    } catch (e) {
        console.error("TX_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération transaction", code: "GET_TX_ERROR" });
    }
};

// ============ CREATE ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const {
            demandePartageId,
            userId,
            montant,
            typePaiement,
            typeTransaction,
            statut = "PENDING",
        } = req.body || {};

        if (!demandePartageId || !montant || !typePaiement) {
            return res.status(400).json({
                message: "demandePartageId, montant et typePaiement requis",
                code: "MISSING_REQUIRED_FIELDS",
            });
        }

        // Vérifier que la demande de partage existe
        const demande = await prisma.demandePartage.findUnique({
            where: { id: demandePartageId },
        });

        if (!demande) {
            return res.status(400).json({ message: "Demande de partage introuvable", code: "DEMANDE_NOT_FOUND" });
        }

        // Vérifier que l'utilisateur existe si userId est fourni
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(400).json({ message: "Utilisateur introuvable", code: "USER_NOT_FOUND" });
            }
        }

        const tx = await prisma.transaction.create({
            data: {
                demandePartageId,
                userId: userId || res.locals.user.id || null,
                montant: new Prisma.Decimal(montant),
                typePaiement,
                typeTransaction: typeTransaction || null,
                statut,
            },
            include: { user: true, demandePartage: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_CREATED",
            resource: "transactions",
            resourceId: tx.id,
            details: {
                demandePartageId,
                userId: tx.userId,
                montant,
                typePaiement,
                statut,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Transaction créée", transaction: shapeTransaction(tx) });
    } catch (e) {
        console.error("TX_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création transaction", code: "CREATE_TX_ERROR" });
    }
};

// ============ UPDATE STATUT ============
exports.updateStatut = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params;
        const { statut } = req.body || {};

        if (!statut) {
            return res.status(400).json({ message: "Le statut est requis", code: "STATUS_REQUIRED" });
        }

        const tx = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!tx) {
            return res.status(404).json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
        }

        const updated = await prisma.transaction.update({
            where: { id },
            data: { statut },
            include: { user: true, demandePartage: true, payment: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_STATUS_UPDATED",
            resource: "transactions",
            resourceId: id,
            details: { statut },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Statut mis à jour", transaction: shapeTransaction(updated) });
    } catch (e) {
        console.error("TX_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour transaction", code: "UPDATE_TX_ERROR" });
    }
};

// ============ SOFT DELETE ============
exports.softDelete = async(req, res) => {
    try {
        const { id } = req.params;

        const tx = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!tx) {
            return res.status(404).json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
        }

        const updated = await prisma.transaction.update({
            where: { id },
            data: { isDeleted: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_SOFT_DELETED",
            resource: "transactions",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Transaction archivée" });
    } catch (e) {
        console.error("TX_SOFT_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec archivage transaction", code: "SOFT_DELETE_TX_ERROR" });
    }
};

// ============ RESTORE ============
exports.restore = async(req, res) => {
    try {
        const { id } = req.params;

        const tx = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!tx) {
            return res.status(404).json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
        }

        const updated = await prisma.transaction.update({
            where: { id },
            data: { isDeleted: false },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_RESTORED",
            resource: "transactions",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Transaction restaurée" });
    } catch (e) {
        console.error("TX_RESTORE_ERROR:", e);
        res.status(500).json({ message: "Échec restauration transaction", code: "RESTORE_TX_ERROR" });
    }
};

// ============ STATS ============
exports.stats = async(req, res) => {
    try {
        const { statut, typePaiement, from, to } = req.query;

        const where = { isDeleted: false };
        if (statut) where.statut = statut;
        if (typePaiement) where.typePaiement = typePaiement;
        if (from || to) {
            where.dateTransaction = {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
            };
        }

        // Statistiques par statut
        const byStatut = await prisma.transaction.groupBy({
            by: ["statut"],
            where,
            _count: { _all: true },
            orderBy: {
                _count: {
                    _all: "desc",
                },
            },
        });

        // Statistiques par type de paiement
        const byTypePaiement = await prisma.transaction.groupBy({
            by: ["typePaiement"],
            where,
            _count: { _all: true },
            _sum: {
                montant: true,
            },
            orderBy: {
                _count: {
                    _all: "desc",
                },
            },
        });

        // Montant total par période
        const totalAmount = await prisma.transaction.aggregate({
            where,
            _sum: {
                montant: true,
            },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "TRANSACTION_STATS_VIEWED",
            resource: "transactions",
            details: { statut, typePaiement, from, to },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            byStatut: byStatut.map((item) => ({
                statut: item.statut,
                count: item._count._all,
            })),
            byTypePaiement: byTypePaiement.map((item) => ({
                typePaiement: item.typePaiement,
                count: item._count._all,
                totalAmount: item._sum.montant.toString() || "0",
            })),
            totalAmount: totalAmount._sum.montant.toString() || "0",
        });
    } catch (e) {
        console.error("TX_STATS_ERROR:", e);
        res.status(500).json({ message: "Échec récupération statistiques", code: "GET_TX_STATS_ERROR" });
    }
};