const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");
const emailService = require("../services/email.service");
const prisma = new PrismaClient();
const SORTABLE = new Set(["createdAt", "updatedAt"]);
const cryptoService = require("../services/crypto.service");
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const { publicBase } = require("../utils/publicBase");
// Fonction pour formater les documents
const shapeDocument = (doc) => ({
    id: doc.id,
    demandePartageId: doc.demandePartageId,
    ownerOrgId: doc.ownerOrgId,
    codeAdn: doc.codeAdn,
    urlOriginal: doc.urlOriginal,
    urlChiffre: doc.urlChiffre,
    urlTraduit: doc.urlTraduit,
    estTraduit: doc.estTraduit,
    aDocument: doc.aDocument,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    blockchainHash: doc.blockchainHash,
    encryptedAt: doc.encryptedAt,
    demandePartage: doc.demandePartage ? {
        id: doc.demandePartage.id,
        code: doc.demandePartage.code,
        status: doc.demandePartage.status,
    } : null,
    ownerOrg: doc.ownerOrg ? {
        id: doc.ownerOrg.id,
        name: doc.ownerOrg.name,
        slug: doc.ownerOrg.slug,
    } : null,
});


async function resolveDemandePartageId({ demandeCode }) {
    // Ici, DemandePartage possède un champ "code" (ton erreur Prisma listait bien "code?")
    if (!demandeCode) return null;

    const dp = await prisma.demandePartage.findUnique({
        where: { code: demandeCode },
        select: { id: true },
    });
    return dp.id || null;
}

exports.createDocumentPartage = async(req, res) => {
    try {
        const {
            demandeCode,
            ownerOrgId,
            type,
            mention,
            dateObtention,
            estTraduit = false,
            aDocument = true,
        } = req.body;

        // Validation ownerOrgId
        if (!ownerOrgId) {
            return res.status(400).json({ message: "ownerOrgId requis", code: "MISSING_OWNER_ORG_ID" });
        }

        // Fichier (Multer: upload.single('file'))
        let file = req.file;
        if (!file && req.files && req.files.file && req.files.file[0]) file = req.files.file[0];
        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded", code: "FILE_REQUIRED" });
        }

        // Résolution demandePartageId
        const demandePartageId = await resolveDemandePartageId({
            demandeCode,
        });
        if (!demandePartageId) {
            return res.status(400).json({
                message: "demandePartageId introuvable (fournis demandePartageId ou demandeId ou demandeCode)",
                code: "MISSING_DEMANDE_PARTAGE",
            });
        }

        // Existence demandePartage et org
        const [demandePartage, org] = await Promise.all([
            prisma.demandePartage.findUnique({ where: { id: demandePartageId } }),
            prisma.organization.findUnique({ where: { id: ownerOrgId } }),
        ]);
        if (!demandePartage) {
            return res.status(404).json({ message: "DemandePartage introuvable", code: "DEMANDE_PARTAGE_NOT_FOUND" });
        }
        if (!org) {
            return res.status(404).json({ message: "Organisation introuvable", code: "ORG_NOT_FOUND" });
        }

        // urlOriginal publique depuis le path du fichier
        const base = publicBase(req);
        const rel = file.path.replace(/\\/g, "/").replace(/^\/?/, "/");
        const urlOriginal = `${base}${rel}`;
        console.log("urlOriginal", urlOriginal);
        console.log(base)
        console.log(rel)
            // Création du document
        const doc = await prisma.documentPartage.create({
            data: {
                demandePartage: { connect: { id: demandePartageId } },
                ownerOrg: { connect: { id: ownerOrgId } },
                urlOriginal,
                estTraduit: false,
                aDocument: Boolean(aDocument),
                type,
                mention,
                dateObtention,
            },
            include: {
                demandePartage: {
                    select: {
                        id: true,
                        code: true,
                        user: { select: { id: true, email: true, firstName: true, lastName: true } },
                        assignedOrg: { select: { id: true, name: true, slug: true } },
                        targetOrg: { select: { id: true, name: true, slug: true, type: true } },
                    }
                },
                ownerOrg: { select: { id: true, name: true, slug: true } },
            },
        });

        // Chiffrement auto
        try {
            if (urlOriginal) {
                await cryptoService.encryptAndPersist(doc.id, urlOriginal, res.locals.user.id);
            }

            try {
                const demandeur = doc.demandePartage.user || null;
                const ownerOrg = doc.ownerOrg || org;
                const demande = doc.demandePartage || null;

                if (demandeur && demandeur.email) {
                    await emailService.sendDocumentAddedNotificationToDemandeur(
                        doc, // documentPartage
                        ownerOrg, // organisation
                        demande, // demandePartage
                        demandeur // demandeur
                    );
                }

                console.log("📨 Document envoyé au demandeur");

            } catch (mailErr) {
                console.error("EMAIL_SEND_ERROR:", mailErr);
                await createAuditLog({
                    userId: res.locals.user.id || null,
                    action: "DOCUMENT_MAIL_SEND_ERROR",
                    resource: "documents",
                    resourceId: doc.id,
                    details: { error: mailErr.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }

        } catch (encryptionError) {
            console.error("Erreur chiffrement automatique:", encryptionError);
            await createAuditLog({
                userId: res.locals.user.id || null,
                action: "DOCUMENT_CREATED_WITH_ENCRYPTION_ERROR",
                resource: "documents",
                resourceId: doc.id,
                details: { error: encryptionError.message },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });
        }

        // reccuperer la demande avec l'organisme de traduction
        const demande = await prisma.demandePartage.findUnique({
            where: { id: demandePartageId },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true } },
                assignedOrg: { select: { id: true, name: true, slug: true, email: true } },
                targetOrg: { select: { id: true, name: true, slug: true, type: true, email: true } },
            },
        });

        // Envoi de l'email à l'organisme tradutrice
        if (demande && demande.assignedOrg) {
            try {
                await emailService.sendDocumentTranslationNotification(
                    doc,
                    demande,
                    demande.assignedOrg,
                    demande.targetOrg,
                    demande.user
                );
                console.log("📨 Document envoyé à l'organisme de traduction");
                await createAuditLog({
                    userId: res.locals.user.id || null,
                    action: "DOCUMENT_MAIL_SENT_TO_ORGANISATION_TRANSLATION",
                    resource: "documents",
                    resourceId: doc.id,
                    details: {
                        ownerOrgId,
                        estTraduit: Boolean(estTraduit),
                        aDocument: Boolean(aDocument),
                        type,
                        mention,
                        dateObtention,
                        demandeId: demandePartageId || null,
                        demandeCode: demande.code || null,
                    },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            } catch (mailErr) {
                console.error("EMAIL_SEND_ERROR:", mailErr);
                await createAuditLog({
                    userId: res.locals.user.id || null,
                    action: "DOCUMENT_MAIL_SEND_ERROR",
                    resource: "documents",
                    resourceId: doc.id,
                    details: { error: mailErr.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }
        }

        // Notification "in-app" pour le demandeur (ajout de document)
        try {
            const demande = doc.demandePartage;
            const demandeur = demande?.user;
            if (demandeur?.id) {
                await prisma.notification.create({
                    data: {
                        userId: demandeur.id,
                        demandePartageId,
                        documentPartageId: doc.id,
                        type: "DOC_ADDED",
                        title: "Nouveau document ajouté",
                        message: `Un nouveau document a été ajouté à votre demande ${demande.code || ""}.`,
                    },
                });
            }
        } catch (notifErr) {
            console.error("NOTIFICATION_CREATE_ERROR (DOC_ADDED):", notifErr);
        }

        // Audit
        await createAuditLog({
            userId: res.locals.user.id || null,
            action: "DOCUMENT_CREATED",
            resource: "documents",
            resourceId: doc.id,
            details: {
                demandePartageId,
                ownerOrgId,
                estTraduit: Boolean(estTraduit),
                aDocument: Boolean(aDocument),
                type,
                mention,
                dateObtention,
                demandeId: demandePartageId || null,
                demandeCode: demandeCode || null,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // Réponse
        const shaped = shapeDocument ? shapeDocument(doc) : {...doc, downloadUrl: urlOriginal };

        return res.status(201).json({
            message: "Document créé" + (urlOriginal ? " et chiffrement initié" : ""),
            document: shaped,
        });
    } catch (e) {
        console.error("DOC_CREATE_ERROR:", e);
        return res.status(500).json({ message: "Échec création document", code: "CREATE_DOC_ERROR" });
    }
};

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const { page = 1, limit = 10, demandePartageId, ownerOrgId, estTraduit, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;
        const where = {};
        if (demandePartageId) where.demandePartageId = demandePartageId;
        if (ownerOrgId) where.ownerOrgId = ownerOrgId;
        if (typeof estTraduit !== "undefined") where.estTraduit = String(estTraduit) === "true";
        if (search) {
            where.OR = [
                { codeAdn: { contains: search, mode: "insensitive" } },
                { urlOriginal: { contains: search, mode: "insensitive" } },
                { urlTraduit: { contains: search, mode: "insensitive" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [rows, total] = await Promise.all([
            prisma.documentPartage.findMany({
                where,
                include: { demandePartage: true, ownerOrg: true },
                orderBy: {
                    [SORTABLE.has(sortBy) ? sortBy : "createdAt"]: sortOrder
                },
                skip,
                take: Number(limit),
            }),
            prisma.documentPartage.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENTS_LISTED",
            resource: "documents",
            details: { demandePartageId, ownerOrgId, estTraduit, search },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            documents: rows.map(shapeDocument),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: { demandePartageId, ownerOrgId, estTraduit, search, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("DOC_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération documents", code: "GET_DOCS_ERROR" });
    }
};

// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            include: { demandePartage: true, ownerOrg: true },
        });

        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_VIEWED",
            resource: "documents",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ document: shapeDocument(doc) });
    } catch (e) {
        console.error("DOC_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération document", code: "GET_DOC_ERROR" });
    }
};

// ============ CREATE WITH AUTOMATIC ENCRYPTION ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const {
            demandePartageId,
            type,
            mention,
            dateObtention,
            ownerOrgId,
            codeAdn,
            urlOriginal,
            estTraduit = false,
            aDocument = true,
        } = req.body;

        if (!demandePartageId || !ownerOrgId) {
            return res.status(400).json({ message: "demandePartageId et ownerOrgId requis", code: "MISSING_REQUIRED_FIELDS" });
        }

        const file = req.files.file[0];
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        let nameFile = null;
        if (file) {
            nameFile = req.file.filename ? `/documents/${req.file.filename}` : null;
        }
        const filePath = file.path.replace(process.cwd(), "").replace(/\\/g, "/");


        // Vérifier que la demande et l'organisation existent
        const [demande, org] = await Promise.all([
            prisma.demandePartage.findUnique({ where: { id: demandePartageId } }),
            prisma.organization.findUnique({ where: { id: ownerOrgId } }),
        ]);

        if (!demande) {
            return res.status(400).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }

        if (!org) {
            return res.status(400).json({ message: "Organisation introuvable", code: "ORG_NOT_FOUND" });
        }

        // Créer le document
        const doc = await prisma.documentPartage.create({
            data: {
                demandePartage: { connect: { id: demandePartageId } },
                ownerOrg: { connect: { id: ownerOrgId } },
                codeAdn: codeAdn || null,
                urlOriginal: urlOriginal || null,
                estTraduit: Boolean(estTraduit),
                aDocument: Boolean(aDocument),
            },
            include: { demandePartage: true, ownerOrg: true },
        });

        // Chiffrer automatiquement le document si une URL originale est fournie
        if (urlOriginal) {
            try {
                await encryptDocument(doc.id, res.locals.user.id);
            } catch (encryptionError) {
                console.error("Erreur chiffrement automatique:", encryptionError);
                await createAuditLog({
                    userId: res.locals.user.id,
                    action: "DOCUMENT_CREATED_WITH_ENCRYPTION_ERROR",
                    resource: "documents",
                    resourceId: doc.id,
                    details: { error: encryptionError.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_CREATED",
            resource: "documents",
            resourceId: doc.id,
            details: { demandePartageId, ownerOrgId, estTraduit, aDocument },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({
            message: "Document créé" + (urlOriginal ? " et chiffrement initié" : ""),
            document: shapeDocument(doc)
        });
    } catch (e) {
        console.error("DOC_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création document", code: "CREATE_DOC_ERROR" });
    }
};

// ============ UPDATE ============
exports.update = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params;
        const {
            codeAdn,
            urlOriginal,
            estTraduit,
            aDocument,
        } = req.body;

        const doc = await prisma.documentPartage.findUnique({ where: { id } });
        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        // Si une nouvelle URL originale est fournie, rechiffrer le document
        let needsReencryption = false;
        if (urlOriginal && urlOriginal !== doc.urlOriginal) {
            needsReencryption = true;
        }

        const updated = await prisma.documentPartage.update({
            where: { id },
            data: {
                codeAdn: codeAdn !== undefined ? codeAdn || null : undefined,
                urlOriginal: urlOriginal !== undefined ? urlOriginal || null : undefined,
                estTraduit: estTraduit !== undefined ? Boolean(estTraduit) : undefined,
                aDocument: aDocument !== undefined ? Boolean(aDocument) : undefined,
            },
            include: { demandePartage: true, ownerOrg: true },
        });

        // Rechiffrer si nécessaire
        if (needsReencryption) {
            try {
                await encryptDocument(updated.id, res.locals.user.id);
            } catch (encryptionError) {
                console.error("Erreur rechiffrement:", encryptionError);
                await createAuditLog({
                    userId: res.locals.user.id,
                    action: "DOCUMENT_REENCRYPTION_FAILED",
                    resource: "documents",
                    resourceId: updated.id,
                    details: { error: encryptionError.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_UPDATED",
            resource: "documents",
            resourceId: id,
            details: req.body,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Document mis à jour" + (needsReencryption ? " et rechiffré" : ""),
            document: shapeDocument(updated)
        });
    } catch (e) {
        console.error("DOC_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour document", code: "UPDATE_DOC_ERROR" });
    }
};

// ============ DELETE ============
exports.delete = async(req, res) => {
    try {
        const { id } = req.params;
        const doc = await prisma.documentPartage.findUnique({ where: { id } });
        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        await prisma.documentPartage.delete({ where: { id } });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_DELETED",
            resource: "documents",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Document supprimé" });
    } catch (e) {
        console.error("DOC_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec suppression document", code: "DELETE_DOC_ERROR" });
    }
};

// ============ TRADUIRE DOCUMENT ============
exports.traduire = async(req, res) => {
    try {
        const { id } = req.params;
        const { urlTraduit, encryptionKeyTraduit } = req.body;

        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            include: {
                demandePartage: {
                    include: {
                        user: true,
                        targetOrg: true
                    }
                }
            }
        });

        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        // Chiffrer automatiquement le document traduit si une URL est fournie
        let translatedHash = null;
        if (urlTraduit) {
            try {
                const { hash } = await encryptTranslatedDocument(id, urlTraduit, encryptionKeyTraduit, res.locals.user.id);
                translatedHash = hash;
            } catch (encryptionError) {
                console.error("Erreur chiffrement document traduit:", encryptionError);
                await createAuditLog({
                    userId: res.locals.user.id,
                    action: "DOCUMENT_TRANSLATION_ENCRYPTION_FAILED",
                    resource: "documents",
                    resourceId: id,
                    details: { error: encryptionError.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }
        }

        const updated = await prisma.documentPartage.update({
            where: { id },
            data: {
                urlTraduit: urlTraduit || null,
                encryptionKeyTraduit: encryptionKeyTraduit || null,
                estTraduit: true,
                blockchainHashTraduit: translatedHash
            },
            include: { demandePartage: true, ownerOrg: true },
        });

        // Envoyer la notification de traduction
        if (updated.demandePartage && updated.demandePartage.user) {
            await emailService.sendTranslatedDocumentNotification(
                updated,
                updated.demandePartage.targetOrg,
                updated.demandePartage.user
            );
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_TRANSLATED",
            resource: "documents",
            resourceId: id,
            details: { urlTraduit, encryptionKeyTraduit, translatedHash },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Document traduit" + (translatedHash ? " et chiffré" : ""),
            document: shapeDocument(updated)
        });
    } catch (e) {
        console.error("DOC_TRANSLATE_ERROR:", e);
        res.status(500).json({ message: "Échec traduction document", code: "TRANSLATE_DOC_ERROR" });
    }
};

// ============ GET DOCUMENT CONTENT ============
/**
 * Récupère le contenu d'un document (original, traduit ou chiffré)
 * Pour affichage direct dans le frontend ou téléchargement
 */
exports.getDocumentContent = async(req, res) => {
    try {
        const { id } = req.params;
        const { type = 'original', display = 'false' } = req.query; // original | traduit | chiffre

        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            select: {
                id: true,
                urlOriginal: true,
                urlChiffre: true,
                urlTraduit: true,
                encryptionKey: true,
                encryptionIV: true,
                encryptionKeyTraduit: true,
                blockchainHash: true,
                blockchainHashTraduit: true,
                demandePartage: {
                    select: {
                        user: true,
                        targetOrg: true
                    }
                }
            }
        });

        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        let fileUrl;
        let isEncrypted = false;
        let encryptionKey = null;
        let encryptionIV = null;
        let blockchainHash = null;

        // Déterminer quel fichier récupérer
        switch (type) {
            case 'traduit':
                if (!doc.estTraduit || !doc.urlTraduit) {
                    return res.status(404).json({ message: "Document traduit introuvable", code: "TRANSLATED_DOC_NOT_FOUND" });
                }
                fileUrl = doc.urlTraduit;
                encryptionKey = doc.encryptionKeyTraduit;
                blockchainHash = doc.blockchainHashTraduit;
                break;

            case 'chiffre':
                if (!doc.urlChiffre) {
                    return res.status(404).json({ message: "Document chiffré introuvable", code: "ENCRYPTED_DOC_NOT_FOUND" });
                }
                fileUrl = doc.urlChiffre;
                encryptionKey = doc.encryptionKey;
                encryptionIV = doc.encryptionIV;
                blockchainHash = doc.blockchainHash;
                isEncrypted = true;
                break;

            default: // original
                if (!doc.urlOriginal) {
                    return res.status(404).json({ message: "Document original introuvable", code: "ORIGINAL_DOC_NOT_FOUND" });
                }
                fileUrl = doc.urlOriginal;
        }

        // Vérifier les permissions (à implémenter selon votre système)
        // await checkDocumentPermissions(req.user, doc);

        if (isEncrypted) {
            // Déchiffrer le fichier
            const result = await handleEncryptedDocument(fileUrl, encryptionKey, encryptionIV, blockchainHash, doc.id, res.locals.user.id);

            if (display === 'true') {
                // Affichage dans le navigateur
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="document_${doc.id}.pdf"`);
                result.stream.pipe(res);

                // Nettoyage après envoi
                res.on('finish', () => {
                    result.cleanup();
                });
            } else {
                // Téléchargement
                res.setHeader('Content-Disposition', `attachment; filename="document_${doc.id}.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');
                result.stream.pipe(res);

                // Nettoyage après envoi
                res.on('finish', () => {
                    result.cleanup();
                });
            }
        } else {
            // Fichier non chiffré - stream directement depuis le stockage
            const fileStream = await getFileStreamFromStorage(fileUrl);

            if (display === 'true') {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="document_${doc.id}.pdf"`);
            } else {
                res.setHeader('Content-Disposition', `attachment; filename="document_${doc.id}.pdf"`);
            }

            fileStream.pipe(res);
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_CONTENT_ACCESS",
            resource: "documents",
            resourceId: id,
            details: { type, display: display === 'true' },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
    } catch (e) {
        console.error("DOC_CONTENT_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération contenu document",
            code: "DOC_CONTENT_ERROR",
            error: e.message
        });
    }
};

// ============ GET DOCUMENT INFO ============
/**
 * Récupère les informations d'un document pour affichage dans le frontend
 */
exports.getDocumentInfo = async(req, res) => {
    try {
        const { id } = req.params;

        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            select: {
                id: true,
                codeAdn: true,
                estTraduit: true,
                aDocument: true,
                createdAt: true,
                urlOriginal: true,
                urlChiffre: true,
                urlTraduit: true,
                blockchainHash: true,
                blockchainHashTraduit: true,
                encryptedAt: true,
                encryptedAtTraduit: true,
                demandePartage: {
                    select: {
                        id: true,
                        code: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                username: true
                            }
                        }
                    }
                },
                ownerOrg: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        // Vérifier les permissions
        // await checkDocumentPermissions(req.user, doc);

        res.status(200).json({
            document: {
                id: doc.id,
                codeAdn: doc.codeAdn,
                estTraduit: doc.estTraduit,
                aDocument: doc.aDocument,
                createdAt: doc.createdAt,
                hasOriginal: !!doc.urlOriginal,
                hasEncrypted: !!doc.urlChiffre,
                hasTraduit: doc.estTraduit && !!doc.urlTraduit,
                isEncrypted: !!doc.urlChiffre,
                isTraduitEncrypted: doc.estTraduit && !!doc.blockchainHashTraduit,
                blockchainHash: doc.blockchainHash,
                blockchainHashTraduit: doc.blockchainHashTraduit,
                encryptedAt: doc.encryptedAt,
                encryptedAtTraduit: doc.encryptedAtTraduit,
                ownerOrg: doc.ownerOrg,
                demande: {
                    id: doc.demandePartage.id,
                    code: doc.demandePartage.code,
                    demandeur: doc.demandePartage.user
                },
                contentUrls: {
                    original: `/api/documents/${doc.id}/content?type=original`,
                    chiffre: `/api/documents/${doc.id}/content?type=chiffre`,
                    traduit: doc.estTraduit ? `/api/documents/${doc.id}/content?type=traduit` : null,
                    displayOriginal: `/api/documents/${doc.id}/content?type=original&display=true`,
                    displayTraduit: doc.estTraduit ? `/api/documents/${doc.id}/content?type=traduit&display=true` : null
                }
            }
        });
    } catch (e) {
        console.error("DOC_INFO_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération informations document",
            code: "DOC_INFO_ERROR",
            error: e.message
        });
    }
};

// ============ VERIFY DOCUMENT INTEGRITY ============
exports.verifyIntegrity = async(req, res) => {
    try {
        const { id } = req.params;

        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            select: {
                id: true,
                urlChiffre: true,
                urlTraduit: true,
                encryptionKey: true,
                encryptionIV: true,
                encryptionKeyTraduit: true,
                blockchainHash: true,
                blockchainHashTraduit: true
            }
        });

        if (!doc) {
            return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        }

        const results = {};

        // Vérifier l'intégrité du document original chiffré
        if (doc.urlChiffre && doc.blockchainHash) {
            try {
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                const encryptedPath = path.join(tempDir, `verify_${doc.id}.enc`);
                await cryptoService.downloadFile(doc.urlChiffre, encryptedPath);

                const decryptedPath = path.join(tempDir, `verify_${doc.id}.dec`);
                await cryptoService.decryptFile(
                    encryptedPath,
                    doc.encryptionKey,
                    doc.encryptionIV,
                    decryptedPath
                );

                const fileData = fs.readFileSync(decryptedPath);
                const currentHash = cryptoService.calculateHash(fileData);

                results.original = {
                    integrityOk: currentHash === doc.blockchainHash,
                    expectedHash: doc.blockchainHash,
                    actualHash: currentHash
                };

                // Nettoyage
                fs.unlinkSync(encryptedPath);
                fs.unlinkSync(decryptedPath);
            } catch (error) {
                results.original = {
                    integrityOk: false,
                    error: error.message
                };
            }
        }

        // Vérifier l'intégrité du document traduit si disponible
        if (doc.urlTraduit && doc.blockchainHashTraduit) {
            try {
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                const encryptedPath = path.join(tempDir, `verify_trad_${doc.id}.enc`);
                await cryptoService.downloadFile(doc.urlTraduit, encryptedPath);

                const decryptedPath = path.join(tempDir, `verify_trad_${doc.id}.dec`);
                await cryptoService.decryptFile(
                    encryptedPath,
                    doc.encryptionKeyTraduit,
                    doc.encryptionIV, // Note: Vous devrez peut-être ajuster l'IV pour la traduction
                    decryptedPath
                );

                const fileData = fs.readFileSync(decryptedPath);
                const currentHash = cryptoService.calculateHash(fileData);

                results.traduit = {
                    integrityOk: currentHash === doc.blockchainHashTraduit,
                    expectedHash: doc.blockchainHashTraduit,
                    actualHash: currentHash
                };

                // Nettoyage
                fs.unlinkSync(encryptedPath);
                fs.unlinkSync(decryptedPath);
            } catch (error) {
                results.traduit = {
                    integrityOk: false,
                    error: error.message
                };
            }
        }

        // Vérifier l'intégrité de la blockchain
        const isChainValid = await cryptoService.blockchain.isChainValid();

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_INTEGRITY_VERIFIED",
            resource: "documents",
            resourceId: id,
            details: {
                results,
                chainValid: isChainValid
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            message: "Vérification d'intégrité terminée",
            results,
            chainValid: isChainValid
        });
    } catch (e) {
        console.error("INTEGRITY_VERIFY_ERROR:", e);
        res.status(500).json({
            message: "Échec vérification intégrité",
            code: "INTEGRITY_VERIFY_ERROR",
            error: e.message
        });
    }
};

// ============ HELPER FUNCTIONS ============

/**
 * Chiffre un document existant
 */
async function encryptDocument(documentId, userId) {
    try {
        const document = await prisma.documentPartage.findUnique({
            where: { id: documentId }
        });

        if (!document || !document.urlOriginal) {
            throw new Error("Document ou URL originale introuvable");
        }

        // Créer un répertoire temporaire
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Télécharger le fichier original
        const originalPath = path.join(tempDir, `original_${documentId}${path.extname(document.urlOriginal)}`);
        await cryptoService.downloadFile(document.urlOriginal, originalPath);

        // Générer clé et IV
        const key = cryptoService.generateKey();
        const iv = cryptoService.generateIV();

        // Chiffrer le fichier
        const { encryptedPath, hash } = await cryptoService.encryptFile(originalPath, key, iv);

        // Upload du fichier chiffré
        const encryptedUrl = await cryptoService.uploadFile(encryptedPath);

        // Mettre à jour le document avec les infos de chiffrement
        await prisma.documentPartage.update({
            where: { id: documentId },
            data: {
                urlChiffre: encryptedUrl,
                encryptionKey: key,
                encryptionIV: iv,
                blockchainHash: hash,
                encryptedBy: userId,
                encryptedAt: new Date()
            }
        });

        // Ajouter à la blockchain
        await cryptoService.blockchain.addBlock({
            documentId,
            hash,
            timestamp: new Date(),
            action: 'encrypt',
            userId
        });

        // Nettoyage
        fs.unlinkSync(originalPath);
        fs.unlinkSync(encryptedPath);

        await createAuditLog({
            userId,
            action: "DOCUMENT_ENCRYPTED",
            resource: "documents",
            resourceId: documentId,
            details: { hash, encryptedUrl },
            ipAddress: 'system',
            userAgent: 'crypto-service'
        });

        return { success: true, hash };
    } catch (error) {
        console.error("Erreur chiffrement document:", error);
        throw error;
    }
}

/**
 * Chiffre un document traduit
 */
async function encryptTranslatedDocument(documentId, urlTraduit, encryptionKeyTraduit, userId) {
    try {
        // 1. Vérification de l'existence du document
        const document = await prisma.documentPartage.findUnique({
            where: { id: documentId },
        });
        if (!document) {
            throw new Error("Document introuvable");
        }

        // await cryptoService.downloadFile(urlTraduit, translatedPath);
        const tempRoot = path.resolve(process.cwd(), "temp");
        const tempLabel = "translated";
        await fs.promises.mkdir(path.join(tempRoot, tempLabel), { recursive: true });

        const fileName = `translated_${documentId}.pdf`;
        const downloadedPath = await cryptoService.downloadFile(urlTraduit, tempLabel); // => /temp/translated/<nom-original>
        const translatedPath = path.join(tempRoot, tempLabel, fileName);

        // On renomme (ou copie) vers le nom voulu
        await fs.promises.copyFile(downloadedPath, translatedPath);

        // 4. Chiffrement du fichier
        const key = encryptionKeyTraduit || cryptoService.generateKey();
        const iv = cryptoService.generateIV();
        const { encryptedPath, hash } = await cryptoService.encryptFile(translatedPath, key, iv);

        // 5. Upload du fichier chiffré
        const encryptedUrl = await cryptoService.uploadFile(encryptedPath);

        // 6. Mise à jour du document en base de données
        await prisma.documentPartage.update({
            where: { id: documentId },
            data: {
                urlTraduit: urlTraduit,
                urlChiffreTraduit: encryptedUrl,
                encryptionKeyTraduit: key,
                encryptionIVTraduit: iv,
                encryptedByTraduit: userId,
                blockchainHashTraduit: hash,
                encryptedAtTraduit: new Date(),
            },
        });

        // 7. Ajout à la blockchain
        await cryptoService.blockchain.addBlock({
            documentId,
            hash,
            timestamp: new Date(),
            action: 'encrypt_translation',
            userId,
        });

        // 8. Nettoyage des fichiers temporaires
        await fs.promises.unlink(translatedPath);

        // 9. Audit
        await createAuditLog({
            userId,
            action: "DOCUMENT_TRANSLATION_ENCRYPTED",
            resource: "documents",
            resourceId: documentId,
            details: { hash, encryptedUrl },
            ipAddress: 'system',
            userAgent: 'crypto-service',
        });

        return { success: true, hash, encryptedUrl, iv };

    } catch (error) {
        console.error("Erreur chiffrement document traduit:", error);
        throw error;
    }
}


/**
 * Gère un document chiffré pour affichage/téléchargement
 */
async function handleEncryptedDocument(fileUrl, encryptionKey, encryptionIV, blockchainHash, documentId, userId) {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Télécharger le fichier chiffré
    const encryptedPath = path.join(tempDir, `encrypted_${documentId}_${Date.now()}.enc`);
    await cryptoService.downloadFile(fileUrl, encryptedPath);

    // Déchiffrer le fichier
    const decryptedPath = path.join(tempDir, `decrypted_${documentId}_${Date.now()}.pdf`);
    await cryptoService.decryptFile(encryptedPath, encryptionKey, encryptionIV, decryptedPath);

    // Vérifier l'intégrité
    const fileData = fs.readFileSync(decryptedPath);
    const currentHash = cryptoService.calculateHash(fileData);

    if (blockchainHash && currentHash !== blockchainHash) {
        // Nettoyage avant de jeter une erreur
        fs.unlinkSync(encryptedPath);
        fs.unlinkSync(decryptedPath);
        throw new Error("Violation d'intégrité détectée - le document a peut-être été altéré");
    }

    // Créer un stream de lecture pour le fichier déchiffré
    const fileStream = fs.createReadStream(decryptedPath);

    return {
        stream: fileStream,
        cleanup: () => {
            try {
                fs.unlinkSync(encryptedPath);
                fs.unlinkSync(decryptedPath);
            } catch (err) {
                console.error("Erreur nettoyage fichiers temporaires:", err);
            }
        }
    };
}

/**
 * Récupère un flux de fichier depuis le stockage (à implémenter selon votre système)
 */
async function getFileStreamFromStorage(url) {
    if (url.startsWith('http')) {
        // Fichier accessible via URL
        const response = await axios({
            method: 'GET',
            url,
            responseType: 'stream'
        });
        return response.data;
    } else {
        // Fichier local
        const filePath = path.join(__dirname, '../../', url.replace(/^\/+/, ''));
        return fs.createReadStream(filePath);
    }
}


// exports.traduireUpload = async(req, res) => {
//     try {
//         const { id } = req.params;
//         const { encryptionKeyTraduit } = req.body;

//         const doc = await prisma.documentPartage.findUnique({
//             where: { id },
//             include: {
//                 demandePartage: { include: { user: true, targetOrg: true } },
//                 ownerOrg: true,
//             },
//         });
//         if (!doc) {
//             return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
//         }

//         // 1) Fichier de traduction (PDF) via multer
//         let file = req.file;
//         if (!file && req.files.file[0]) file = req.files.file[0];
//         if (!file) {
//             return res.status(400).json({ message: "Fichier de traduction requis", code: "FILE_REQUIRED" });
//         }

//         // 2) URL publique non chiffrée (exactement comme createDocumentPartage)
//         const base = publicBase(req);
//         const rel = file.path.replace(/\\/g, "/").replace(/^\/?/, "/");
//         const urlTraduit = `${base}${rel}`;

//         // 3) Chiffrement via ton helper (il met déjà à jour les champs *_Traduit en DB)
//         let translatedCrypto = null;
//         try {
//             translatedCrypto = await encryptTranslatedDocument(
//                 id,
//                 urlTraduit,
//                 encryptionKeyTraduit,
//                 res.locals.user.id || null
//             );
//             // NB: ta version renvoie { success: true, hash }. Si possible, fais-la
//             // aussi renvoyer { encryptedUrl, iv, encryptedAt } pour logs (optionnel).
//         } catch (err) {
//             console.error("Erreur chiffrement document traduit:", err);
//             await createAuditLog({
//                 userId: res.locals.user.id || null,
//                 action: "DOCUMENT_TRANSLATION_ENCRYPTION_FAILED",
//                 resource: "documents",
//                 resourceId: id,
//                 details: { error: err.message },
//                 ipAddress: req.ip,
//                 userAgent: req.get("User-Agent"),
//             });
//         }

//         // 4) Marquer estTraduit (si pas encore vrai) — ne PAS réécrire les champs *_Traduit
//         if (!doc.estTraduit) {
//             await prisma.documentPartage.update({
//                 where: { id },
//                 data: {
//                     estTraduit: true,
//                     encryptionKeyTraduit: encryptionKeyTraduit || doc.encryptionKeyTraduit || null
//                 },
//             });
//         }

//         // 5) Recharger depuis la DB pour retourner l'état final (après chiffrement et estTraduit)
//         const updated = await prisma.documentPartage.findUnique({
//             where: { id },
//             include: {
//                 demandePartage: {
//                     select: {
//                         user: {
//                             select: { id: true, email: true, firstName: true, lastName: true }
//                         },
//                         targetOrg: { select: { id: true, name: true } },
//                         assignedOrg: { select: { id: true, name: true } },
//                     }
//                 },
//                 ownerOrg: true
//             },
//         });

//         // 6) Notification utilisateur (si présent)
//         if (updated.demandePartage.user) {
//             await emailService.sendTranslatedDocumentNotification(
//                 updated,
//                 updated.demandePartage.targetOrg,
//                 updated.demandePartage.user,
//                 updated.demandePartage
//             );
//         }

//         // 7) Audit
//         await createAuditLog({
//             userId: res.locals.user.id || null,
//             action: "DOCUMENT_TRANSLATED_UPLOADED",
//             resource: "documents",
//             resourceId: id,
//             details: {
//                 // On log l'URL non chiffrée utilisée comme source + info hash si dispo
//                 sourceUrl: urlTraduit,
//                 hasHash: !!translatedCrypto.hash,
//                 hash: translatedCrypto.hash || null,
//             },
//             ipAddress: req.ip,
//             userAgent: req.get("User-Agent"),
//         });

//         return res.status(200).json({
//             message: "Traduction téléchargée" + (translatedCrypto.hash ? " et chiffrée" : ""),
//             document: shapeDocument ? shapeDocument(updated) : updated,
//         });
//     } catch (e) {
//         console.error("DOC_TRANSLATE_UPLOAD_ERROR:", e);
//         return res.status(500).json({ message: "Échec upload traduction", code: "TRANSLATE_UPLOAD_ERROR" });
//     }
// };
exports.traduireUpload = async(req, res) => {
    try {
        const { id } = req.params;
        const { encryptionKeyTraduit } = req.body;

        // 1. Vérification de l'existence du document
        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            include: {
                demandePartage: { include: { user: true, targetOrg: true, assignedOrg: true } },
                ownerOrg: true,
            },
        });
        if (!doc) {
            return res.status(404).json({
                message: "Document introuvable",
                code: "DOC_NOT_FOUND"
            });
        }

        // 2. Vérification du fichier de traduction
        let file = req.file;
        if (!file && req.files.file[0]) {
            file = req.files.file[0];
        }
        if (!file) {
            return res.status(400).json({
                message: "Fichier de traduction requis",
                code: "FILE_REQUIRED"
            });
        }

        // 3. Construction de l'URL publique du fichier traduit
        const base = publicBase(req);
        const rel = file.path.replace(/\\/g, "/").replace(/^\/?/, "/");
        const urlTraduit = `${base}${rel}`;

        // 4. Chiffrement du document traduit
        let translatedCrypto;
        try {
            translatedCrypto = await encryptTranslatedDocument(
                id,
                urlTraduit,
                encryptionKeyTraduit,
                res.locals.user.id
            );
        } catch (err) {
            console.error("Erreur chiffrement document traduit:", err);
            await createAuditLog({
                userId: res.locals.user.id,
                action: "DOCUMENT_TRANSLATION_ENCRYPTION_FAILED",
                resource: "documents",
                resourceId: id,
                details: { error: err.message },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });
            return res.status(500).json({
                message: "Échec du chiffrement du document traduit",
                code: "ENCRYPTION_FAILED"
            });
        }

        // 5. Mise à jour du statut "estTraduit" si nécessaire
        if (!doc.estTraduit) {
            await prisma.documentPartage.update({
                where: { id },
                data: {
                    estTraduit: true,
                    encryptionKeyTraduit: encryptionKeyTraduit || doc.encryptionKeyTraduit,
                },
            });
        }

        // 6. Rechargement du document mis à jour
        const updated = await prisma.documentPartage.findUnique({
            where: { id },
            include: {
                demandePartage: {
                    select: {
                        user: { select: { id: true, email: true, firstName: true, lastName: true } },
                        targetOrg: { select: { id: true, name: true } },
                        assignedOrg: { select: { id: true, name: true } },
                    }
                },
                ownerOrg: true,
            },
        });

        // 7. Envoi de la notification à l'utilisateur
        if (updated.demandePartage.user) {
            await emailService.sendTranslatedDocumentNotification(
                updated,
                updated.demandePartage.targetOrg,
                updated.demandePartage.user,
                updated.demandePartage
            );
        }

        // 8. Audit de la traduction uploadée
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DOCUMENT_TRANSLATED_UPLOADED",
            resource: "documents",
            resourceId: id,
            details: {
                sourceUrl: urlTraduit,
                hasHash: !!translatedCrypto.hash,
                hash: translatedCrypto.hash,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // 9. Réponse finale
        return res.status(200).json({
            message: `Traduction téléchargée${translatedCrypto?.hash ? " et chiffrée" : ""}`,
            document: updated,
        });

    } catch (e) {
        console.error("DOC_TRANSLATE_UPLOAD_ERROR:", e);
        return res.status(500).json({
            message: "Échec de l'upload de la traduction",
            code: "TRANSLATE_UPLOAD_ERROR"
        });
    }
};



exports.deleteTraduction = async(req, res) => {
    try {
        const { id } = req.params;

        const doc = await prisma.documentPartage.findUnique({
            where: { id },
            include: { demandePartage: { include: { user: true, targetOrg: true } } },
        });
        if (!doc) return res.status(404).json({ message: "Document introuvable", code: "DOC_NOT_FOUND" });
        if (!doc.urlTraduit && !doc.urlChiffreTraduit && !doc.encryptedAtTraduit) {
            return res.status(400).json({ message: "Aucune traduction à supprimer", code: "NO_TRANSLATION" });
        }

        // Optionnel: supprimer fichier sur disque si URL locale
        const tryUnlink = async(fileUrl) => {
            if (!fileUrl) return;
            // n’opère que si c’est une URL locale /uploads/
            const m = fileUrl.match(/\/uploads\/.*/i);
            if (!m) return;
            const relPath = m[0]; // e.g. /uploads/....pdf
            const abs = path.join(process.cwd(), relPath);
            try { await fs.unlink(abs); } catch (_) { /* ignore */ }
        };

        await tryUnlink(doc.urlTraduit);
        await tryUnlink(doc.urlChiffreTraduit);

        const updated = await prisma.documentPartage.update({
            where: { id },
            data: {
                // on efface tous les champs liés à la TRADUCTION
                urlTraduit: null,
                urlChiffreTraduit: null,
                encryptionKeyTraduit: null,
                encryptionIVTraduit: null,
                blockchainHashTraduit: null,
                encryptedByTraduit: null,
                encryptedAtTraduit: null,
                estTraduit: false,
            },
            include: { demandePartage: true },
        });

        await createAuditLog({
            userId: res.locals.user.id || null,
            action: "DOCUMENT_TRANSLATION_DELETED",
            resource: "documents",
            resourceId: id,
            details: { demandePartageId: updated.demandePartageId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // (Optionnel) notifier l’utilisateur que la traduction a été retirée
        // await emailService.sendTranslationRemovedNotification(updated, updated.demandePartage?.user);

        return res.json({ message: "Traduction supprimée", document: updated });
    } catch (e) {
        console.error("DELETE_TRANSLATION_ERROR:", e);
        return res.status(500).json({ message: "Échec suppression traduction", code: "DELETE_TRANSLATION_ERROR" });
    }
};