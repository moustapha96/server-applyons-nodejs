// routes/document.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/document.controller");
const { param, query, body, validationResult } = require("express-validator");


const multer = require("multer")
const path = require("path")
const fs = require("fs")


const {
    requireAuth,
    requirePermission,
    // Optionnels si tu veux verrouiller plus finement :
    canDecrypt, // exiger la permission de déchiffrement
    canVerifyIntegrity, // exiger la permission de vérification d’intégrité
    checkDocumentAccess, // vérifie que l’utilisateur a le droit d’accéder au doc
    requireEncryptedDocument, // vérifie que le doc est chiffré (depuis ton middleware)
} = require("../middleware/auth.middleware");




const uploadDir = "uploads/documents";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "document-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    },
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
    upload.single("file"),
    requirePermission("documents.create"),
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
    upload.single("file"),
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


module.exports = router;