// routes/demande.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/demande.controller");
const { query, body, param, validationResult } = require("express-validator");

const {
    requireAuth,
    requirePermission,
    checkDocumentAccess,
} = require("../middleware/auth.middleware");

/* Helpers */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "Erreurs de validation.", code: "VALIDATION_ERROR", errors: errors.array() });
    }
    next();
};

/* Validators communs */
const paginated = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("sortBy").optional().isIn(["dateDemande", "createdAt", "updatedAt", "code"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
];

const listValidators = [
    ...paginated,
    query("search").optional().isString().trim(),
    query("userId").optional().isString().trim(),
    query("targetOrgId").optional().isString().trim(),
    query("assignedOrgId").optional().isString().trim(),
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
    query("status").optional().isString().trim(),
];

/* Champs communs create/update (beaucoup d’optionnels) */
const commonBodyFields = [
    // académiques existants
    body("serie").optional().isString().trim(),
    body("niveau").optional().isString().trim(),
    body("mention").optional().isString().trim(),
    body("annee").optional().isString().trim(),
    body("countryOfSchool").optional().isString().trim(),
    body("secondarySchoolName").optional().isString().trim(),
    body("graduationDate").optional().isISO8601(),

    // header/dossier
    body("periode").optional().isString().trim(),
    body("year").optional().isString().trim(),
    body("status").optional().isString().trim(),
    body("observation").optional().isString().trim(),

    // paiement (statut “métier” côté demande)
    body("statusPayment").optional().isString().trim(),

    // Identité personnelle
    body("dob").optional().isISO8601(),
    body("citizenship").optional().isString().trim(),
    body("passport").optional().isString().trim(),

    // Anglais / tests
    body("isEnglishFirstLanguage").optional().isBoolean().toBoolean(),
    body("englishProficiencyTests").optional(), // JSON
    body("testScores").optional().isString().trim(),

    // Scolarité / notes
    body("gradingScale").optional().isString().trim(),
    body("gpa").optional().isString().trim(),
    body("examsTaken").optional(), // JSON
    body("intendedMajor").optional().isString().trim(),

    // Activités / distinctions
    body("extracurricularActivities").optional().isString().trim(),
    body("honorsOrAwards").optional().isString().trim(),

    // Famille
    body("parentGuardianName").optional().isString().trim(),
    body("occupation").optional().isString().trim(),
    body("educationLevel").optional().isString().trim(),

    // Financier
    body("willApplyForFinancialAid").optional().isBoolean().toBoolean(),
    body("hasExternalSponsorship").optional().isBoolean().toBoolean(),

    // Visa
    body("visaType").optional().isString().trim(),
    body("hasPreviouslyStudiedInUS").optional().isBoolean().toBoolean(),

    // Essays
    body("personalStatement").optional().isString(),
    body("optionalEssay").optional().isString(),

    // Candidature
    body("applicationRound").optional().isString().trim(),
    body("howDidYouHearAboutUs").optional().isString().trim(),
];

/**
 * @swagger
 * tags:
 *   name: Demandes
 *   description: Gestion des demandes de partage
 */

/**
 * @swagger
 * /api/demandes:
 *   get:
 *     summary: Liste des demandes de partage
 *     description: Retourne une liste paginée et filtrable des demandes.
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Code, année, niveau, email utilisateur, nom d'organisation
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: targetOrgId
 *         schema: { type: string }
 *       - in: query
 *         name: assignedOrgId
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste paginée des demandes
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DemandeListResponse' }
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    requireAuth,
    requirePermission("demandes.read"),
    // listValidators,
    // handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/demandes/{id}:
 *   get:
 *     summary: Récupère une demande par ID
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails de la demande
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DemandeItemResponse' }
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("demandes.read"), [param("id").isString().trim()],
    handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/demandes:
 *   post:
 *     summary: Crée une nouvelle demande de partage
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateDemande' }
 *     responses:
 *       201:
 *         description: Demande créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Demande créée" }
 *                 demande: { $ref: '#/components/schemas/Demande' }
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    requireAuth,
    requirePermission("demandes.manage"),
    // [
    //     body("targetOrgId").isString().notEmpty().trim(),
    //     body("assignedOrgId").optional().isString().trim(),
    //     body("userId").optional().isString().trim(),
    //     ...commonBodyFields,
    // ],
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/demandes/{id}:
 *   put:
 *     summary: Met à jour une demande de partage
 *     tags: [Demandes]
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
 *           schema: { $ref: '#/components/schemas/UpdateDemande' }
 *     responses:
 *       200:
 *         description: Demande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Demande mise à jour" }
 *                 demande: { $ref: '#/components/schemas/Demande' }
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("demandes.manage"),
    // handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/demandes/{id}/status:
 *   patch:
 *     summary: Met à jour le statut d'une demande
 *     tags: [Demandes]
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
 *               status: { type: string, example: "VALIDATED" }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Statut mis à jour" }
 *                 demande: { $ref: '#/components/schemas/Demande' }
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/status",
    requireAuth,
    requirePermission("demandes.manage"), [param("id").isString().trim(), body("status").isString().notEmpty().trim()],
    handleValidation,
    ctrl.changeStatus
);

/**
 * @swagger
 * /api/demandes/{id}/assign:
 *   patch:
 *     summary: Assigne (ou désassigne) une organisation à une demande
 *     tags: [Demandes]
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
 *               assignedOrgId:
 *                 type: string
 *                 nullable: true
 *                 description: Laisser vide/null pour désassigner
 *     responses:
 *       200:
 *         description: Assignation mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Assignation mise à jour" }
 *                 demande: { $ref: '#/components/schemas/Demande' }
 *       400:
 *         description: Organisation assignée invalide
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/assign",
    requireAuth,
    requirePermission("demandes.manage"), [param("id").isString().trim(), body("assignedOrgId").optional().isString().trim()],
    handleValidation,
    ctrl.assignOrg
);

/**
 * @swagger
 * /api/demandes/{id}:
 *   delete:
 *     summary: Archive (soft delete) une demande
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Demande archivée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageOnly' }
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("demandes.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.softDelete
);

/**
 * @swagger
 * /api/demandes/{id}/restore:
 *   patch:
 *     summary: Restaure une demande archivée
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Demande restaurée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageOnly' }
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/restore",
    requireAuth,
    requirePermission("demandes.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.restore
);

/**
 * @swagger
 * /api/demandes/{id}/hard-delete:
 *   delete:
 *     summary: Supprime définitivement une demande
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Demande supprimée définitivement
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageOnly' }
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id/hard-delete",
    requireAuth,
    requirePermission("demandes.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.hardDelete
);

// /**
//  * @swagger
//  * /api/demandes/{id}/documents:
//  *   get:
//  *     summary: Liste les documents d'une demande
//  *     tags: [Demandes]
//  *     security: [ { bearerAuth: [] } ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200:
//  *         description: Liste des documents
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 documents:
//  *                   type: array
//  *                   items: { $ref: '#/components/schemas/Document' }
//  *       500:
//  *         description: Erreur serveur
//  */
// router.get(
//     "/:id/documents",
//     requireAuth,
//     requirePermission("demandes.read"), [param("id").isString().trim()],
//     handleValidation,
//     ctrl.listDocuments
// );

/**
 * @swagger
 * /api/demandes/{id}/documents:
 *   post:
 *     summary: Ajoute un document à une demande (chiffrement automatique si urlOriginal)
 *     tags: [Demandes]
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
 *             required: [ownerOrgId]
 *             properties:
 *               ownerOrgId: { type: string }
 *               urlOriginal: { type: string, format: uri, nullable: true }
 *               codeAdn: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Document créé (et chiffré si applicable)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Document enregistré et chiffré" }
 *                 document: { $ref: '#/components/schemas/Document' }
 *       400:
 *         description: ownerOrgId manquant
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/:id/documents",
    requireAuth,
    requirePermission("demandes.manage"),
    // handleValidation,
    ctrl.addDocument
);

/**
 * @swagger
 * /api/demandes/{id}/payments:
 *   post:
 *     summary: Crée un paiement pour une demande
 *     tags: [Demandes]
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
 *             required: [provider, amount, currency, paymentType]
 *             properties:
 *               provider: { type: string, example: "STRIPE" }
 *               amount: { type: number, example: 100.5 }
 *               currency: { type: string, example: "USD" }
 *               paymentType:
 *                 type: string
 *                 enum: [MOBILE_MONEY, BANK_TRANSFER, CARD, CASH]
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
 *       404:
 *         description: Demande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/:id/payments",
    requireAuth,
    requirePermission("demandes.manage"), [
        param("id").isString().trim(),
        body("provider").isString().notEmpty().trim(),
        body("amount").isNumeric(),
        body("currency").isString().notEmpty().trim(),
        body("paymentType").isIn(["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"]),
    ],
    handleValidation,
    ctrl.createPayment
);

/**
 * @swagger
 * /api/demandes/{demandeId}/payments:
 *   patch:
 *     summary: Met à jour le statut d'un paiement d'une demande
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: demandeId
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
 *               providerRef:
 *                 type: string
 *                 nullable: true
 *               paymentInfo:
 *                 type: object
 *                 additionalProperties: true
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Statut paiement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Statut paiement mis à jour" }
 *                 payment: { $ref: '#/components/schemas/Payment' }
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:demandeId/payments",
    requireAuth,
    requirePermission("demandes.manage"), [
        param("demandeId").isString().trim(),
        body("status").isIn(["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"]).notEmpty(),
        body("providerRef").optional().isString().trim(),
        body("paymentInfo").optional().isObject(),
    ],
    handleValidation,
    ctrl.updatePaymentStatus
);

/**
 * @swagger
 * /api/demandes/stats:
 *   get:
 *     summary: Statistiques des demandes (mensuelles & par statut)
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: orgId
 *         schema: { type: string }
 *         description: Filtrer par organisation cible
 *       - in: query
 *         name: assignedOrgId
 *         schema: { type: string }
 *         description: Filtrer par organisation assignée
 *       - in: query
 *         name: months
 *         schema: { type: integer, minimum: 1, maximum: 24, default: 12 }
 *         description: Nombre de mois à retourner
 *     responses:
 *       200:
 *         description: Statistiques agrégées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthly:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month: { type: string, format: date-time }
 *                       total: { type: integer }
 *                 byStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status: { type: string }
 *                       count: { type: integer }
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("demandes.read"), [query("orgId").optional().isString().trim(), query("assignedOrgId").optional().isString().trim(), query("months").optional().isInt({ min: 1, max: 24 }).toInt()],
    handleValidation,
    ctrl.stats
);

/**
 * @swagger
 * /api/demandes/documents/{documentId}/content:
 *   get:
 *     summary: Récupère le contenu d'un document (original ou traduit)
 *     description: Retourne un flux PDF. Si le document est chiffré, il est déchiffré côté serveur après vérification d'intégrité.
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [original, traduit]
 *           default: original
 *     responses:
 *       200:
 *         description: Flux PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accès refusé ou violation d'intégrité détectée
 *       404:
 *         description: Document introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/documents/:documentId/content",
    requireAuth,
    requirePermission("documents.read"),
    checkDocumentAccess, [param("documentId").isString().trim(), query("type").optional().isIn(["original", "traduit"])],
    handleValidation,
    ctrl.getDocumentContent
);

/**
 * @swagger
 * /api/demandes/documents/{documentId}/info:
 *   get:
 *     summary: Récupère les informations d'un document (pour UI)
 *     tags: [Demandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
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
 *                     id:
 *                       type: string
 *                     codeAdn:
 *                       type: string
 *                       nullable: true
 *                     estTraduit:
 *                       type: boolean
 *                     aDocument:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     hasOriginal:
 *                       type: boolean
 *                     hasTraduit:
 *                       type: boolean
 *                     hasEncrypted:
 *                       type: boolean
 *                     isEncrypted:
 *                       type: boolean
 *                     blockchainHash:
 *                       type: string
 *                       nullable: true
 *                     encryptedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     ownerOrg:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                     contentUrls:
 *                       type: object
 *                       properties:
 *                         original:
 *                           type: string
 *                           format: uri
 *                         traduit:
 *                           type: string
 *                           format: uri
 *                           nullable: true
 *       404:
 *         description: Document introuvable
 *       500:
 *         description: Erreur serveur
 */

router.get(
    "/documents/:documentId/info",
    requireAuth,
    requirePermission("documents.read"), [param("documentId").isString().trim()],
    handleValidation,
    ctrl.getDocumentInfo
);

/**
 * @swagger
 * /api/demandes/users/{userId}:
 *   get:
 *     summary: Récupère les demandes d'un utilisateur de role demandeur
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des demandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 demandes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Demande' }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Utilisateur introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/users/:userId/organizations/:assignedOrgId",
    requireAuth,
    requirePermission("demandes.read"), [param("userId").isString().trim()],
    // handleValidation,
    ctrl.listDemandesByUserId
);

/**
 * @swagger
 * /api/demandes/organizations/{id}:
 *   get:
 *     summary: Récupère les demandes d'une organisation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des demandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 demandes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Demande' }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Organisation introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/organizations/:id",
    requireAuth,
    requirePermission("organizations.read"),
    ctrl.listDemandesByOrgId
);


/**
 * @swagger
 * /api/demandes/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'une demande
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Document' }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Document introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/:demandeId/documents",
    requireAuth,
    requirePermission("demandes.read"),
    ctrl.listDocumentsByDemandeId
);


/**
 * @swagger
 * /api/demandes/to-treat/{idOrg}:
 *   get:
 *     summary: Récupère les demandes à traiter pour une organisation
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: idOrg
 *         required: true
 *         schema: { type: string }
 *         description: ID de l'organisation
 *     responses:
 *       200:
 *         description: Liste des demandes à traiter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 demandes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Demande' }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Organisation introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/to-treat/:assignedOrgId",
    requireAuth,
    requirePermission("demandes.read"), [param("idOrg").isString().trim()],
    ctrl.listDemandesToTreatByOrgId
);


/**
 * @swagger
 * /api/demandes/users/{userId}:
 *   get:
 *     summary: Récupère les demandes d'un utilisateur
 *     tags: [Demandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des demandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 demandes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Demande' }
 *       401: { description: Non authentifié }
 *       403: { description: Non autorisé }
 *       404: { description: Utilisateur introuvable }
 *       500: { description: Erreur serveur }
 */
router.get(
    "/users/:userId",
    requireAuth,
    requirePermission("demandes.read"), [param("userId").isString().trim()],
    ctrl.listDemandesByUserId
);

module.exports = router;