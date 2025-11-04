// routes/department.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/department.controller");
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
    query("sortBy").optional().isIn(["name", "code", "createdAt", "updatedAt"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
];

const listValidators = [
    ...paginated,
    query("organizationId").optional().isString().trim(),
    query("search").optional().isString().trim(),
    // string pour compat Swagger; valeur par défaut gérée côté controller
    query("withOrg").optional().isIn(["true", "false"]),
];

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Gestion des départements
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Liste des départements
 *     description: Retourne une liste paginée et filtrable des départements.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, code, createdAt, updatedAt]
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'organisation
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche (nom, code, description)
 *       - in: query
 *         name: withOrg
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "true"
 *         description: Inclure les infos d'organisation dans la réponse
 *     responses:
 *       200:
 *         description: Liste des départements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentListResponse'
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    requireAuth,
    requirePermission("departments.read"),
    // listValidators,
    // handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Récupère un département par ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département
 *     responses:
 *       200:
 *         description: Détails du département
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentItemResponse'
 *       404:
 *         description: Département introuvable
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
 * /api/departments:
 *   post:
 *     summary: Crée un nouveau département
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartment'
 *     responses:
 *       201:
 *         description: Département créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentCreatedResponse'
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: Département déjà existant
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    requireAuth,
    requirePermission("departments.manage"), [
        body("organizationId").isString().notEmpty().trim(),
        body("name").isString().trim().notEmpty(),
        body("code").optional().isString().trim(),
        body("description").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Met à jour un département
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartment'
 *     responses:
 *       200:
 *         description: Département mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentUpdatedResponse'
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Département introuvable
 *       409:
 *         description: Conflit (ex. code déjà utilisé)
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
        body("organizationId").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Supprime un département
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département
 *     responses:
 *       200:
 *         description: Département supprimé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       404:
 *         description: Département introuvable
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
 * /api/departments/{id}/filieres:
 *   get:
 *     summary: Liste des filières d'un département
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, code, createdAt, updatedAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche (nom, code, description)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filtrer par niveau
 *     responses:
 *       200:
 *         description: Liste des filières
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiliereListResponse'
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id/filieres",
    requireAuth,
    requirePermission("departments.read"), [
        param("id").isString().trim(),
        ...paginated,
        query("search").optional().isString().trim(),
        query("level").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.listFilieres
);

/**
 * @swagger
 * /api/departments/{id}/filieres:
 *   post:
 *     summary: Crée une filière dans un département
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département
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
 *               $ref: '#/components/schemas/FiliereCreatedResponse'
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: Filière déjà existante
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/:id/filieres",
    requireAuth,
    requirePermission("departments.manage"), [
        param("id").isString().trim(),
        body("name").isString().trim().notEmpty(),
        body("code").optional().isString().trim(),
        body("description").optional().isString().trim(),
        body("level").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.createFiliere
);

/**
 * @swagger
 * /api/departments/export/csv:
 *   get:
 *     summary: Exporte les départements en CSV
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, code, createdAt, updatedAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fichier CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/export/csv",
    requireAuth,
    requirePermission("departments.read"),
    listValidators,
    handleValidation,
    ctrl.exportCsv
);

/**
 * @swagger
 * /api/departments/stats:
 *   get:
 *     summary: Statistiques des départements
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des départements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentStatsResponse'
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/stats",
    requireAuth,
    requirePermission("departments.read"),
    ctrl.stats
);

module.exports = router;