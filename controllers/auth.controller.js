// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const { createAuditLog } = require("../utils/audit");
const emailService = require("../services/email.service");
const prisma = new PrismaClient();

const ACCESS_MAX_AGE_MS = 24 * 3600 * 1000; // 1 jour en cookie
const maxAge = process.env.JWT_EXPIRES_IN || "1d";
const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "jwt";
const SECURE_COOKIE = process.env.NODE_ENV === "production";

const slugify = (s) =>
    String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-|\-$/g, "");

async function ensureUniqueOrgSlug(base, tx) {
    const baseSlug = slugify(base);
    if (!baseSlug) return null;
    let slug = baseSlug;
    let i = 1;
    // boucle de vérification atomique via la transaction `tx`
    // évite les collisions pendant la création
    // NB: findUnique({ where: { slug } }) suppose un index/unique @unique sur Organization.slug (déjà présent)
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const dupe = await tx.organization.findUnique({ where: { slug } });
        if (!dupe) return slug;
        slug = `${baseSlug}-${i++}`;
    }
}


// Helpers
const sign = (payload, opts = {}) => {
    if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET manquant");
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: maxAge, ...opts });
};

const setAuthCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: SECURE_COOKIE,
        sameSite: "strict",
        maxAge: ACCESS_MAX_AGE_MS,
    });
};

const clearAuthCookie = (res) => {
    res.cookie(COOKIE_NAME, "", {
        httpOnly: true,
        secure: SECURE_COOKIE,
        sameSite: "strict",
        maxAge: 1,
    });
};

const shapeUser = (u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    enabled: u.enabled,
    firstName: u.firstName,
    lastName: u.lastName,
    avatar: u.avatar,
    phone: u.phone,
    adress: u.adress,
    gender: u.gender,
    country: u.country,
    organization: u.organization ? {
        id: u.organization.id,
        name: u.organization.name,
        slug: u.organization.slug,
        type: u.organization.type,
    } : null,
    permissions: u.permissions.map((p) => ({
        id: p.id,
        key: p.key,
        name: p.name
    })) || [],
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
});

// ============ REGISTER ============
/**
 * Inscription d'un nouvel utilisateur
 */
exports.register = async(req, res) => {
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
            gender = "MALE",
            adress = null,
            phone = null,
            country = null,
            organizationId = null,
            permissions = [],
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

        // Résoudre les permissions par key
        const permRecords = permissions.length ?
            await prisma.permission.findMany({
                where: { key: { in: permissions } }
            }) : [];

        const allPermRecords = await prisma.permission.findMany();


        // Générer un token d'activation
        const activationToken = crypto.randomBytes(24).toString("hex");
        const activationExpiry = new Date(Date.now() + 24 * 3600 * 1000);

        const hash = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                username: username || lowerEmail.split("@")[0],
                email: lowerEmail,
                passwordHash: hash,
                role,
                gender,
                phone: phone.trim(),
                adress,
                country,
                tokenActiveted: activationToken,
                expiresAt: activationExpiry,
                ...(organizationId ? { organization: { connect: { id: organizationId } } } : {}),
                permissions: {
                    connect: allPermRecords.map((p) => ({ id: p.id })),
                },
            },
            include: { permissions: true, organization: true },
        });

        try {
            await emailService.sendAccountActivationEmail(user, activationToken);
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError);
        }


        await createAuditLog({
            userId: user.id,
            action: "REGISTER",
            resource: "auth",
            resourceId: user.id,
            details: {
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // TODO: Envoyer l'email d'activation avec activationToken
        const token = sign({ id: user.id });
        setAuthCookie(res, token);

        res.status(201).json({
            message: "Inscription réussie",
            token,
            requiresActivation: true,
            user: shapeUser(user),
        });
    } catch (e) {
        console.error("REGISTER_ERROR:", e);
        res.status(500).json({
            message: "Échec de l'inscription",
            code: "REGISTRATION_ERROR"
        });
    }
};

// ============ LOGIN ============
/**
 * Connexion d'un utilisateur
 */
exports.login = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR"
            });
        }

        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
            where: { email: lowerEmail },
            include: { permissions: true, organization: true },
        });

        if (!user) {
            return res.status(401).json({
                message: "Identifiants invalides",
                code: "INVALID_CREDENTIALS"
            });
        }

        if (!user.enabled) {
            return res.status(403).json({
                message: "Compte désactivé",
                code: "ACCOUNT_DISABLED"
            });
        }

        if (user.deletedAt) {
            return res.status(403).json({
                message: "Compte archivé",
                code: "ACCOUNT_ARCHIVED"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Identifiants invalides",
                code: "INVALID_CREDENTIALS"
            });
        }

        const token = sign({ id: user.id });
        setAuthCookie(res, token);

        await createAuditLog({
            userId: user.id,
            action: "LOGIN",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: shapeUser(user),
        });
    } catch (e) {
        console.error("LOGIN_ERROR:", e);
        res.status(500).json({
            message: "Échec de la connexion",
            code: "LOGIN_ERROR"
        });
    }
};

// ============ LOGOUT ============
/**
 * Déconnexion de l'utilisateur
 */
exports.logout = async(req, res) => {
    try {
        clearAuthCookie(res);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "LOGOUT",
            resource: "auth",
            resourceId: res.locals.user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (e) {
        console.error("LOGOUT_ERROR:", e);
        res.status(500).json({
            message: "Échec de la déconnexion",
            code: "LOGOUT_ERROR"
        });
    }
};

// ============ PROFILE ============
/**
 * Récupère le profil de l'utilisateur connecté
 */
exports.getProfile = async(req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: res.locals.user.id },
            include: { permissions: true, organization: true },
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        await createAuditLog({
            userId: user.id,
            action: "PROFILE_VIEWED",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ user: shapeUser(user) });
    } catch (e) {
        console.error("PROFILE_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération profil",
            code: "PROFILE_ERROR"
        });
    }
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
exports.updateProfile = async(req, res) => {
    try {
        const { username, phone, adress, avatar, country, firstName, lastName } = req.body;
        const data = {};

        if (username !== undefined) data.username = username.trim();
        if (phone !== undefined) data.phone = phone.trim() || null;
        if (adress !== undefined) data.adress = adress.trim() || null;
        if (country !== undefined) data.country = country.trim() || null;
        if (firstName !== undefined) data.firstName = firstName.trim() || null;
        if (lastName !== undefined) data.lastName = lastName.trim() || null;

        console.log(data)
        console.log(req.file)
        if (req.file) {
            data.avatar = `/profiles/${req.file.filename}`
        }

        const updatedUser = await prisma.user.update({
            where: { id: res.locals.user.id },
            data,
            include: { permissions: true, organization: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PROFILE_UPDATED",
            resource: "auth",
            resourceId: res.locals.user.id,
            details: data,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Profil mis à jour",
            user: shapeUser(updatedUser)
        });
    } catch (e) {
        console.error("UPDATE_PROFILE_ERROR:", e);
        res.status(500).json({
            message: "Échec mise à jour profil",
            code: "UPDATE_PROFILE_ERROR"
        });
    }
};

// ============ PASSWORD ============
/**
 * Change le mot de passe de l'utilisateur connecté
 */
exports.changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: res.locals.user.id }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordMatch) {
            return res.status(400).json({
                message: "Mot de passe actuel invalide",
                code: "INVALID_CURRENT_PASSWORD"
            });
        }

        const newHash = await bcrypt.hash(newPassword, saltRounds);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash }
        });

        await createAuditLog({
            userId: user.id,
            action: "PASSWORD_CHANGED",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Mot de passe mis à jour" });
    } catch (e) {
        console.error("CHANGE_PASSWORD_ERROR:", e);
        res.status(500).json({
            message: "Échec changement mot de passe",
            code: "CHANGE_PASSWORD_ERROR"
        });
    }
};

/**
 * Demande de réinitialisation de mot de passe
 */
exports.forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const lowerEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
            where: { email: lowerEmail }
        });

        if (user) {


            const resetToken = crypto.randomBytes(32).toString("hex")
            const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken,
                    resetTokenExpiry,
                    requestedAt: new Date()
                },
            });

            // TODO: Envoyer l'email avec le lien de reset `?token=${rawToken}`

            try {
                await emailService.sendPasswordResetEmail(user, resetToken);
                console.log("FORGOT_PASSWORD_EMAIL_SENT");
            } catch (e) {
                console.error("FORGOT_PASSWORD_EMAIL_ERROR:", e.message || e);
            }
            try {
                await createAuditLog({
                    userId: user.id,
                    action: "PASSWORD_RESET_REQUESTED",
                    resource: "auth",
                    resourceId: user.id,
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            } catch {}
        }

        res.status(200).json({
            message: "Si l'email existe, un lien de réinitialisation a été envoyé."
        });
    } catch (e) {
        console.error("FORGOT_PASSWORD_ERROR:", e);
        res.status(500).json({
            message: "Échec traitement demande",
            code: "FORGOT_PASSWORD_ERROR"
        });
    }
};

/**
 * Réinitialise le mot de passe avec un token
 */
exports.resetPassword = async(req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Token invalide ou expiré",
                code: "INVALID_TOKEN"
            });
        }

        const newHash = await bcrypt.hash(newPassword, saltRounds);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: newHash,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        await createAuditLog({
            userId: user.id,
            action: "PASSWORD_RESET",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Mot de passe réinitialisé" });
    } catch (e) {
        console.error("RESET_PASSWORD_ERROR:", e);
        res.status(500).json({
            message: "Échec réinitialisation mot de passe",
            code: "RESET_PASSWORD_ERROR"
        });
    }
};

// ============ ACTIVATION ============
/**
 * Renvoie un nouveau lien d'activation
 */
exports.resendActivation = async(req, res) => {
    try {

        const email = req.body.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        const activationToken = crypto.randomBytes(24).toString("hex");
        const activationExpiry = new Date(Date.now() + 24 * 3600 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenActiveted: activationToken,
                expiresAt: activationExpiry
            }
        });

        try {
            await emailService.sendAccountActivationEmail(user, activationToken);
        } catch (e) {
            console.error("RESEND_ACTIVATION_EMAIL_ERROR:", e.message || e);
        }

        await createAuditLog({
            userId: user.id,
            action: "ACTIVATION_RESENT",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Nouveau lien d'activation envoyé"
        });
    } catch (e) {
        console.error("RESEND_ACTIVATION_ERROR:", e);
        res.status(500).json({
            message: "Échec renvoi lien d'activation",
            code: "RESEND_ACTIVATION_ERROR"
        });
    }
};

/**
 * Vérifie le compte avec un token d'activation
 */
exports.verifyAccount = async(req, res) => {
    try {
        const { token } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                tokenActiveted: token,
                expiresAt: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Token invalide ou expiré",
                code: "INVALID_TOKEN"
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenActiveted: null,
                expiresAt: null,
                requestedAt: null
            }
        });

        await createAuditLog({
            userId: user.id,
            action: "ACCOUNT_VERIFIED",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Compte vérifié" });
    } catch (e) {
        console.error("VERIFY_ACCOUNT_ERROR:", e);
        res.status(500).json({
            message: "Échec vérification compte",
            code: "VERIFY_ACCOUNT_ERROR"
        });
    }
};

// ============ TOKEN ============
/**
 * Rafraîchit le token d'authentification
 */
exports.refreshToken = async(req, res) => {
    try {
        const cookieToken = req.cookies[COOKIE_NAME];
        if (!cookieToken) {
            return res.status(401).json({
                message: "Aucune session",
                code: "NO_SESSION"
            });
        }

        const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { permissions: true, organization: true },
        });

        if (!user || !user.enabled || user.deletedAt) {
            return res.status(403).json({
                message: "Session invalide",
                code: "INVALID_SESSION"
            });
        }

        const token = sign({ id: user.id });
        setAuthCookie(res, token);

        await createAuditLog({
            userId: user.id,
            action: "TOKEN_REFRESHED",
            resource: "auth",
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Token rafraîchi",
            token,
            user: shapeUser(user)
        });
    } catch (e) {
        console.error("REFRESH_TOKEN_ERROR:", e);
        res.status(401).json({
            message: "Session invalide",
            code: "INVALID_SESSION"
        });
    }
};

// ============ ADMIN OPERATIONS ============
/**
 * Active/Désactive un utilisateur (admin)
 */
exports.adminSetEnabled = async(req, res) => {
    try {
        const { userId, enabled } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { enabled: Boolean(enabled) },
            include: { permissions: true, organization: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: enabled ? "USER_ENABLED" : "USER_DISABLED",
            resource: "users",
            resourceId: userId,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Statut utilisateur mis à jour",
            user: shapeUser(updatedUser)
        });
    } catch (e) {
        console.error("ADMIN_SET_ENABLED_ERROR:", e);
        res.status(500).json({
            message: "Échec mise à jour statut utilisateur",
            code: "SET_ENABLED_ERROR"
        });
    }
};

/**
 * Déconnecte toutes les sessions (invalide le token)
 */
exports.logoutAllSessions = async(req, res) => {
    try {
        await prisma.user.update({
            where: { id: res.locals.user.id },
            data: { requestedAt: new Date() } // sert de "lastLogoutAllAt"
        });

        clearAuthCookie(res);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "LOGOUT_ALL_SESSIONS",
            resource: "auth",
            resourceId: res.locals.user.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Toutes les sessions sont invalidées"
        });
    } catch (e) {
        console.error("LOGOUT_ALL_ERROR:", e);
        res.status(500).json({
            message: "Échec déconnexion globale",
            code: "LOGOUT_ALL_ERROR"
        });
    }
};

/**
 * Permet à un admin d'emprunter l'identité d'un autre utilisateur
 */
exports.impersonate = async(req, res) => {
    try {
        const { targetUserId } = req.body;

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { permissions: true, organization: true },
        });

        if (!targetUser) {
            return res.status(404).json({
                message: "Utilisateur cible introuvable",
                code: "USER_NOT_FOUND"
            });
        }

        const token = sign({
            id: targetUser.id,
            impBy: res.locals.user.id
        });

        setAuthCookie(res, token);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "IMPERSONATE",
            resource: "auth",
            resourceId: targetUser.id,
            details: { by: res.locals.user.id },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Impersonation réussie",
            token,
            user: shapeUser(targetUser)
        });
    } catch (e) {
        console.error("IMPERSONATE_ERROR:", e);
        res.status(500).json({
            message: "Échec impersonation",
            code: "IMPERSONATE_ERROR"
        });
    }
};


exports.createWithOrganization2 = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }

        // Champs utilisateur
        const {
            username,
            email,
            password,
            role,
            enabled = true,
            permissions = [],
            phone,
            adress,
            country,
            firstName,
            lastName,
            gender = "Autre",
        } = req.body.user || req.body;

        // Champs organisation
        const {
            name: orgName,
            slug: orgSlugRaw,
            type: orgType, // ex: COLLEGE, BANQUE, UNIVERSITE, LYCEE, ENTREPRISE
            email: orgEmail,
            phone: orgPhone,
            address: orgAddress,
            website: orgWebsite,
            country: orgCountry,
        } = (req.body.organization || {});

        if (!orgName || !orgType) {
            return res.status(400).json({
                message: "Nom (organization.name) et type (organization.type) sont requis",
                code: "ORG_FIELDS_REQUIRED",
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email utilisateur requis",
                code: "USER_EMAIL_REQUIRED",
            });
        }

        const lowerEmail = email.toLowerCase().trim();

        // Pré-vérifications rapides hors transaction (optionnel)
        const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé", code: "EMAIL_EXISTS" });
        }

        // Récup permissions si fournies
        const permRecords = permissions.length ?
            await prisma.permission.findMany({ where: { key: { in: permissions } } }) : [];

        // hash mot de passe (ou génère temporaire)
        const tempPassword = password || crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        const result = await prisma.$transaction(async(tx) => {
            // // slug unique
            const finalSlug = await ensureUniqueOrgSlug(orgSlugRaw || orgName, tx);
            // if (!finalSlug) {
            //     throw new Error("SLUG_COMPUTE_FAILED");
            // }

            // 1) Créer l’organisation
            const createdOrg = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: finalSlug,
                    type: orgType,
                    email: orgEmail || null,
                    phone: orgPhone || null,
                    address: orgAddress || null,
                    website: orgWebsite || null,
                    country: orgCountry || null,
                },
            });

            // 2) Créer l’utilisateur rattaché à l’orga
            const createdUser = await tx.user.create({
                data: {
                    // username: (username && username.trim()) || lowerEmail.split("@")[0],
                    username: lowerEmail,
                    email: lowerEmail,
                    passwordHash: hashedPassword,
                    role,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    enabled: Boolean(enabled),
                    phone: phone || null,
                    adress: adress || null,
                    country: country || null,
                    gender,
                    organization: { connect: { id: createdOrg.id } },
                    permissions: permRecords.length ? { connect: permRecords.map((p) => ({ id: p.id })) } : undefined,
                },
                include: { organization: true, permissions: true },
            });

            return { createdOrg, createdUser };
        });

        // Audit (en dehors de la transaction)
        await Promise.all([
            createAuditLog({
                userId: result.createdOrg.id,
                action: "ORG_CREATED",
                resource: "organization",
                resourceId: result.createdOrg.id,
                details: { name: orgName, slug: result.createdOrg.slug, type: orgType },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            }),
            createAuditLog({
                userId: result.createdUser.id,
                action: "USER_CREATED",
                resource: "users",
                resourceId: result.createdUser.id,
                details: {
                    email: result.createdUser.email,
                    role: result.createdUser.role,
                    organizationId: result.createdUser.organizationId,
                    permissions,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            }),
        ]);

        return res.status(201).json({
            message: "Compte creé avec succès",
            organization: {
                id: result.createdOrg.id,
                name: result.createdOrg.name,
                slug: result.createdOrg.slug,
                type: result.createdOrg.type,
                email: result.createdOrg.email,
                phone: result.createdOrg.phone,
                address: result.createdOrg.address,
                website: result.createdOrg.website,
                country: result.createdOrg.country,
                createdAt: result.createdOrg.createdAt,
                updatedAt: result.createdOrg.updatedAt,
            },
            user: shapeUser(result.createdUser),
            ...(password ? {} : { temporaryPassword: tempPassword }),
        });
    } catch (e) {
        console.error("CREATE_USER_WITH_ORG_ERROR:", e);
        if (e.code === "P2002") {
            // Prisma unique constraint (ex: slug déjà pris entre la vérif et l’insert)
            return res.status(409).json({ message: "Conflit d’unicité (email ou slug)", code: "UNIQUE_CONFLICT" });
        }
        if (e.message === "SLUG_COMPUTE_FAILED") {
            return res.status(400).json({ message: "Impossible de calculer un slug valide", code: "BAD_SLUG" });
        }
        return res.status(500).json({ message: "Échec création user+organization", code: "CREATE_USER_WITH_ORG_ERROR" });
    }
};


exports.createWithOrganization = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }

        // Champs utilisateur
        const {
            username,
            email,
            password,
            role = "DEMANDEUR",
            enabled = true,
            permissions = [],
            phone,
            adress,
            country,
            firstName,
            profession = "",
            lastName,
            gender = "MALE",
        } = req.body.user || req.body;

        // Champs organisation
        const {
            name: orgName,
            slug: orgSlugRaw,
            type: orgType,
            email: orgEmail,
            phone: orgPhone,
            address: orgAddress,
            website: orgWebsite,
            country: orgCountry,
        } = req.body.organization || {};

        if (!orgName || !orgType) {
            return res.status(400).json({
                message: "Nom (organization.name) et type (organization.type) sont requis",
                code: "ORG_FIELDS_REQUIRED",
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email utilisateur requis",
                code: "USER_EMAIL_REQUIRED",
            });
        }

        const lowerEmail = email.toLowerCase().trim();

        // Pré-vérif
        const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé", code: "EMAIL_EXISTS" });
        }

        const permRecords = permissions.length ?
            await prisma.permission.findMany({ where: { key: { in: permissions } } }) : [];

        const tempPassword = password || crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        // --- Créer le token d'activation (validité 72h)
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);


        const allPerms = await prisma.permission.findMany({});

        // --- Création org + user en transaction
        const { createdOrg, createdUser } = await prisma.$transaction(async(tx) => {
            const finalSlug = await ensureUniqueOrgSlug(orgSlugRaw || orgName, tx);

            const createdOrg = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: finalSlug,
                    type: orgType,
                    email: orgEmail || null,
                    phone: orgPhone || null,
                    address: orgAddress || null,
                    website: orgWebsite || null,
                    country: orgCountry || null,
                },
            });


            const createdUser = await tx.user.create({
                data: {
                    username: lowerEmail,
                    email: lowerEmail,
                    passwordHash: hashedPassword,
                    role,
                    profession,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    enabled: Boolean(enabled),
                    phone: phone || null,
                    adress: adress || null,
                    country: country || null,
                    gender,
                    tokenActiveted: token,
                    expiresAt,
                    organization: { connect: { id: createdOrg.id } },
                    permissions: allPerms.length ? { connect: allPerms.map((p) => ({ id: p.id })) } : undefined,
                },
                include: { organization: true, permissions: true },
            });

            return { createdOrg, createdUser };
        });

        // --- Lien d’activation (front conseillé)
        const activationUrl = process.env.FRONTEND_URL ?
            `${process.env.FRONTEND_URL}/auth/activate?token=${encodeURIComponent(token)}` :
            `${process.env.BACKEND_URL || ""}/auth/activate/confirm?token=${encodeURIComponent(token)}`;

        // --- Audit logs (hors txn)
        await Promise.all([
            createAuditLog({
                userId: createdOrg.id,
                action: "ORG_CREATED",
                resource: "organization",
                resourceId: createdOrg.id,
                details: { name: orgName, slug: createdOrg.slug, type: orgType },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            }),
            createAuditLog({
                userId: createdUser.id,
                action: "USER_CREATED",
                resource: "users",
                resourceId: createdUser.id,
                details: {
                    email: createdUser.email,
                    role: createdUser.role,
                    organizationId: createdUser.organizationId,
                    permissions,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            }),
        ]);

        // --- Envoi des mails (ne bloque pas la réponse si ça échoue)
        const orgNotify = await emailService.sendOrganizationNewAccountNotification({
            organization: createdOrg,
            user: createdUser,
        });

        const userActivation = await emailService.sendUserActivationEmail({
            user: createdUser,
            organization: createdOrg,
            activationUrl,
            // Optionnel: n’envoie le mdp temporaire que si tu le souhaites:
            temporaryPassword: password ? null : tempPassword,
        });

        // On lance mais on n’attend pas le succès pour répondre
        Promise.allSettled([orgNotify, userActivation]).then((results) => {
            results.forEach((r) => {
                if (r.status === "rejected") {
                    console.error("EMAIL_SEND_ERROR:", r.reason);
                }
            });
        });

        // --- Réponse HTTP
        return res.status(201).json({
            message: "Compte créé avec succès",
            organization: {
                id: createdOrg.id,
                name: createdOrg.name,
                slug: createdOrg.slug,
                type: createdOrg.type,
                email: createdOrg.email,
                phone: createdOrg.phone,
                address: createdOrg.address,
                website: createdOrg.website,
                country: createdOrg.country,
                createdAt: createdOrg.createdAt,
                updatedAt: createdOrg.updatedAt,
            },
            user: shapeUser(createdUser),
            activation: {
                tokenExpiresAt: expiresAt,
                // utile pour tests — à désactiver en prod si tu veux
                activationUrl: process.env.NODE_ENV === "development" ? activationUrl : undefined,
            },
            ...(password ? {} : { temporaryPassword: tempPassword }),
        });
    } catch (e) {
        console.error("CREATE_USER_WITH_ORG_ERROR:", e);
        if (e.code === "P2002") {
            return res.status(409).json({ message: "Conflit d’unicité (email ou slug)", code: "UNIQUE_CONFLICT" });
        }
        if (e.message === "SLUG_COMPUTE_FAILED") {
            return res.status(400).json({ message: "Impossible de calculer un slug valide", code: "BAD_SLUG" });
        }
        return res.status(500).json({ message: "Échec création user+organization", code: "CREATE_USER_WITH_ORG_ERROR" });
    }
};