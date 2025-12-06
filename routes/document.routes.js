// routes/document.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/document.controller");
const { param, query, body, validationResult } = require("express-validator");


const multer = require("multer")
const path = require("path")
const fs = require("fs")
const rateLimit = require("express-rate-limit");
const secureStorage = require("../utils/secureStorage");
const { validateUploadedFile, checkUploadQuota } = require("../middleware/fileValidation.middleware");
const fileCleanup = require("../middleware/fileCleanup.middleware");

const {
    requireAuth,
    requirePermission,
    // Optionnels si tu veux verrouiller plus finement :
    canDecrypt, // exiger la permission de déchiffrement
    canVerifyIntegrity, // exiger la permission de vérification d'intégrité
    checkDocumentAccess, // vérifie que l'utilisateur a le droit d'accéder au doc
    requireEncryptedDocument, // vérifie que le doc est chiffré (depuis ton middleware)
} = require("../middleware/auth.middleware");

// Configuration du stockage sécurisé avec multer
const tempDir = path.join(process.cwd(), "temp", "uploads");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Stocker temporairement dans temp/uploads
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Nom temporaire, sera renommé par secureStorage
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "temp-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        // Validation basique de l'extension (validation complète dans le middleware)
        const allowedTypes = /pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    },
});

// Rate limiting spécifique pour les uploads
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 uploads par fenêtre
    message: {
        success: false,
        message: "Trop de fichiers uploadés, veuillez réessayer plus tard",
        code: "RATE_LIMIT_EXCEEDED"
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Supprimer keyGenerator personnalisé pour éviter les problèmes IPv6
    // Le rate limiting utilisera par défaut req.ip avec gestion IPv6 automatique
    skip: (req) => {
        // Ne pas limiter les admins
        return req.user?.role === "ADMIN" || req.user?.role === "SUPER_ADMIN";
    }
});



/* -------------------------------------------
 * Helpers
 * -----------------------------------------*/
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "Erreurs de validation.", code: "VALIDATION_ERROR", errors: errors.array() });
    }
    next();
};

/* -------------------------------------------
 * Validators communs
 * -----------------------------------------*/
const listValidators = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("demandePartageId").optional().isString().trim(),
    query("ownerOrgId").optional().isString().trim(),
    query("estTraduit").optional().isBoolean().toBoolean(),
    query("search").optional().isString().trim(),
    query("sortBy").optional().isIn(["createdAt", "updatedAt"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
];

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestion des documents
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Liste des documents
 *     description: Retourne une liste paginée et filtrable des documents.
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: demandePartageId
 *         schema: { type: string }
 *       - in: query
 *         name: ownerOrgId
 *         schema: { type: string }
 *       - in: query
 *         name: estTraduit
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, updatedAt] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Liste paginée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   additionalProperties: true
 *       401: { description: Non authentifié }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/",
    requireAuth,
    requirePermission("documents.read"),
    // listValidators,
    // handleValidation,
    ctrl.list
);


/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Récupère un document par ID
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 document:
 *                   $ref: '#/components/schemas/Document'
 *       401: { description: Non authentifié }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("documents.read"), [param("id").isString().trim()],
    handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Crée un nouveau document (avec chiffrement automatique si urlOriginal)
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [demandePartageId, ownerOrgId]
 *             properties:
 *               demandePartageId: { type: string }
 *               ownerOrgId:       { type: string }
 *               codeAdn:          { type: string, nullable: true }
 *               urlOriginal:      { type: string, format: uri, nullable: true }
 *               estTraduit:       { type: boolean, nullable: true }
 *               aDocument:        { type: boolean, nullable: true }
 *     responses:
 *       201:
 *         description: Document créé (et chiffré si applicable)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:  { type: string, example: "Document créé" }
 *                 document: { $ref: '#/components/schemas/Document' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.post(
    "/",
    requireAuth,
    requirePermission("documents.create"),
    uploadLimiter,
    checkUploadQuota,
    upload.single("file"),
    fileCleanup,
    validateUploadedFile,
    ctrl.createDocumentPartage
);

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Met à jour un document
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeAdn:     { type: string, nullable: true }
 *               urlOriginal: { type: string, format: uri, nullable: true }
 *               estTraduit:  { type: boolean, nullable: true }
 *               aDocument:   { type: boolean, nullable: true }
 *     responses:
 *       200:
 *         description: Document mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:  { type: string, example: "Document mis à jour" }
 *                 document: { $ref: '#/components/schemas/Document' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("documents.update"),
    ctrl.update
);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Supprime un document
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Document supprimé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("documents.delete"),
    ctrl.delete
);


router.delete(
    "/:id/traduction",
    requireAuth,
    requirePermission("documents.translate"),
    ctrl.deleteTraduction
);

/**
 * @swagger
 * /api/documents/{id}/traduction:
 *   post:
 *     summary: Ajoute une traduction en tant que nouveau document lié à l'original
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [ownerOrgId, file]
 *             properties:
 *               ownerOrgId: { type: string }
 *               file:
 *                 type: string
 *                 format: binary
 *               codeAdn: { type: string, nullable: true }
 *     responses:
 *       201: { description: Document traduction créé }
 *       400: { description: Erreur validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Document original introuvable }
 *       500: { description: Erreur serveur }
 */
// routes/document.routes.js
router.post(
    "/:id/traduire-upload",
    requireAuth,
    requirePermission("documents.translate"),
    uploadLimiter,
    upload.single("file"),
    fileCleanup,
    validateUploadedFile,
    ctrl.traduireUpload
);



/**
 * @swagger
 * /api/documents/{id}/content:
 *   get:
 *     summary: Récupère le contenu d'un document (original, traduit ou chiffré)
 *     description: Retourne un flux binaire (PDF). Si le document est chiffré, il est déchiffré côté serveur après vérification d'intégrité.
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [original, traduit, chiffre]
 *           default: original
 *       - in: query
 *         name: display
 *         schema: { type: boolean, default: false }
 *         description: Si true, force l'affichage inline (Content-Disposition inline)
 *     responses:
 *       200:
 *         description: Flux PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401: { description: Non authentifié }
 *       403: { description: Accès refusé / intégrité invalide }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id/content",
    requireAuth,
    requirePermission("documents.read"),
    checkDocumentAccess,
    ctrl.getDocumentContent
);

/**
 * @swagger
 * /api/documents/{id}/info:
 *   get:
 *     summary: Récupère les informations d'un document (pour UI)
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Informations du document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 document:
 *                   type: object
 *                   properties:
 *                     id:           { type: string }
 *                     codeAdn:      { type: string, nullable: true }
 *                     estTraduit:   { type: boolean }
 *                     aDocument:    { type: boolean }
 *                     createdAt:    { type: string, format: date-time, nullable: true }
 *                     hasOriginal:  { type: boolean, nullable: true }
 *                     hasTraduit:   { type: boolean, nullable: true }
 *                     isEncrypted:  { type: boolean, nullable: true }
 *                     encryptedAt:  { type: string, format: date-time, nullable: true }
 *                     ownerOrg:
 *                       type: object
 *                       properties:
 *                         id:   { type: string }
 *                         name: { type: string }
 *                         slug: { type: string }
 *                     contentUrls:
 *                       type: object
 *                       properties:
 *                         original: { type: string, format: uri, nullable: true }
 *                         traduit:  { type: string, format: uri, nullable: true }
 *       401: { description: Non authentifié }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id/info",
    requireAuth,
    requirePermission("documents.read"),
    checkDocumentAccess, [param("id").isString().trim()],
    handleValidation,
    ctrl.getDocumentInfo
);

/**
 * @swagger
 * /api/documents/{id}/verify:
 *   get:
 *     summary: Vérifie l'intégrité d'un document
 *     description: Calcule/compare le hash et retourne le statut d'intégrité.
 *     tags: [Documents]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Résultat de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:            { type: boolean, example: true }
 *                 computedHash:  { type: string, nullable: true }
 *                 message:       { type: string, example: "Intégrité vérifiée" }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id/verify",
    requireAuth,
    requirePermission("documents.verify"),
    checkDocumentAccess,
    // canVerifyIntegrity, // <- active si tu veux une permission dédiée
    [param("id").isString().trim()],
    handleValidation,
    ctrl.verifyIntegrity
);

/**
 * Route protégée pour servir les fichiers uploadés
 * Remplace le serveur statique pour les documents
 */
router.get(
    /^\/file\/(.+)$/,
    requireAuth,
    requirePermission("documents.read"),
    async (req, res) => {
        try {
            const { PrismaClient } = require("@prisma/client");
            const prisma = new PrismaClient();
            const path = require("path");
            const fs = require("fs");
            const secureStorage = require("../utils/secureStorage");

            // Extraire le chemin depuis l'URL (tout après /file/)
            const urlMatch = req.originalUrl.match(/\/file\/(.+)$/);
            if (!urlMatch || !urlMatch[1]) {
                await prisma.$disconnect();
                return res.status(400).json({
                    success: false,
                    message: "Chemin de fichier manquant",
                    code: "MISSING_PATH"
                });
            }
            
            // Décoder le chemin
            const filePath = decodeURIComponent(urlMatch[1]);
            
            // Vérifier que le chemin est sécurisé (prévention path traversal)
            const baseDir = path.resolve(process.cwd(), "uploads");
            const fullPath = path.resolve(baseDir, filePath);
            
            if (!secureStorage.isPathSafe(fullPath, baseDir)) {
                await prisma.$disconnect();
                return res.status(403).json({
                    success: false,
                    message: "Accès refusé",
                    code: "ACCESS_DENIED"
                });
            }

            // Vérifier que le fichier existe
            if (!fs.existsSync(fullPath)) {
                await prisma.$disconnect();
                return res.status(404).json({
                    success: false,
                    message: "Fichier introuvable",
                    code: "FILE_NOT_FOUND"
                });
            }

            // Trouver le document associé à ce fichier
            const document = await prisma.documentPartage.findFirst({
                where: {
                    OR: [
                        { urlOriginal: { contains: filePath } },
                        { urlChiffre: { contains: filePath } },
                        { urlTraduit: { contains: filePath } }
                    ]
                },
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
                await prisma.$disconnect();
                return res.status(404).json({
                    success: false,
                    message: "Document introuvable",
                    code: "DOCUMENT_NOT_FOUND"
                });
            }

            // Vérifier les permissions d'accès
            const user = res.locals.user;
            const hasAccess =
                document.demandePartage.userId === user.id ||
                user.organizationId === document.demandePartage.targetOrgId ||
                user.organizationId === document.demandePartage.assignedOrgId ||
                user.organizationId === document.ownerOrgId ||
                user.permissionKeys?.includes("documents.read") ||
                user.permissionKeys?.includes("documents.manage") ||
                user.role === "ADMIN";

            if (!hasAccess) {
                await prisma.$disconnect();
                return res.status(403).json({
                    success: false,
                    message: "Accès refusé - permissions insuffisantes",
                    code: "ACCESS_DENIED"
                });
            }

            // Servir le fichier
            const stats = fs.statSync(fullPath);
            const filename = document.codeAdn 
                ? `${document.codeAdn}.pdf` 
                : `document-${document.id}.pdf`;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            res.setHeader('Cache-Control', 'private, max-age=3600');

            const fileStream = fs.createReadStream(fullPath);
            fileStream.pipe(res);

            // Log de l'accès
            const { createAuditLog } = require("../utils/audit");
            await createAuditLog({
                userId: user.id,
                action: "DOCUMENT_FILE_ACCESSED",
                resource: "documents",
                resourceId: document.id,
                details: { filePath, filename },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            });

            await prisma.$disconnect();
        } catch (error) {
            console.error("Erreur serveur fichier:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération du fichier",
                code: "SERVER_ERROR"
            });
        }
    }
);

module.exports = router;