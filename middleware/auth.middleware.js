const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { createAuditLog } = require("../utils/audit");
const prisma = new PrismaClient();

const ERROR_MESSAGES = {
    NO_TOKEN: { message: "Accès refusé. Aucun token fourni.", code: "NO_TOKEN" },
    INVALID_TOKEN: { message: "Token invalide.", code: "INVALID_TOKEN" },
    USER_NOT_FOUND: { message: "Utilisateur non trouvé.", code: "USER_NOT_FOUND" },
    ACCOUNT_INACTIVE: { message: "Compte inactif.", code: "ACCOUNT_INACTIVE" },
    ACCOUNT_ARCHIVED: { message: "Compte archivé.", code: "ACCOUNT_ARCHIVED" },
    INSUFFICIENT_PERMISSIONS: { message: "Permissions insuffisantes.", code: "INSUFFICIENT_PERMISSIONS" },
    AUTH_REQUIRED: { message: "Authentification requise.", code: "AUTH_REQUIRED" },
    PERMISSION_REFUSED: (permissionKeyOrName) => ({
        message: `Permission refusée. Vous n'avez pas la permission "${permissionKeyOrName}".`,
        code: "PERMISSION_REFUSED",
    }),
    FILE_REQUIRED: { message: "Fichier requis.", code: "FILE_REQUIRED" },
    FILE_TOO_LARGE: { message: "Fichier trop volumineux (max 50MB).", code: "FILE_TOO_LARGE" },
    INVALID_FILE_TYPE: { message: "Type de fichier non autorisé.", code: "INVALID_FILE_TYPE" },
    DOCUMENT_ENCRYPTION_REQUIRED: { message: "Le document doit être chiffré pour cette opération.", code: "DOCUMENT_ENCRYPTION_REQUIRED" },
    DOCUMENT_INTEGRITY_VIOLATION: { message: "Violation d'intégrité du document détectée.", code: "DOCUMENT_INTEGRITY_VIOLATION" },
};

// --- helpers ---
function extractToken(req) {
    const h = req.headers.authorization || req.headers.Authorization;
    if (h && typeof h === "string" && h.startsWith("Bearer ")) return h.slice(7).trim();
    if (req.cookies.jwt) return req.cookies.jwt;
    return null;
}

function safeAudit(payload) {
    try {
        if (typeof createAuditLog === "function") {
            createAuditLog(payload);
        }
    } catch (_) {
        // audit optionnel: on ignore toute erreur
    }
}

// --- checkUser (optionnel: remplit res.locals.user si connecté) ---
exports.checkUser = async(req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            res.locals.user = null;
            return next();
        }

        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decoded) => {
            if (err) {
                res.locals.user = null;
                return next();
            }

            try {
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        role: true,
                        enabled: true,
                        deletedAt: true,
                        phone: true,
                        avatar: true,
                        country: true,
                        organization: { select: { id: true, name: true, slug: true, type: true } },
                        permissions: { select: { key: true, name: true } },
                    },
                });

                if (user && user.enabled && !user.deletedAt) {
                    res.locals.user = {
                        ...user,
                        permissionKeys: user.permissions.map(p => p.key) || [],
                        permissionNames: user.permissions.map(p => p.name) || [],
                    };
                } else {
                    res.locals.user = null;
                }

                return next();
            } catch (dbError) {
                console.error("Erreur DB checkUser:", dbError);
                res.locals.user = null;
                return next();
            }
        });
    } catch (error) {
        console.error("Erreur checkUser:", error);
        res.locals.user = null;
        return next();
    }
};

// --- requireAuth (exige session valide) ---
exports.requireAuth = (req, res, next) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json(ERROR_MESSAGES.NO_TOKEN);

    jwt.verify(token, process.env.TOKEN_SECRET, async(err, decoded) => {
        if (err) return res.status(401).json(ERROR_MESSAGES.INVALID_TOKEN);

        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                    enabled: true,
                    deletedAt: true,
                    phone: true,
                    avatar: true,
                    country: true,
                    organization: { select: { id: true, name: true, slug: true, type: true } },
                    permissions: { select: { key: true, name: true } },
                },
            });

            if (!user) return res.status(401).json(ERROR_MESSAGES.USER_NOT_FOUND);
            if (!user.enabled) return res.status(403).json(ERROR_MESSAGES.ACCOUNT_INACTIVE);
            if (user.deletedAt) return res.status(403).json(ERROR_MESSAGES.ACCOUNT_ARCHIVED);

            res.locals.user = {
                ...user,
                permissionKeys: user.permissions.map(p => p.key) || [],
                permissionNames: user.permissions.map(p => p.name) || [],
            };

            return next();
        } catch (dbError) {
            console.error("Erreur DB requireAuth:", dbError);
            return res.status(500).json({ message: "Erreur interne du serveur.", code: "DATABASE_ERROR" });
        }
    });
};

// --- requireRole (RBAC par rôle) ---
exports.requireRole = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        const u = res.locals.user;
        if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

        if (!allowed.includes(u.role)) {
            safeAudit({
                userId: u.id,
                action: "TENTATIVE_ACCES_NON_AUTORISEE",
                resource: req.originalUrl,
                details: { rolesRequis: allowed, roleUtilisateur: u.role },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(403).json({
                message: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS.message,
                code: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS.code,
                required: allowed,
                current: u.role,
            });
        }

        return next();
    };
};

// --- requirePermission (RBAC par permission) ---
exports.requirePermission = (permissionKeyOrName) => {
    return (req, res, next) => {
        const u = res.locals.user;
        if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

        // priorité à la clé; fallback sur le nom pour compat
        const has =
            (u.permissionKeys && u.permissionKeys.includes(permissionKeyOrName)) ||
            (u.permissionNames && u.permissionNames.includes(permissionKeyOrName));

        if (!has) {
            safeAudit({
                userId: u.id,
                action: "PERMISSION_REFUSEE",
                resource: permissionKeyOrName,
                details: {
                    permissionRequise: permissionKeyOrName,
                    permissionsUtilisateur: u.permissionKeys,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED(permissionKeyOrName));
        }

        return next();
    };
};

// --- requireAnyPermission (au moins une permission parmi plusieurs) ---
exports.requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        const u = res.locals.user;
        if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

        const hasPermission = permissions.some(perm =>
            (u.permissionKeys && u.permissionKeys.includes(perm)) ||
            (u.permissionNames && u.permissionNames.includes(perm))
        );

        if (!hasPermission) {
            safeAudit({
                userId: u.id,
                action: "PERMISSION_REFUSEE",
                resource: permissions.join(","),
                details: {
                    permissionsRequises: permissions,
                    permissionsUtilisateur: u.permissionKeys,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(403).json({
                message: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS.message,
                code: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS.code,
                required: permissions,
            });
        }

        return next();
    };
};

// --- Middleware pour vérifier les permissions de chiffrement ---
exports.canEncrypt = (req, res, next) => {
    const u = res.locals.user;
    if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

    const hasPermission =
        u.permissionKeys.includes("documents.encrypt") ||
        u.permissionKeys.includes("documents.manage") ||
        u.role === "ADMIN";

    if (!hasPermission) {
        safeAudit({
            userId: u.id,
            action: "ENCRYPTION_PERMISSION_REFUSED",
            resource: "documents.encrypt",
            details: {
                permissionsUtilisateur: u.permissionKeys,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("documents.encrypt"));
    }

    return next();
};

// --- Middleware pour vérifier les permissions de déchiffrement ---
exports.canDecrypt = (req, res, next) => {
    const u = res.locals.user;
    if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

    const hasPermission =
        u.permissionKeys.includes("documents.decrypt") ||
        u.permissionKeys.includes("documents.read") ||
        u.permissionKeys.includes("documents.manage") ||
        u.role === "ADMIN";

    if (!hasPermission) {
        safeAudit({
            userId: u.id,
            action: "DECRYPTION_PERMISSION_REFUSED",
            resource: "documents.decrypt",
            details: {
                permissionsUtilisateur: u.permissionKeys,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("documents.decrypt"));
    }

    return next();
};

// --- Middleware pour vérifier les permissions de traduction ---
exports.canTranslate = (req, res, next) => {
    const u = res.locals.user;
    if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

    const hasPermission =
        u.permissionKeys.includes("documents.translate") ||
        u.permissionKeys.includes("documents.manage") ||
        u.role === "TRADUCTEUR" ||
        u.role === "ADMIN";

    if (!hasPermission) {
        safeAudit({
            userId: u.id,
            action: "TRANSLATION_PERMISSION_REFUSED",
            resource: "documents.translate",
            details: {
                permissionsUtilisateur: u.permissionKeys,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("documents.translate"));
    }

    return next();
};

// --- Middleware pour vérifier les permissions de vérification d'intégrité ---
exports.canVerifyIntegrity = (req, res, next) => {
    const u = res.locals.user;
    if (!u) return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);

    const hasPermission =
        u.permissionKeys.includes("documents.verify") ||
        u.permissionKeys.includes("documents.manage") ||
        u.role === "ADMIN" ||
        u.role === "SUPERVISEUR";

    if (!hasPermission) {
        safeAudit({
            userId: u.id,
            action: "INTEGRITY_VERIFICATION_PERMISSION_REFUSED",
            resource: "documents.verify",
            details: {
                permissionsUtilisateur: u.permissionKeys,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("documents.verify"));
    }

    return next();
};

// --- Middleware pour vérifier que le document est chiffré ---
exports.requireEncryptedDocument = async(req, res, next) => {
    try {
        const { id } = req.params;
        const document = await prisma.documentPartage.findUnique({
            where: { id },
            select: { urlChiffre: true, encryptionKey: true }
        });

        if (!document) {
            return res.status(404).json({ message: "Document introuvable", code: "DOCUMENT_NOT_FOUND" });
        }

        if (!document.urlChiffre || !document.encryptionKey) {
            return res.status(403).json(ERROR_MESSAGES.DOCUMENT_ENCRYPTION_REQUIRED);
        }

        return next();
    } catch (error) {
        console.error("Erreur requireEncryptedDocument:", error);
        return res.status(500).json({ message: "Erreur serveur", code: "SERVER_ERROR" });
    }
};

// --- Middleware pour vérifier l'intégrité du document ---
exports.verifyDocumentIntegrity = async(req, res, next) => {
    try {
        const { id } = req.params;
        const document = await prisma.documentPartage.findUnique({
            where: { id },
            select: {
                urlChiffre: true,
                encryptionKey: true,
                encryptionIV: true,
                blockchainHash: true
            }
        });

        if (!document) {
            return res.status(404).json({ message: "Document introuvable", code: "DOCUMENT_NOT_FOUND" });
        }

        if (document.urlChiffre && document.blockchainHash) {
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const encryptedPath = path.join(tempDir, `verify_${id}.enc`);
            await cryptoService.downloadFile(document.urlChiffre, encryptedPath);

            const decryptedPath = path.join(tempDir, `verify_${id}.dec`);
            await cryptoService.decryptFile(
                encryptedPath,
                document.encryptionKey,
                document.encryptionIV,
                decryptedPath
            );

            const fileData = fs.readFileSync(decryptedPath);
            const currentHash = cryptoService.calculateHash(fileData);

            // Nettoyage
            fs.unlinkSync(encryptedPath);
            fs.unlinkSync(decryptedPath);

            if (currentHash !== document.blockchainHash) {
                return res.status(403).json(ERROR_MESSAGES.DOCUMENT_INTEGRITY_VIOLATION);
            }
        }

        return next();
    } catch (error) {
        console.error("Erreur verifyDocumentIntegrity:", error);
        return res.status(500).json({ message: "Erreur vérification intégrité", code: "INTEGRITY_VERIFICATION_ERROR" });
    }
};

// --- Middleware pour valider les fichiers uploadés ---
exports.validateFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json(ERROR_MESSAGES.FILE_REQUIRED);
    }

    // Vérifier la taille
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || "50") * 1024 * 1024; // 50MB par défaut
    if (req.file.size > maxSize) {
        return res.status(400).json({
            ...ERROR_MESSAGES.FILE_TOO_LARGE,
            details: {
                maxSize: `${maxSize / (1024 * 1024)}MB`,
                actualSize: `${Math.round(req.file.size / (1024 * 1024))}MB`
            }
        });
    }

    // Vérifier le type MIME
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            ...ERROR_MESSAGES.INVALID_FILE_TYPE,
            details: {
                allowedTypes,
                actualType: req.file.mimetype
            }
        });
    }

    return next();
};

// --- Middleware pour vérifier que l'utilisateur a accès au document ---
exports.checkDocumentAccess = async(req, res, next) => {
    try {
        const { id } = req.params;
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);
        }

        const document = await prisma.documentPartage.findUnique({
            where: { id },
            include: {
                demandePartage: {
                    include: {
                        user: true,
                        targetOrg: true,
                        assignedOrg: true
                    }
                },
                ownerOrg: true
            }
        });

        if (!document) {
            return res.status(404).json({ message: "Document introuvable", code: "DOCUMENT_NOT_FOUND" });
        }

        // Vérifier les permissions
        const hasAccess =
            // L'utilisateur est le demandeur original
            document.demandePartage.userId === user.id ||
            // L'utilisateur appartient à l'organisation cible
            user.organizationId === document.demandePartage.targetOrgId ||
            // L'utilisateur appartient à l'organisation assignée
            user.organizationId === document.demandePartage.assignedOrgId ||
            // L'utilisateur est le propriétaire du document (organisation)
            user.organizationId === document.ownerOrgId ||
            // L'utilisateur a la permission explicite
            user.permissionKeys.includes("documents.read") ||
            user.permissionKeys.includes("documents.manage") ||
            user.role === "ADMIN";

        if (!hasAccess) {
            safeAudit({
                userId: user.id,
                action: "DOCUMENT_ACCESS_DENIED",
                resource: "documents",
                resourceId: id,
                details: {
                    userOrganization: user.organizationId,
                    documentOwner: document.ownerOrgId,
                    targetOrg: document.demandePartage.targetOrgId,
                    assignedOrg: document.demandePartage.assignedOrgId
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("documents.read"));
        }

        // Passer le document à la requête
        res.locals.document = document;
        return next();
    } catch (error) {
        console.error("Erreur checkDocumentAccess:", error);
        return res.status(500).json({ message: "Erreur vérification accès", code: "ACCESS_VERIFICATION_ERROR" });
    }
};

// --- Middleware pour vérifier que l'utilisateur peut gérer les documents de la demande ---
exports.checkDemandeDocumentAccess = async(req, res, next) => {
    try {
        const { demandeId } = req.params;
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json(ERROR_MESSAGES.AUTH_REQUIRED);
        }

        const demande = await prisma.demandePartage.findUnique({
            where: { id: demandeId },
            include: {
                user: true,
                targetOrg: true,
                assignedOrg: true
            }
        });

        if (!demande) {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }

        // Vérifier les permissions
        const hasAccess =
            // L'utilisateur est le demandeur original
            demande.userId === user.id ||
            // L'utilisateur appartient à l'organisation cible
            user.organizationId === demande.targetOrgId ||
            // L'utilisateur appartient à l'organisation assignée
            user.organizationId === demande.assignedOrgId ||
            // L'utilisateur a la permission explicite
            user.permissionKeys.includes("demandes.manage") ||
            user.permissionKeys.includes("documents.manage") ||
            user.role === "ADMIN";

        if (!hasAccess) {
            safeAudit({
                userId: user.id,
                action: "DEMANDE_DOCUMENT_ACCESS_DENIED",
                resource: "demandes",
                resourceId: demandeId,
                details: {
                    userOrganization: user.organizationId,
                    targetOrg: demande.targetOrgId,
                    assignedOrg: demande.assignedOrgId
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(403).json(ERROR_MESSAGES.PERMISSION_REFUSED("demandes.manage"));
        }

        // Passer la demande à la requête
        res.locals.demande = demande;
        return next();
    } catch (error) {
        console.error("Erreur checkDemandeDocumentAccess:", error);
        return res.status(500).json({ message: "Erreur vérification accès", code: "ACCESS_VERIFICATION_ERROR" });
    }
};