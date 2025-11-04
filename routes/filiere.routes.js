// routes/filiere.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/filiere.controller");
const { query, body, param, validationResult } = require("express-validator");
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
    query("departmentId").optional().isString().trim(),
    query("search").optional().isString().trim(),
    query("level").optional().isString().trim(),
    // string "true"/"false" pour compat Swagger; gère la valeur par défaut côté contrôleur
    query("withDepartment").optional().isIn(["true", "false"]),
];

/**
 * @swagger
 * tags:
 *   name: Filieres
 *   description: Gestion des filières
 */

/**
 * @swagger
 * /api/filieres:
 *   get:
 *     summary: Liste des filières
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de département
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filtrer par niveau (ex. Licence, Master)
 *       - in: query
 *         name: withDepartment
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "true"
 *         description: Inclure les infos de département
 *     responses:
 *       200:
 *         description: Liste des filières
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filieres:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Filiere'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   properties:
 *                     departmentId: { type: string }
 *                     search: { type: string }
 *                     level: { type: string }
 *                     withDepartment: { type: boolean }
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    requireAuth,
    // requirePermission("departments.read"),
    // listValidators,
    handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/filieres/by-organization:
 *   get:
 *     summary: Liste des filières d'une organisation
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filtrer par niveau
 *     responses:
 *       200:
 *         description: Liste des filières par organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filieres:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Filiere'
 *                       - type: object
 *                         properties:
 *                           organization:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id: { type: string }
 *                               name: { type: string }
 *                               slug: { type: string }
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   properties:
 *                     organizationId: { type: string }
 *                     search: { type: string }
 *                     level: { type: string }
 *       400:
 *         description: organizationId manquant
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/by-organization",
    requireAuth,
    // requirePermission("filieres.read"),
    // handleValidation,
    ctrl.listByOrganization,
);


/**
 * @swagger
 * /api/filieres/{id}:
 *   get:
 *     summary: Récupère une filière par ID
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la filière
 *     responses:
 *       200:
 *         description: Détails de la filière
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filiere:
 *                   $ref: '#/components/schemas/Filiere'
 *       404:
 *         description: Filière introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("departments.read"), [param("id").isString().trim()],
    handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/filieres:
 *   post:
 *     summary: Crée une nouvelle filière
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFiliere'
 *     responses:
 *       201:
 *         description: Filière créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Filière créée"
 *                 filiere:
 *                   $ref: '#/components/schemas/Filiere'
 *       400:
 *         description: Erreurs de validation ou département introuvable
 *       409:
 *         description: Filière du même nom déjà existante dans le département
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    requireAuth,
    requirePermission("departments.manage"), [
        body("departmentId").isString().notEmpty().trim(),
        body("name").isString().trim().notEmpty(),
        body("code").optional().isString().trim(),
        body("description").optional().isString().trim(),
        body("level").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/filieres/{id}:
 *   put:
 *     summary: Met à jour une filière
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la filière
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFiliere'
 *     responses:
 *       200:
 *         description: Filière mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Filière mise à jour"
 *                 filiere:
 *                   $ref: '#/components/schemas/Filiere'
 *       404:
 *         description: Filière introuvable
 *       409:
 *         description: Conflit de nom dans le même département
 *       500:
 *         description: Erreur serveur
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("departments.manage"), [
        param("id").isString().trim(),
        body("name").optional().isString().trim(),
        body("code").optional().isString().trim(),
        body("description").optional().isString().trim(),
        body("level").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/filieres/{id}:
 *   delete:
 *     summary: Supprime une filière
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la filière
 *     responses:
 *       200:
 *         description: Filière supprimée
 *       404:
 *         description: Filière introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("departments.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.delete
);




/**
 * @swagger
 * /api/filieres/stats:
 *   get:
 *     summary: Statistiques des filières
 *     tags: [Filieres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de département
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'organisation
 *     responses:
 *       200:
 *         description: Statistiques par niveau
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byLevel:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: string
 *                       count:
 *                         type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("departments.read"), [
        query("departmentId").optional().isString().trim(),
        query("organizationId").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.stats
);

module.exports = router;