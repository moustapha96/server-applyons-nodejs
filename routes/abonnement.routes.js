// routes/abonnement.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/abonnement.controller");
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
    query("sortBy").optional().isIn(["createdAt", "updatedAt", "dateDebut", "dateExpiration", "montant"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
];

const listValidators = [
    ...paginated,
    query("organizationId").optional().isString().trim(),
    query("activeOnly").optional().isBoolean().toBoolean(),
    query("expiredOnly").optional().isBoolean().toBoolean(),
    query("dateFrom").optional().isISO8601(),
    query("dateTo").optional().isISO8601(),
    query("minMontant").optional().isNumeric(),
    query("maxMontant").optional().isNumeric(),
    // flags string pour Swagger; parsés côté controller
    query("withOrg").optional().isIn(["true", "false"]),
    query("withPayments").optional().isIn(["true", "false"]),
];

/**
 * @swagger
 * tags:
 *   name: Abonnements
 *   description: Gestion des abonnements
 */

/**
 * @swagger
 * /api/abonnements:
 *   get:
 *     summary: Liste des abonnements
 *     description: Retourne une liste paginée et filtrable des abonnements.
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, updatedAt, dateDebut, dateExpiration, montant] }
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *         description: Ordre de tri
 *       - in: query
 *         name: organizationId
 *         schema: { type: string }
 *         description: Filtrer par organisation
 *       - in: query
 *         name: activeOnly
 *         schema: { type: boolean }
 *         description: Ne retourner que les abonnements actifs
 *       - in: query
 *         name: expiredOnly
 *         schema: { type: boolean }
 *         description: Ne retourner que les abonnements expirés
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: minMontant
 *         schema: { type: number }
 *       - in: query
 *         name: maxMontant
 *         schema: { type: number }
 *       - in: query
 *         name: withOrg
 *         schema: { type: string, enum: [true, false], example: "true" }
 *         description: Inclure les infos d'organisation
 *       - in: query
 *         name: withPayments
 *         schema: { type: string, enum: [true, false], example: "false" }
 *         description: Inclure les paiements liés (si implémenté côté controller)
 *     responses:
 *       200:
 *         description: Liste paginée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abonnements:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Abonnement' }
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
    requirePermission("abonnements.read"),
    listValidators,
    handleValidation,
    ctrl.list
);


/**
 * @swagger
 * /api/abonnements/stats:
 *   get:
 *     summary: Statistiques des abonnements
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Statistiques agrégées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:      { type: integer, example: 42 }
 *                 active:     { type: integer, example: 28 }
 *                 expired:    { type: integer, example: 14 }
 *                 byMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:  { type: string, example: "2025-09" }
 *                       count:  { type: integer, example: 7 }
 *                 byOrg:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orgId:  { type: string }
 *                       count:  { type: integer }
 *       401: { description: Non authentifié }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("abonnements.read"),
    // [query("organizationId").optional().isString().trim()],
    // handleValidation,
    ctrl.stats
);



/**
 * @swagger
 * /api/abonnements/{id}:
 *   get:
 *     summary: Récupère un abonnement par ID
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Abonnement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abonnement: { $ref: '#/components/schemas/Abonnement' }
 *                 organization:
 *                   $ref: '#/components/schemas/Organization'
 *       401: { description: Non authentifié }
 *       404: { description: Abonnement introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("abonnements.read"),
    // [param("id").isString().trim()],
    // handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/abonnements:
 *   post:
 *     summary: Crée un nouvel abonnement
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [organizationId, dateDebut, dateExpiration, montant]
 *             properties:
 *               organizationId: { type: string }
 *               dateDebut:       { type: string, format: date }
 *               dateExpiration:  { type: string, format: date }
 *               montant:         { type: number, example: 199.99 }
 *     responses:
 *       201:
 *         description: Abonnement créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:    { type: string, example: "Abonnement créé" }
 *                 abonnement: { $ref: '#/components/schemas/Abonnement' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.post(
    "/",
    requireAuth,
    requirePermission("abonnements.manage"),
    // [
    //     body("organizationId").isString().notEmpty().trim(),
    //     body("dateDebut").isISO8601().notEmpty(),
    //     body("dateExpiration").isISO8601().notEmpty(),
    //     body("montant").isNumeric(),
    // ],
    // handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   put:
 *     summary: Met à jour un abonnement
 *     tags: [Abonnements]
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
 *               dateDebut:      { type: string, format: date }
 *               dateExpiration: { type: string, format: date }
 *               montant:        { type: number }
 *     responses:
 *       200:
 *         description: Abonnement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:    { type: string, example: "Abonnement mis à jour" }
 *                 abonnement: { $ref: '#/components/schemas/Abonnement' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Abonnement introuvable }
 *       500: { description: Erreur serveur }
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("abonnements.manage"),
    // [
    //     param("id").isString().trim(),
    //     body("dateDebut").optional().isISO8601(),
    //     body("dateExpiration").optional().isISO8601(),
    //     body("montant").optional().isNumeric(),
    // ],
    // handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   delete:
 *     summary: Archive un abonnement (soft delete)
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Abonnement archivé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("abonnements.manage"),
    //  [param("id").isString().trim()],
    // handleValidation,
    ctrl.softDelete
);

/**
 * @swagger
 * /api/abonnements/{id}/restore:
 *   patch:
 *     summary: Restaure un abonnement archivé
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Abonnement restauré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.patch(
    "/:id/restore",
    requireAuth,
    requirePermission("abonnements.manage"),
    //  [param("id").isString().trim()],
    // handleValidation,
    ctrl.restore
);

/**
 * @swagger
 * /api/abonnements/{id}/hard-delete:
 *   delete:
 *     summary: Supprime définitivement un abonnement
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Abonnement supprimé définitivement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Abonnement introuvable }
 *       500: { description: Erreur serveur }
 */
router.delete(
    "/:id/hard-delete",
    requireAuth,
    requirePermission("abonnements.manage"),
    // [param("id").isString().trim()],
    // handleValidation,
    ctrl.hardDelete
);

/**
 * @swagger
 * /api/abonnements/{id}/renew:
 *   post:
 *     summary: Renouvelle un abonnement
 *     tags: [Abonnements]
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
 *             required: [dateDebut, dateExpiration, montant]
 *             properties:
 *               dateDebut:      { type: string, format: date }
 *               dateExpiration: { type: string, format: date }
 *               montant:        { type: number }
 *     responses:
 *       201:
 *         description: Abonnement renouvelé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:    { type: string, example: "Abonnement renouvelé" }
 *                 abonnement: { $ref: '#/components/schemas/Abonnement' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Abonnement introuvable }
 *       500: { description: Erreur serveur }
 */
router.post(
    "/:id/renew",
    requireAuth,
    requirePermission("abonnements.manage"),
    // handleValidation,
    ctrl.renew
);

/**
 * @swagger
 * /api/abonnements/organizations/{orgId}/active:
 *   get:
 *     summary: Récupère l'abonnement actif pour une organisation
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Abonnement actif (ou null)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abonnement: 
 *                   anyOf:
 *                     - $ref: '#/components/schemas/Abonnement'
 *                     - type: "null"
 *       401: { description: Non authentifié }
 *       404: { description: Organisation introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/organisations/:orgId/active",
    requireAuth,
    requirePermission("abonnements.read"),
    // [param("orgId").isString().trim()],
    // handleValidation,
    ctrl.getActiveForOrg
);

/**
 * @swagger
 * /api/abonnements/expiring-soon:
 *   get:
 *     summary: Liste des abonnements expirant bientôt
 *     tags: [Abonnements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: days
 *         schema: { type: integer, minimum: 1, default: 30 }
 *         description: Fenêtre en jours pour considérer "bientôt expiré"
 *       - in: query
 *         name: organizationId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste paginée des abonnements qui expirent bientôt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abonnements:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Abonnement' }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401: { description: Non authentifié }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/expiring-soon",
    requireAuth,
    requirePermission("abonnements.read"),
    // [
    //     ...paginated,
    //     query("days").optional().isInt({ min: 1 }).toInt(),
    //     query("organizationId").optional().isString().trim(),
    // ],
    // handleValidation,
    ctrl.expiringSoon
);

module.exports = router;