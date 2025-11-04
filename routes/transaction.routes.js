// routes/transaction.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/transaction.controller");
const { query, body, param, validationResult } = require("express-validator");

// Middlewares unifiés
const { requireAuth, requirePermission } = require("../middleware/auth.middleware");

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
 * Validators
 * -----------------------------------------*/
const paginated = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

const listValidators = [
    ...paginated,
    query("statut").optional().isIn(["PENDING", "SUCCESS", "FAILED", "CANCELED"]),
    query("userId").optional().isString().trim(),
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
];

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gestion des transactions
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Liste des transactions
 *     description: Retourne une liste paginée et filtrable des transactions.
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, CANCELED]
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Liste paginée des transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
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
    requirePermission("transactions.read"),
    listValidators,
    handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Récupère une transaction par ID
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       401: { description: Non authentifié }
 *       404: { description: Transaction introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("transactions.read"), [param("id").isString().trim()],
    handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Crée une nouvelle transaction
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [demandePartageId, montant, typePaiement]
 *             properties:
 *               demandePartageId: { type: string }
 *               montant:          { type: number }
 *               typePaiement:
 *                 type: string
 *                 enum: [MOBILE_MONEY, BANK_TRANSFER, CARD, CASH]
 *               typeTransaction:  { type: string, nullable: true }
 *               statut:
 *                 type: string
 *                 enum: [PENDING, SUCCESS, FAILED, CANCELED]
 *               userId:           { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Transaction créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:     { type: string, example: "Transaction créée" }
 *                 transaction: { $ref: '#/components/schemas/Transaction' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.post(
    "/",
    requireAuth,
    requirePermission("transactions.manage"), [
        body("demandePartageId").isString().notEmpty().trim(),
        body("montant").isNumeric(),
        body("typePaiement").isIn(["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"]),
        body("typeTransaction").optional().isString().trim(),
        body("statut").optional().isIn(["PENDING", "SUCCESS", "FAILED", "CANCELED"]),
        body("userId").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/transactions/{id}/statut:
 *   patch:
 *     summary: Met à jour le statut d'une transaction
 *     tags: [Transactions]
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
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [PENDING, SUCCESS, FAILED, CANCELED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:     { type: string, example: "Statut mis à jour" }
 *                 transaction: { $ref: '#/components/schemas/Transaction' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Transaction introuvable }
 *       500: { description: Erreur serveur }
 */
router.patch(
    "/:id/statut",
    requireAuth,
    requirePermission("transactions.manage"), [param("id").isString().trim(), body("statut").isIn(["PENDING, SUCCESS, FAILED, CANCELED".split(", ").flat()]).notEmpty()],
    handleValidation,
    ctrl.updateStatut
);

// NOTE: La ligne ci-dessus utilise une astuce split pour l'énumération dans le validateur.
// Si tu préfères la version explicite, remplace par :
// [ param("id").isString().trim(), body("statut").isIn(["PENDING","SUCCESS","FAILED","CANCELED"]).notEmpty() ]

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Archive une transaction
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction archivée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Transaction introuvable }
 *       500: { description: Erreur serveur }
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("transactions.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.softDelete
);

/**
 * @swagger
 * /api/transactions/{id}/restore:
 *   patch:
 *     summary: Restaure une transaction archivée
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction restaurée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Transaction introuvable }
 *       500: { description: Erreur serveur }
 */
router.patch(
    "/:id/restore",
    requireAuth,
    requirePermission("transactions.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.restore
);

/**
 * @swagger
 * /api/transactions/stats:
 *   get:
 *     summary: Statistiques des transactions
 *     tags: [Transactions]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, CANCELED]
 *       - in: query
 *         name: typePaiement
 *         schema:
 *           type: string
 *           enum: [MOBILE_MONEY, BANK_TRANSFER, CARD, CASH]
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Statistiques agrégées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       statut: { type: string }
 *                       count:  { type: integer }
 *                 byPaymentType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       typePaiement: { type: string }
 *                       total:        { type: number }
 *                 monthly:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month: { type: string, example: "2025-09" }
 *                       total: { type: number }
 *       401: { description: Non authentifié }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("transactions.read"), [
        query("statut").optional().isIn(["PENDING", "SUCCESS", "FAILED", "CANCELED"]),
        query("typePaiement").optional().isIn(["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"]),
        query("from").optional().isISO8601(),
        query("to").optional().isISO8601(),
    ],
    handleValidation,
    ctrl.stats
);

module.exports = router;