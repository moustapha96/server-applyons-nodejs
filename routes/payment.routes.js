// routes/payment.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/payment.controller");
const { query, body, param, validationResult } = require("express-validator");


// Middlewares unifiés
const { requireAuth, requirePermission } = require("../middleware/auth.middleware");

/* -------------------------------------------
 * Helper validation
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
    query("status").optional().isIn(["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"]),
    query("provider").optional().isString().trim(),
    query("abonnementId").optional().isString().trim(),
    query("demandePartageId").optional().isString().trim(),
    query("transactionId").optional().isString().trim(),
];

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements
 */


/**
 * @swagger
 * /api/payments/stats:
 *   get:
 *     summary: Statistiques des paiements
 *     tags: [Payments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: provider
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [INITIATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, CANCELED, FAILED]
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
 *                       status: { type: string }
 *                       count:  { type: integer }
 *                 byProvider:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       provider: { type: string }
 *                       total:    { type: number }
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
    ctrl.stats
);


/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Liste des paiements
 *     description: Retourne une liste paginée et filtrable des paiements.
 *     tags: [Payments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [INITIATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, CANCELED, FAILED]
 *       - in: query
 *         name: provider
 *         schema: { type: string }
 *       - in: query
 *         name: abonnementId
 *         schema: { type: string }
 *       - in: query
 *         name: demandePartageId
 *         schema: { type: string }
 *       - in: query
 *         name: transactionId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste paginée des paiements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
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
    // requirePermission("payments.read"),
    listValidators,
    // handleValidation,
    ctrl.list
);



/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Récupère un paiement par ID
 *     tags: [Payments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paiement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       401: { description: Non authentifié }
 *       404: { description: Paiement introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:id",
    requireAuth,
    // requirePermission("payments.read"), [param("id").isString().trim()],
    // handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Crée un nouveau paiement
 *     tags: [Payments]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [provider, amount, currency, paymentType]
 *             properties:
 *               transactionId:   { type: string, nullable: true }
 *               demandePartageId: { type: string, nullable: true }
 *               abonnementId:    { type: string, nullable: true }
 *               provider:        { type: string }
 *               status:
 *                 type: string
 *                 enum: [INITIATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, CANCELED, FAILED]
 *               amount:          { type: number }
 *               currency:        { type: string }
 *               paymentType:
 *                 type: string
 *                 enum: [MOBILE_MONEY, BANK_TRANSFER, CARD, CASH]
 *               providerRef:     { type: string, nullable: true }
 *               paymentInfo:     { type: object, additionalProperties: true, nullable: true }
 *     responses:
 *       201:
 *         description: Paiement créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Paiement créé" }
 *                 payment: { $ref: '#/components/schemas/Payment' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       500: { description: Erreur serveur }
 */
router.post(
    "/",
    requireAuth,
    // requirePermission("payments.manage"),
    //  [
    //     body("transactionId").optional().isString().trim(),
    //     body("demandePartageId").optional().isString().trim(),
    //     body("abonnementId").optional().isString().trim(),
    //     body().custom((value) => {
    //         if (!value.transactionId && !value.demandePartageId && !value.abonnementId) {
    //             throw new Error("Au moins un des champs transactionId, demandePartageId ou abonnementId est requis");
    //         }
    //         return true;
    //     }),
    //     body("provider").isString().notEmpty().trim(),
    //     body("status").optional().isIn(["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"]),
    //     body("amount").isNumeric(),
    //     body("currency").isString().notEmpty().trim(),
    //     body("paymentType").isIn(["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"]),
    //     body("providerRef").optional().isString().trim(),
    //     body("paymentInfo").optional().isObject(),
    // ],
    // handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Met à jour un paiement
 *     tags: [Payments]
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
 *               status:
 *                 type: string
 *                 enum: [INITIATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, CANCELED, FAILED]
 *               providerRef: { type: string, nullable: true }
 *               amount:      { type: number, nullable: true }
 *               paymentInfo: { type: object, additionalProperties: true, nullable: true }
 *     responses:
 *       200:
 *         description: Paiement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Paiement mis à jour" }
 *                 payment: { $ref: '#/components/schemas/Payment' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Paiement introuvable }
 *       500: { description: Erreur serveur }
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("payments.manage"), [
        param("id").isString().trim(),
        body("status").optional().isIn(["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"]),
        body("providerRef").optional().isString().trim(),
        body("amount").optional().isNumeric(),
        body("paymentInfo").optional().isObject(),
    ],
    handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   patch:
 *     summary: Met à jour le statut d'un paiement
 *     tags: [Payments]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [INITIATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, CANCELED, FAILED]
 *               providerRef: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Statut mis à jour" }
 *                 payment: { $ref: '#/components/schemas/Payment' }
 *       400: { description: Erreur de validation }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Paiement introuvable }
 *       500: { description: Erreur serveur }
 */
router.patch(
    "/:id/status",
    requireAuth,
    requirePermission("payments.manage"), [
        param("id").isString().trim(),
        body("status").isIn(["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"]).notEmpty(),
        body("providerRef").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.updateStatus
);





// Lecture statut paiement d’une demande
router.get(
    "/demande/:demandeId",
    requireAuth,
    // requirePermission("payments.read"),
    ctrl.getForDemande
);

router.get(
    "/:demandeId/quote",
    requireAuth,
    // requirePermission("payments.read"),
    ctrl.getQuote
);



// STRIPE
router.post(
    "/stripe/create-intent",
    requireAuth,
    // requirePermission("payments.manage"),
    ctrl.createStripeIntent
);
router.post(
    "/stripe/confirm",
    requireAuth,
    // requirePermission("payments.manage"),
    ctrl.confirmStripe
);

// PAYPAL
router.post(
    "/paypal/create-order",
    requireAuth,
    // requirePermission("payments.manage"),
    ctrl.createPaypalOrder
);
router.post(
    "/paypal/capture",
    requireAuth,
    // requirePermission("payments.manage"),
    ctrl.capturePaypalOrder
);

// Exemple d'endpoint backend
router.post(
    "/stripe/create-intent-institut",
    requireAuth,
    ctrl.createStripeIntentInstitut
);

router.post(
    "/paypal/create-intent-institut",
    requireAuth,
    ctrl.createPaypalIntentInstitut
);

router.post(
    "/stripe/create-intent-demandeur",
    requireAuth,
    ctrl.createStripeIntentDemandeur
);

router.get(
    "/:idOrg/get-price-institut",
    requireAuth,
    ctrl.getAbonnementPriceForOrgType
);


router.get(
    "/get-price-demandeur",
    requireAuth,
    ctrl.getDemandePrice
)

router.get(
    "/paypal/config",
    requireAuth,
    ctrl.getPaypalConfig
);


router.get(
    "/stripe/publishable-key",
    requireAuth,
    ctrl.getStripeConfig
);

module.exports = router;