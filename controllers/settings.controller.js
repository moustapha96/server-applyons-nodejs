// controllers/settings.controller.js
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const { createAuditLog } = require("../utils/audit");

const prisma = new PrismaClient();

// Utilise la table Configuration comme KV store
const SETTINGS_KEY = "SITE_SETTINGS";

// Valeurs par défaut si aucune config
const DEFAULT_SETTINGS = {
    siteName: "RIAFCO",
    contactEmail: null,
    urlSite: null,
    socialMedia: {}, // ex: { facebook: "", twitter: "" }
    footer: null,
    contactPhone: null,
    contactMobile: null,
    contactAddress: null,
    logo: null, // ex: "/uploads/settings/logo-xxx.png"
    favicon: null, // ex: "/uploads/settings/favicon-xxx.ico"
};

const parseValue = (conf) => {
    if (!conf.value) return {...DEFAULT_SETTINGS };
    try {
        const v = JSON.parse(conf.value);
        return {...DEFAULT_SETTINGS, ...v };
    } catch {
        return {...DEFAULT_SETTINGS };
    }
};

const serializeForSave = (obj) => JSON.stringify(obj || {}, null, 2);

// Helpers pour clean upload en cas d'erreur
const removeFileIfExists = (filepathAbs) => {
    try {
        if (fs.existsSync(filepathAbs)) fs.unlinkSync(filepathAbs);
    } catch {}
};

// ------------------ Controllers ------------------

exports.getSiteSettings = async(req, res) => {
    try {
        const settings = await prisma.siteSettings.findFirst();
        if (!settings) {
            // Si aucun paramètre n'existe, en créer un par défaut
            const defaultSettings = await prisma.siteSettings.create({
                data: {
                    siteName: "APPLYONS",
                },
            });
            return res.json({
                success: true,
                data: defaultSettings,
            });
        }
        res.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error("Get site settings error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching site settings",
            error: error.message,
        });
    }
};

exports.updateSiteSettings = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        // Récupération des données du corps de la requête
        const {
            siteName,
            contactEmail,
            urlSite,
            socialMedia,
            footer,
            contactPhone,
            contactMobile,
            contactAddress,
        } = req.body;

        // Récupération des fichiers
        const logo = req.files.logo && req.files.logo[0];
        const favicon = req.files.favicon && req.files.favicon[0];

        // Récupération des paramètres actuels
        let settings = await prisma.siteSettings.findFirst();
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: "Applyons",
                },
            });
        }

        const updateData = {
            siteName: siteName || settings.siteName,
            contactEmail: contactEmail || settings.contactEmail,
            footer: footer || settings.footer,
            contactPhone: contactPhone || settings.contactPhone,
            contactMobile: contactMobile || settings.contactMobile,
            contactAddress: contactAddress || settings.contactAddress,
            urlSite: urlSite || settings.urlSite
        };

        if (socialMedia) {
            try {
                updateData.socialMedia = JSON.parse(socialMedia);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: "Social media must be a valid JSON object",
                });
            }
        } else {
            updateData.socialMedia = settings.socialMedia;
        }

        if (logo) {
            updateData.logo = `/settings/${logo.filename}`
        }
        if (favicon) {
            updateData.favicon = `/settings/${favicon.filename}`
        }


        // Mise à jour ou création des paramètres
        const updatedSettings = await prisma.siteSettings.update({
            where: { id: settings.id },
            data: updateData,
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "UPDATE_SETTINGS",
            resource: "SiteSettings",
            resourceId: updatedSettings.id,
            details: updateData,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.json({
            success: true,
            message: "Site settings updated successfully",
            data: updatedSettings,
        });

    } catch (error) {
        console.error("Update site settings error:", error);
        // Supprimer les nouveaux fichiers en cas d'erreur
        if (req.files.logo && req.files.logo[0]) {
            const logoPath = path.join(__dirname, "../../", req.files.logo[0].path);
            if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
        }
        if (req.files.favicon && req.files.favicon[0]) {
            const faviconPath = path.join(__dirname, "../../", req.files.favicon[0].path);
            if (fs.existsSync(faviconPath)) fs.unlinkSync(faviconPath);
        }
        res.status(500).json({
            success: false,
            message: "Error updating site settings",
            error: error.message,
        });
    }
};

// controllers/audit.controller.js
exports.getAuditLogs = async(req, res) => {
    try {
        const {
            page = 1,
                limit = 10,
                // filtres unitaires
                userId,
                ip,
                // filtres multi (CSV ou array)
                action,
                actions, // alias
                resource,
                resources, // alias

                // période (2 alias)
                dateFrom,
                dateTo,
                from,
                to,

                // recherche plein texte
                search,

                // tri
                sortBy = "createdAt",
                sortOrder = "desc",
        } = req.query;

        // ---------- helpers ----------
        const toInt = (v, d) => {
            const n = Number(v);
            return Number.isFinite(n) && n > 0 ? n : d;
        };
        const parseCsvOrArray = (v) => {
            if (!v) return [];
            if (Array.isArray(v)) return v.filter(Boolean);
            return String(v)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        };
        const parseDate = (v, endOfDay = false) => {
            if (!v) return undefined;
            const d = new Date(v);
            if (isNaN(d.getTime())) return undefined;
            // si endOfDay, set 23:59:59.999
            if (endOfDay) d.setHours(23, 59, 59, 999);
            return d;
        };

        const pageNum = toInt(page, 1);
        const limitNum = toInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // ---------- filtres ----------
        const actionsList = parseCsvOrArray(actions || action);
        const resourcesList = parseCsvOrArray(resources || resource);

        // période (supporte dateFrom/dateTo ou from/to)
        const startDate = parseDate(dateFrom || from, false);
        const endDate = parseDate(dateTo || to, true);

        // where se construit en AND de blocs
        const whereAND = [];

        // multi-critères IN
        if (actionsList.length) whereAND.push({ action: { in: actionsList } });
        if (resourcesList.length) whereAND.push({ resource: { in: resourcesList } });

        // unitaires
        if (userId) whereAND.push({ userId: String(userId) });
        if (ip) whereAND.push({ ipAddress: { contains: String(ip), mode: "insensitive" } });

        // période
        if (startDate || endDate) {
            whereAND.push({
                createdAt: {
                    gte: startDate || undefined,
                    lte: endDate || undefined,
                },
            });
        }

        // recherche plein-texte
        if (search && String(search).trim()) {
            const q = String(search).trim();

            const orBlock = [
                { ipAddress: { contains: q, mode: "insensitive" } },
                { userAgent: { contains: q, mode: "insensitive" } },
                { action: { contains: q, mode: "insensitive" } },
                { resource: { contains: q, mode: "insensitive" } },
                { resourceId: { contains: q, mode: "insensitive" } },
                // champs sur l'utilisateur joint
                { user: { email: { contains: q, mode: "insensitive" } } },
                { user: { username: { contains: q, mode: "insensitive" } } },
                { user: { firstName: { contains: q, mode: "insensitive" } } },
                { user: { lastName: { contains: q, mode: "insensitive" } } },
            ];

            // ⚠️ Si `details` est de type String/TEXT dans Prisma:
            // orBlock.push({ details: { contains: q, mode: "insensitive" } });

            // ⚠️ Si `details` est JSON/JsonB, Prisma ne supporte pas `contains: string`.
            // Solutions:
            //  - Ajouter une colonne `detailsText` (trigger ou enregistrement) et chercher dessus
            //  - OU faire une query brute Postgres: `WHERE details::text ILIKE '%q%'`
            // Exemple (optionnel) :
            // const audits = await prisma.$queryRaw`SELECT ... FROM "AuditLog" WHERE details::text ILIKE ${'%' + q + '%'} ...`

            whereAND.push({ OR: orBlock });
        }

        const where = whereAND.length ? { AND: whereAND } : {};

        // ---------- tri sécurisé ----------
        const ALLOWED_SORT = new Set([
            "createdAt",
            "action",
            "resource",
            "resourceId",
            "ipAddress",
            "userId",
        ]);
        const sortField = ALLOWED_SORT.has(String(sortBy)) ? String(sortBy) : "createdAt";
        const sortDir = String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc";

        // ---------- requêtes ----------
        const [audits, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: {
                    [sortField]: sortDir
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            adress: true,
                            avatar: true,
                        },
                    },
                },
            }),
            prisma.auditLog.count({ where }),
        ]);

        return res.json({
            success: true,
            data: audits,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
            filters: {
                actions: actionsList,
                resources: resourcesList,
                userId: userId || null,
                ip: ip || null,
                search: search || null,
                dateFrom: startDate || null,
                dateTo: endDate || null,
                sortBy: sortField,
                sortOrder: sortDir,
            },
        });
    } catch (error) {
        console.error("Get audit log error:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting audit log",
            error: error.message,
        });
    }
};