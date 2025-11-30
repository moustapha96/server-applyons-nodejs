// controllers/user.controller.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { createAuditLog } = require("../utils/audit");
const emailService = require("../services/email.service");
const prisma = new PrismaClient();
const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const SORTABLE = new Set(["createdAt", "updatedAt", "email", "username", "firstName", "lastName", "enabled", "role"]);

const shapeUser = (u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    firstName: u.firstName,
    lastName: u.lastName,
    enabled: u.enabled,
    gender: u.gender,
    adress: u.adress,
    phone: u.phone,
    country: u.country,
    avatar: u.avatar,
    organization: u.organization ? {
        id: u.organization.id,
        name: u.organization.name,
        slug: u.organization.slug,
        type: u.organization.type
    } : null,
    permissions: u.permissions.map((p) => ({
        id: p.id,
        key: p.key,
        name: p.name
    })) || [],
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
});

// ============ LIST ALL USERS ============
exports.list = async(req, res) => {
    try {
        const {
            page = 1,
                limit = 10,
                search,
                role,
                enabled,
                organizationId,
                permissionKey,
                sortBy = "createdAt",
                sortOrder = "desc",
        } = req.query;

        const where = {};
        if (typeof enabled !== "undefined") where.enabled = String(enabled) === "true";
        if (role) where.role = role;
        if (organizationId) where.organizationId = organizationId;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: "insensitive" } },
                { username: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { country: { contains: search, mode: "insensitive" } },
            ];
        }
        if (permissionKey) {
            where.permissions = { some: { key: permissionKey } };
        }

        const safeSortBy = SORTABLE.has(String(sortBy)) ? String(sortBy) : "createdAt";
        const safeSortOrder = String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
        const skip = (Number(page) - 1) * Number(limit);

        const [rows, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { permissions: true, organization: true },
                orderBy: {
                    [safeSortBy]: safeSortOrder
                },
                skip,
                take: Number(limit),
            }),
            prisma.user.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USERS_LISTED",
            resource: "users",
            details: { search, role, enabled, organizationId, permissionKey },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            users: rows.map(shapeUser),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: {
                search: search || null,
                role: role || null,
                enabled: enabled || null,
                organizationId: organizationId || null,
                permissionKey: permissionKey || null,
                sortBy: safeSortBy,
                sortOrder: safeSortOrder,
            },
        });
    } catch (e) {
        console.error("GET_USERS_ERROR:", e);
        res.status(500).json({ message: "Échec récupération utilisateurs", code: "GET_USERS_ERROR" });
    }
};

// ============ GET USER BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { permissions: true, organization: true },
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable", code: "USER_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_VIEWED",
            resource: "users",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ user: shapeUser(user) });
    } catch (e) {
        console.error("GET_USER_ERROR:", e);
        res.status(500).json({ message: "Échec récupération utilisateur", code: "GET_USER_ERROR" });
    }
};

// ============ CREATE USER ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR"
            });
        }

        const {
            username,
            email,
            password,
            role = "DEMANDEUR",
            enabled = true,
            organizationId = null,
            permissions = [],
            phone,
            adress,
            country,
            firstName,
            lastName,
            gender = "MALE",
        } = req.body;

        const lowerEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email: lowerEmail }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email déjà utilisé",
                code: "EMAIL_EXISTS"
            });
        }

        // Vérifier que l'organisation existe si fournie
        if (organizationId) {
            const org = await prisma.organization.findUnique({
                where: { id: organizationId }
            });

            if (!org) {
                return res.status(400).json({
                    message: "Organisation introuvable",
                    code: "ORGANIZATION_NOT_FOUND"
                });
            }
        }

        // Générer un mot de passe temporaire si non fourni
        const tempPassword = password || crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        // Récupérer les permissions si fournies
        const permRecords = permissions.length ?
            await prisma.permission.findMany({
                where: { key: { in: permissions } }
            }) : [];
        
        let avatar = null;
        if (req.file) {
            avatar = `/profiles/${req.file.filename}`
        }

        const user = await prisma.user.create({
            data: {
                username: username || lowerEmail.split("@")[0],
                email: lowerEmail,
                passwordHash: hashedPassword,
                role,
                firstName,
                lastName,
                enabled: Boolean(enabled),
                phone: phone || null,
                adress: adress || null,
                country: country || null,
                gender,
                avatar,
                ...(organizationId ? { organization: { connect: { id: organizationId } } } : {}),
                permissions: {
                    connect: permRecords.map(p => ({ id: p.id }))
                },
            },
            include: { organization: true, permissions: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_CREATED",
            resource: "users",
            resourceId: user.id,
            details: {
                email: user.email,
                role: user.role,
                permissions: permissions,
                organizationId: user.organizationId
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({
            message: "Utilisateur créé",
            user: shapeUser(user),
            ...(password ? {} : { temporaryPassword: tempPassword })
        });
    } catch (e) {
        console.error("CREATE_USER_ERROR:", e);
        res.status(500).json({ message: "Échec création utilisateur", code: "CREATE_USER_ERROR" });
    }
};

// ============ UPDATE USER ============
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
        const {
            username,
            email,
            role,
            enabled,
            organizationId,
            permissions, // <— tableau de keys (ex: ["demande.read", "docs.verify"])
            phone,
            adress,
            country,
            firstName,
            lastName,
            gender,
        } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND",
            });
        }

        // Email déjà utilisé ?
        if (email && email.toLowerCase().trim() !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: { email: email.toLowerCase().trim(), id: { not: id } },
            });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email déjà utilisé par un autre utilisateur",
                    code: "EMAIL_EXISTS",
                });
            }
        }

        // Organisation existe ?
        if (organizationId) {
            const org = await prisma.organization.findUnique({ where: { id: organizationId } });
            if (!org) {
                return res.status(400).json({
                    message: "Organisation introuvable",
                    code: "ORGANIZATION_NOT_FOUND",
                });
            }
        }

        const data = {};
        if (username !== undefined) data.username = username.trim();
        if (email !== undefined) data.email = email.toLowerCase().trim();
        if (role !== undefined) data.role = role;
        if (enabled !== undefined) data.enabled = Boolean(enabled);
        if (organizationId !== undefined) data.organizationId = organizationId || null;
        if (phone !== undefined) data.phone = phone || null;
        if (adress !== undefined) data.adress = adress || null;
        if (country !== undefined) data.country = country || null;
        if (gender !== undefined) data.gender = gender;
        if (firstName !== undefined) data.firstName = firstName || null;
        if (lastName !== undefined) data.lastName = lastName || null;

        // Avatar upload (comme sur updateProfile)
        if (req.file) {
            data.avatar = `/profiles/${req.file.filename}`
        }
        console.log(data)
        console.log(req.file)
        // —— Mise à jour des infos "profil" de base
        await prisma.user.update({ where: { id }, data });

        // —— Mise à jour/Création des permissions (si fournies)
        if (Array.isArray(permissions)) {
            // Normalisation + dédup
            const keys = [...new Set(
                permissions
                .filter(Boolean)
                .map((k) => String(k).trim())
                .filter((k) => k.length > 0)
            )];

            if (keys.length === 0) {
                // Si tableau vide → on supprime toutes les permissions liées
                await prisma.user.update({
                    where: { id },
                    data: { permissions: { set: [] } },
                });
            } else {
                // upsert de chaque permission manquante
                await prisma.$transaction(
                    keys.map((key) =>
                        prisma.permission.upsert({
                            where: { key },
                            update: {}, // rien à mettre à jour pour l’instant
                            create: {
                                key,
                                // name par défaut lisible à partir de la key (ex: "demande.read" → "Demande.read")
                                name: key
                                    .split(".")
                                    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                                    .join("."),
                            },
                        })
                    )
                );

                // Récupère les permissions (ids) et connecte-les à l’utilisateur (en remplaçant l’existant)
                const permRecords = await prisma.permission.findMany({ where: { key: { in: keys } } });
                await prisma.user.update({
                    where: { id },
                    data: {
                        permissions: {
                            set: [], // on repart propre
                            connect: permRecords.map((p) => ({ id: p.id })),
                        },
                    },
                });
            }
        }

        const updatedUser = await prisma.user.findUnique({
            where: { id },
            include: { organization: true, permissions: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_UPDATED",
            resource: "users",
            resourceId: id,
            details: req.body,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Utilisateur mis à jour",
            user: shapeUser(updatedUser),
        });
    } catch (e) {
        console.error("UPDATE_USER_ERROR:", e);
        res.status(500).json({
            message: "Échec mise à jour utilisateur",
            code: "UPDATE_USER_ERROR",
        });
    }
};

// ============ RESET PASSWORD ============
exports.resetPassword = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        // Générer un nouveau mot de passe temporaire
        const tempPassword = crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        await prisma.user.update({
            where: { id },
            data: { passwordHash: hashedPassword }
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PASSWORD_RESET_BY_ADMIN",
            resource: "users",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Mot de passe réinitialisé",
            temporaryPassword: tempPassword
        });
    } catch (e) {
        console.error("RESET_PASSWORD_ERROR:", e);
        res.status(500).json({ message: "Échec réinitialisation mot de passe", code: "RESET_PASSWORD_ERROR" });
    }
};

// ============ ARCHIVE USER ============
exports.archive = async(req, res) => {
    try {
        const { id } = req.params;

        // Empêcher un utilisateur de s'archiver lui-même
        if (id === res.locals.user.id) {
            return res.status(403).json({
                message: "Impossible de s'auto-archiver",
                code: "SELF_ARCHIVE"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        await prisma.user.update({
            where: { id },
            data: {
                enabled: false,
                deletedAt: new Date()
            }
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_ARCHIVED",
            resource: "users",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Utilisateur archivé" });
    } catch (e) {
        console.error("ARCHIVE_USER_ERROR:", e);
        res.status(500).json({ message: "Échec archivage utilisateur", code: "ARCHIVE_USER_ERROR" });
    }
};

// ============ RESTORE USER ============
exports.restore = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        await prisma.user.update({
            where: { id },
            data: {
                enabled: true,
                deletedAt: null
            }
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_RESTORED",
            resource: "users",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Utilisateur restauré" });
    } catch (e) {
        console.error("RESTORE_USER_ERROR:", e);
        res.status(500).json({ message: "Échec restauration utilisateur", code: "RESTORE_USER_ERROR" });
    }
};

// ============ UPDATE USER PERMISSIONS ============
exports.updatePermissions = async(req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                message: "Les permissions doivent être un tableau",
                code: "INVALID_PERMISSIONS_FORMAT"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        const permRecords = permissions.length ?
            await prisma.permission.findMany({
                where: { key: { in: permissions } }
            }) : [];

        await prisma.user.update({
            where: { id },
            data: {
                permissions: {
                    set: [],
                    connect: permRecords.map(p => ({ id: p.id }))
                }
            }
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USER_PERMISSIONS_UPDATED",
            resource: "users",
            resourceId: id,
            details: { permissions },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        const updatedUser = await prisma.user.findUnique({
            where: { id },
            include: { permissions: true }
        });

        res.status(200).json({
            message: "Permissions utilisateur mises à jour",
            user: shapeUser(updatedUser)
        });
    } catch (e) {
        console.error("UPDATE_PERMISSIONS_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour permissions", code: "UPDATE_PERMISSIONS_ERROR" });
    }
};

// ============ SEARCH USERS ============
exports.search = async(req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Le paramètre de recherche 'q' est requis",
                code: "SEARCH_PARAM_REQUIRED"
            });
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: q, mode: "insensitive" } },
                    { username: { contains: q, mode: "insensitive" } },
                    { phone: { contains: q, mode: "insensitive" } },
                    { country: { contains: q, mode: "insensitive" } },
                ],
                enabled: true,
                deletedAt: null
            },
            include: { organization: true },
            take: Number(limit)
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "USERS_SEARCHED",
            resource: "users",
            details: { searchTerm: q },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            users: users.map(shapeUser)
        });
    } catch (e) {
        console.error("SEARCH_USERS_ERROR:", e);
        res.status(500).json({ message: "Échec recherche utilisateurs", code: "SEARCH_USERS_ERROR" });
    }
};



// module.exports.sendMailToUser = async(req, res) => {
//     try {
//         const {
//             to,
//             cc,
//             bcc,
//             replyTo,

//             // mode 1: via template .hbs
//             templateName, // ex: "contact-to-admin", "contact-confirmation", "generic-notification"
//             context = {}, // données injectées au template
//             subject, // requis si templateName est défini (sera préfixé par [siteName] par buildCommonEmail)

//             // mode 2: envoi “raw” (sans template) — soit html, soit text
//             html,
//             text,

//             // pièces jointes
//             attachments, // [{ filename, content|path, contentType }]

//             // options additionnelles
//             notifyAdmins = false,
//             adminTemplateName, // sinon réutilise templateName
//             adminEmails, // string|array ; fallback sur settings.contactEmail|support@applyons.org
//             createAudit = true, // trace d’audit optionnelle
//         } = req.body || {};

//         // ---------- validations ----------
//         const recipients = Array.isArray(to) ? to.filter(Boolean) : (to ? [to] : []);
//         if (!recipients.length) {
//             return res.status(400).json({ message: "Champ 'to' requis (string ou array d'emails)" });
//         }

//         const isTemplateMode = !!templateName;
//         const isRawMode = !!html || !!text;

//         if (!isTemplateMode && !isRawMode) {
//             return res.status(400).json({
//                 message: "Spécifie un 'templateName' (mode template) OU 'html'/'text' (mode raw).",
//             });
//         }
//         if (isTemplateMode && !subject) {
//             return res.status(400).json({
//                 message: "En mode template, 'subject' est requis.",
//             });
//         }

//         // Normaliser pièces jointes
//         const atts = Array.isArray(attachments) ? attachments : undefined;

//         // Récupérer settings pour fallback admin
//         const siteSettings = await emailService.getSiteSettings().catch(() => null);
//         const defaultAdmin = siteSettings.contactEmail || "support@applyons.org";
//         const adminList = adminEmails ?
//             (Array.isArray(adminEmails) ? adminEmails : [adminEmails]) : [defaultAdmin];

//         const results = [];

//         // ---------- envois aux destinataires ----------
//         for (const recipient of recipients) {
//             // MODE TEMPLATE
//             if (isTemplateMode) {
//                 const r = await emailService.sendMailToUser(recipient, {
//                     templateName,
//                     subject,
//                     context,
//                     cc,
//                     bcc,
//                     replyTo,
//                     attachments: atts,
//                     createAudit, // emailService fera l’audit si implémenté
//                 });
//                 results.push({ to: recipient, status: "sent", transport: "template", info: r });
//             }
//             // MODE RAW
//             else {
//                 const r = await emailService.sendEmail({
//                     to: recipient,
//                     subject: subject || "(Sans sujet)",
//                     html,
//                     text,
//                     cc,
//                     bcc,
//                     replyTo,
//                     attachments: atts,
//                 });
//                 try {
//                     if (createAudit && typeof createAuditLog === "function") {
//                         await createAuditLog({
//                             userId: res.locals.user.id || null,
//                             action: "EMAIL_SENT",
//                             resource: "emails",
//                             details: { to: recipient, subject: subject || "(Sans sujet)", raw: true },
//                             ipAddress: req.ip,
//                             userAgent: req.get("User-Agent"),
//                         });
//                     }
//                 } catch (e) { console.warn("EMAIL_AUDIT_WARN:", e.message || e); }

//                 results.push({ to: recipient, status: "sent", transport: "raw", info: r });
//             }
//         }

//         // ---------- notification admins optionnelle ----------
//         if (notifyAdmins && adminList.length) {
//             const adminTmpl = adminTemplateName || templateName || "generic-notification";
//             const adminSubject = subject || "Notification";

//             for (const adminEmail of adminList) {
//                 const r = await emailService.sendMailToUser(adminEmail, {
//                     templateName: adminTmpl,
//                     subject: `Copie admin — ${adminSubject}`,
//                     context: {
//                         ...context,
//                         meta: {
//                             sentFor: recipients,
//                             requestedBy: res.locals.user.id || null,
//                             path: req.originalUrl,
//                             date: new Date().toISOString(),
//                         },
//                     },
//                     bcc: [], // évite d’empiler du bcc sur bcc
//                     replyTo,
//                     attachments: atts,
//                     createAudit,
//                 });
//                 results.push({ to: adminEmail, status: "sent", transport: "template(admin)", info: r });
//             }
//         }

//         return res.status(200).json({
//             message: "Emails envoyés avec succès",
//             count: results.length,
//             results,
//         });
//     } catch (error) {
//         console.error("MAIL_SEND_ERROR:", error);
//         return res.status(500).json({
//             message: "Échec de l'envoi des emails",
//             code: "MAIL_SEND_ERROR",
//             error: error.message || String(error),
//         });
//     }
// };


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function parseCsvOrArray(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
    return String(v)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
}

function uniq(list) {
    return Array.from(new Set(list.map((s) => s.toLowerCase()))); // case-insensitive
}

function isValidEmail(e) {
    return EMAIL_REGEX.test(String(e));
}

function normalizeEmails(v) {
    return uniq(parseCsvOrArray(v)).filter(isValidEmail);
}

module.exports.sendMailToUser = async(req, res) => {
    const fs = require("fs").promises;
    const path = require("path");
    
    try {
        // 1. Extraction et validation des paramètres
        let {
            to,
            cc,
            bcc,
            replyTo,
            templateName,
            context: contextRaw = {},
            subject,
            html,
            text,
            attachments: attachmentsRaw,
            notifyAdmins = false,
            adminEmails,
            createAudit = true,
        } = req.body || {};

        // Parser le context si c'est une string JSON
        let context = contextRaw;
        if (typeof contextRaw === 'string') {
            try {
                context = JSON.parse(contextRaw);
            } catch (e) {
                context = {};
            }
        }

        // Parser les attachments si c'est une string JSON
        let attachments = attachmentsRaw;
        if (typeof attachmentsRaw === 'string') {
            try {
                attachments = JSON.parse(attachmentsRaw);
            } catch (e) {
                attachments = [];
            }
        }

        // Normalisation des emails
        const toList = normalizeEmails(to);
        const ccList = normalizeEmails(cc);
        const bccList = normalizeEmails(bcc);

        if (!toList.length) {
            return res.status(400).json({ message: "Champ 'to' requis (email(s))" });
        }
        if (replyTo && !isValidEmail(replyTo)) {
            return res.status(400).json({ message: "Reply-To invalide" });
        }

        // Vérification du mode (template ou raw)
        const isTemplateMode = !!templateName;
        const isRawMode = !!html || !!text;
        if (!isTemplateMode && !isRawMode) {
            return res.status(400).json({
                message: "Spécifie un 'templateName' (mode template) OU 'html'/'text' (mode raw).",
            });
        }
        if (isTemplateMode && !subject) {
            return res.status(400).json({ message: "En mode template, 'subject' est requis." });
        }

        // 2. Traitement des pièces jointes
        const processedAttachments = [];

        // 2.1. Fichiers uploadés via multer (req.files)
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const filePath = file.path;
                    const fileContent = await fs.readFile(filePath);
                    
                    processedAttachments.push({
                        filename: file.originalname || path.basename(file.filename),
                        content: fileContent,
                        contentType: file.mimetype || undefined,
                        // Optionnel: supprimer le fichier après envoi
                        // path: filePath, // pour nodemailer
                    });
                } catch (error) {
                    console.error(`Erreur lecture fichier uploadé ${file.filename}:`, error.message);
                }
            }
        }

        // 2.2. Fichiers fournis dans le body (attachments)
        if (Array.isArray(attachments) && attachments.length > 0) {
            for (const att of attachments) {
                try {
                    // Format 1: Base64
                    if (att.content && typeof att.content === 'string' && att.content.startsWith('data:')) {
                        const matches = att.content.match(/^data:([^;]+);base64,(.+)$/);
                        if (matches) {
                            const contentType = matches[1];
                            const base64Data = matches[2];
                            processedAttachments.push({
                                filename: att.filename || 'attachment',
                                content: Buffer.from(base64Data, 'base64'),
                                contentType: contentType,
                            });
                            continue;
                        }
                    }

                    // Format 2: Base64 simple
                    if (att.content && typeof att.content === 'string') {
                        try {
                            const buffer = Buffer.from(att.content, 'base64');
                            processedAttachments.push({
                                filename: att.filename || 'attachment',
                                content: buffer,
                                contentType: att.contentType || att.mimetype || 'application/octet-stream',
                            });
                            continue;
                        } catch (e) {
                            // Pas du base64 valide, continuer
                        }
                    }

                    // Format 3: Path (fichier sur le serveur)
                    if (att.path) {
                        try {
                            const filePath = path.isAbsolute(att.path) ? att.path : path.join(process.cwd(), att.path);
                            const fileContent = await fs.readFile(filePath);
                            processedAttachments.push({
                                filename: att.filename || path.basename(att.path),
                                content: fileContent,
                                contentType: att.contentType || att.mimetype || undefined,
                            });
                            continue;
                        } catch (error) {
                            console.error(`Erreur lecture fichier ${att.path}:`, error.message);
                        }
                    }

                    // Format 4: URL (télécharger depuis URL)
                    if (att.url) {
                        try {
                            const axios = require('axios');
                            const response = await axios.get(att.url, { responseType: 'arraybuffer' });
                            processedAttachments.push({
                                filename: att.filename || path.basename(new URL(att.url).pathname) || 'attachment',
                                content: Buffer.from(response.data),
                                contentType: att.contentType || response.headers['content-type'] || 'application/octet-stream',
                            });
                            continue;
                        } catch (error) {
                            console.error(`Erreur téléchargement ${att.url}:`, error.message);
                        }
                    }

                    // Format 5: Buffer direct
                    if (Buffer.isBuffer(att.content)) {
                        processedAttachments.push({
                            filename: att.filename || 'attachment',
                            content: att.content,
                            contentType: att.contentType || att.mimetype || 'application/octet-stream',
                        });
                        continue;
                    }

                    // Format 6: Objet nodemailer standard
                    if (att.filename && (att.content || att.path)) {
                        processedAttachments.push(att);
                    }
                } catch (error) {
                    console.error('Erreur traitement pièce jointe:', error.message);
                }
            }
        }

        // 2.3. Préparation des données pour l'email principal
        const emailData = {
            to: toList,
            cc: ccList,
            bcc: bccList,
            replyTo: replyTo || undefined,
            subject: isTemplateMode ? subject : subject || "(Sans sujet)",
            attachments: processedAttachments.length > 0 ? processedAttachments : undefined,
        };

        // 3. Envoi de l'email principal
        let resultMain;
        try {
            if (isTemplateMode) {
                resultMain = await emailService.sendNotificationEmail({
                    to: emailData.to,
                    cc: emailData.cc,
                    bcc: emailData.bcc,
                    replyTo: emailData.replyTo,
                    subject: emailData.subject,
                    context,
                    templateName,
                    attachments: emailData.attachments,
                });
            } else {
                resultMain = await emailService.sendEmailWithAttachments({
                    to: emailData.to,
                    cc: emailData.cc,
                    bcc: emailData.bcc,
                    replyTo: emailData.replyTo,
                    subject: emailData.subject,
                    message: text || html,
                    isHtml: !!html,
                    attachments: emailData.attachments,
                });
            }
        } catch (mainError) {
            console.error("Erreur envoi email principal (mode tableau) :", mainError.message);

            // Fallback : conversion des tableaux en chaînes CSV
            const toCsv = toList.join(", ");
            const ccCsv = ccList.length ? ccList.join(", ") : undefined;
            const bccCsv = bccList.length ? bccList.join(", ") : undefined;

            try {
                if (isTemplateMode) {
                    resultMain = await emailService.sendNotificationEmail({
                        to: toCsv,
                        cc: ccCsv,
                        bcc: bccCsv,
                        subject: emailData.subject,
                        context,
                        templateName,
                        attachments: emailData.attachments,
                    });
                } else {
                    resultMain = await emailService.sendEmailWithAttachments({
                        to: toCsv,
                        cc: ccCsv,
                        bcc: bccCsv,
                        subject: emailData.subject,
                        message: text || html,
                        isHtml: !!html,
                        attachments: emailData.attachments,
                    });
                }
            } catch (fallbackError) {
                console.error("Erreur envoi email principal (mode fallback) :", fallbackError.message);
                throw fallbackError;
            }
        }

        // 4. Audit de l'envoi principal
        if (createAudit && typeof createAuditLog === "function") {
            await createAuditLog({
                userId: res.locals.user.id || null,
                action: "EMAIL_SENT",
                resource: "emails",
                details: {
                    to: toList,
                    cc: ccList.length ? "(hidden)" : undefined,
                    bcc: bccList.length ? "(hidden)" : undefined,
                    subject: emailData.subject,
                    template: isTemplateMode ? templateName : undefined,
                    attachmentsCount: processedAttachments.length,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });
        }

        // 5. Nettoyage des fichiers temporaires uploadés (optionnel)
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // Optionnel: supprimer les fichiers après envoi
            // for (const file of req.files) {
            //     try {
            //         await fs.unlink(file.path);
            //     } catch (e) {
            //         console.warn(`Impossible de supprimer ${file.path}:`, e.message);
            //     }
            // }
        }

        // 6. Notification aux admins
        const adminResults = [];
        if (notifyAdmins) {
            const siteSettings = await emailService.getSiteSettings().catch(() => null);
            const defaultAdmin = (siteSettings.contactEmail) || "support@applyons.org";
            const adminList = normalizeEmails(adminEmails && adminEmails.length ? adminEmails : [defaultAdmin]);

            if (adminList.length) {
                const adminContext = {
                    ...context,
                    meta: {
                        sentFor: toList,
                        cc: ccList.length ? "(hidden)" : undefined,
                        bcc: bccList.length ? "(hidden)" : undefined,
                        requestedBy: res.locals.user.id || null,
                        path: req.originalUrl,
                        date: new Date().toISOString(),
                    },
                };

                try {
                    adminResults.push(
                        await emailService.sendNotificationEmail({
                            to: adminList,
                            subject: `[Copie Admin] ${emailData.subject}`,
                            context: adminContext,
                            templateName: "generic-notification",
                            attachments: emailData.attachments,
                        })
                    );
                } catch (adminError) {
                    console.error("Erreur envoi email aux admins :", adminError.message);
                    adminResults.push({ error: adminError.message });
                }
            }
        }

        // 7. Réponse réussie
        return res.status(200).json({
            message: "Emails envoyés avec succès",
            results: [
                { scope: "main", status: "success", info: resultMain },
                ...(adminResults.length ? [{ scope: "admins", status: "success", info: adminResults }] : []),
            ],
        });

    } catch (error) {
        console.error("MAIL_SEND_ERROR:", error);
        return res.status(500).json({
            message: "Échec de l'envoi des emails",
            code: "MAIL_SEND_ERROR",
            error: error.message || String(error),
        });
    }
};