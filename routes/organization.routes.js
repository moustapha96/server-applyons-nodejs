// routes/organization.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/organization.controller");
const { body, query, param, validationResult } = require("express-validator");

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
const listValidators = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("sortBy").optional().isString().trim(),
    query("sortOrder").optional().isIn(["asc", "desc"]),
    query("type").optional().isString().trim(),
    query("country").optional().isString().trim(),
    query("search").optional().isString().trim(),
    query("withDeleted").optional().isIn(["true", "false"]),
];

const createValidators = [
    body("name").isString().trim().isLength({ min: 2 }),
    body("slug").optional().isString().trim(),
    body("type").isString().trim(), // enum côté modèle
    body("email").optional().isEmail().trim(),
    body("phone").optional().isString().trim(),
    body("address").optional().isString().trim(),
    body("website").optional().isString().trim(),
    body("country").optional().isString().trim(),
];

const updateValidators = [
    param("id").isString().trim(),
    body("name").optional().isString().trim().isLength({ min: 2 }),
    body("slug").optional().isString().trim(),
    body("type").optional().isString().trim(),
    body("email").optional().isEmail().trim(),
    body("phone").optional().isString().trim(),
    body("address").optional().isString().trim(),
    body("website").optional().isString().trim(),
    body("country").optional().isString().trim(),
];

const idParam = [param("id").isString().trim()];

/* -------------------------------------------
 * Swagger
 * -----------------------------------------*/
/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Gestion des organisations
 */

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Liste des organisations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: Filtrer par type d'organisation
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *         description: Filtrer par pays
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche plein texte (name, email, phone...)
 *       - in: query
 *         name: withDeleted
 *         schema: { type: string, enum: [true, false] }
 *         description: Inclure les éléments supprimés
 *     responses:
 *       200:
 *         description: Liste des organisations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizations:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Organization' }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    // requireAuth,
    // requirePermission("organizations.read"),
    listValidators,
    // handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/organizations/check-slug:
 *   get:
 *     summary: Vérifie la disponibilité d'un slug (par slug ou name)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema: { type: string }
 *         description: Slug souhaité (facultatif)
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Nom (pour proposer un slug si aucun slug fourni)
 *     responses:
 *       200:
 *         description: Résultat de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available: { type: boolean }
 *                 slug: { type: string }
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/check-slug",
    requireAuth,
    requirePermission("organizations.read"), [query("slug").optional().isString().trim(), query("name").optional().isString().trim()],
    handleValidation,
    ctrl.checkSlug
);

/**
 * @swagger
 * /api/organizations/stats:
 *   get:
 *     summary: Statistiques sur les organisations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: withDeleted
 *         schema: { type: string, enum: [true, false] }
 *         description: Inclure les éléments supprimés
 *     responses:
 *       200:
 *         description: Statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total: { type: integer }
 *                 byType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type: { type: string }
 *                       count: { type: integer }
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("organizations.read"), [query("withDeleted").optional().isIn(["true", "false"])],
    handleValidation,
    ctrl.stats
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Récupère une organisation
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
 *         description: Détails de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organization:
 *                   $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("organizations.read"),
    idParam,
    // handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Crée une organisation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string, example: "Université X" }
 *               slug: { type: string, example: "universite-x" }
 *               type: { type: string, example: "INSTITUTION" }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               address: { type: string }
 *               website: { type: string }
 *               country: { type: string }
 *     responses:
 *       201:
 *         description: Organisation créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Organisation créée" }
 *                 organization:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Erreurs de validation
 *       409:
 *         description: Conflit (slug déjà pris, etc.)
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    // requireAuth,
    // requirePermission("organizations.write"),
    createValidators,
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   patch:
 *     summary: Met à jour une organisation (partiel)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: Organisation mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Organisation mise à jour" }
 *                 organization:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Erreurs de validation
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id",
    requireAuth,
    requirePermission("organizations.write"),
    updateValidators,
    handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Archive (soft delete) une organisation
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
 *         description: Organisation archivée
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("organizations.write"),
    idParam,
    handleValidation,
    ctrl.softDelete
);

/**
 * @swagger
 * /api/organizations/{id}/restore:
 *   post:
 *     summary: Restaure une organisation archivée
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
 *         description: Organisation restaurée
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/:id/restore",
    requireAuth,
    requirePermission("organizations.write"),
    idParam,
    handleValidation,
    ctrl.restore
);

/**
 * @swagger
 * /api/organizations/{id}/hard:
 *   delete:
 *     summary: Suppression définitive d'une organisation
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
 *         description: Organisation supprimée définitivement
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id/hard",
    requireAuth,
    requirePermission("organizations.write"),
    idParam,
    handleValidation,
    ctrl.hardDelete
);

/**
 * @swagger
 * /api/organizations/{id}/users:
 *   get:
 *     summary: Liste les utilisateurs d'une organisation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *     responses:
 *       200:
 *         description: Utilisateurs de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id/users",
    requireAuth,
    requirePermission("organizations.read"), [
        param("id").isString().trim(),
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("search").optional().isString().trim(),
        query("role").optional().isString().trim(),
        query("sortBy").optional().isString().trim(),
        query("sortOrder").optional().isIn(["asc", "desc"]),
    ],
    handleValidation,
    ctrl.listUsersByOrg
);

/**
 * @swagger
 * /api/organizations/{id}/departments:
 *   get:
 *     summary: Liste les départements d'une organisation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *     responses:
 *       200:
 *         description: Départements de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 departments:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Department' }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id/departments",
    requireAuth,
    requirePermission("organizations.read"), [
        param("id").isString().trim(),
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("search").optional().isString().trim(),
        query("sortBy").optional().isString().trim(),
        query("sortOrder").optional().isIn(["asc", "desc"]),
    ],
    handleValidation,
    ctrl.listDepartmentsByOrg
);


/**
 * @swagger
 * /api/organizations/{id}/demandes:
 *   get:
 *     summary: Liste les demandes d'une organisation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *     responses:
 *       200:
 *         description: Demandes de l'organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Demande' }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Organisation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id/demandes",
    requireAuth,
    requirePermission("organizations.read"), [
        param("id").isString().trim(),
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("search").optional().isString().trim(),
        query("sortBy").optional().isString().trim(),
        query("sortOrder").optional().isIn(["asc", "desc"]),
    ],
    handleValidation,
    ctrl.listDemandesByOrg
);
module.exports = router;