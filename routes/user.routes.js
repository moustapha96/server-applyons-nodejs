// routes/user.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
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
    query("sortBy").optional().isIn(["createdAt", "updatedAt", "email", "username", "enabled", "role"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
];

const listValidators = [
    ...paginated,
    query("search").optional().isString().trim(),
    query("role").optional().isIn(["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"]),
    query("enabled").optional().isBoolean().toBoolean(),
    query("organizationId").optional().isString().trim(),
    query("permissionKey").optional().isString().trim(),
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     description: Retourne une liste paginée et filtrable des utilisateurs.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche (email, username, phone, country)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [DEMANDEUR, INSTITUT, TRADUCTEUR, SUPERVISEUR, ADMIN]
 *       - in: query
 *         name: enabled
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *       - in: query
 *         name: permissionKey
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste paginée d'utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 filters:
 *                   type: object
 *                   additionalProperties: true
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    requireAuth,
    requirePermission("users.read"),
    listValidators,
    handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/:id",
    requireAuth,
    requirePermission("users.read"), [param("id").isString().trim()],
    handleValidation,
    ctrl.getById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreurs de validation
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    requireAuth,
    requirePermission("users.manage"),
    //  [
    //     body("username").optional().isString().trim(),
    //     body("email").isEmail().normalizeEmail(),
    //     body("password").optional().isString().isLength({ min: 6 }),
    //     body("role").optional().isIn(["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"]),
    //     body("enabled").optional().isBoolean().toBoolean(),
    //     body("organizationId").optional().isString().trim(),
    //     body("permissions").optional().isArray(),
    //     body("phone").optional().isString().trim(),
    //     body("adress").optional().isString().trim(),
    //     body("country").optional().isString().trim(),
    //     body("gender").optional().isIn(["MALE", "FEMALE", "OTHER"]),
    // ],
    // handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur mis à jour"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreurs de validation
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("users.manage"),
    // [
    //     param("id").isString().trim(),
    //     body("username").optional().isString().trim(),
    //     body("email").optional().isEmail().normalizeEmail(),
    //     body("role").optional().isIn(["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"]),
    //     body("enabled").optional().isBoolean().toBoolean(),
    //     body("organizationId").optional().isString().trim(),
    //     body("permissions").optional().isArray(),
    //     body("phone").optional().isString().trim(),
    //     body("adress").optional().isString().trim(),
    //     body("country").optional().isString().trim(),
    //     body("gender").optional().isIn(["MALE", "FEMALE", "OTHER"]),
    // ],
    // handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Réinitialise le mot de passe d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Mot de passe à définir (si ton contrôleur l'accepte)
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/password",
    requireAuth,
    requirePermission("users.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.resetPassword
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Archive un utilisateur (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur archivé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("users.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.archive
);

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restaure un utilisateur archivé
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur restauré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/restore",
    requireAuth,
    requirePermission("users.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.restore
);

/**
 * @swagger
 * /api/users/{id}/permissions:
 *   patch:
 *     summary: Met à jour les permissions d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissions]
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des clés de permission à affecter
 *     responses:
 *       200:
 *         description: Permissions mises à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permissions mises à jour"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreurs de validation
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
    "/:id/permissions",
    requireAuth,
    requirePermission("users.manage"), [param("id").isString().trim(), body("permissions").isArray()],
    handleValidation,
    ctrl.updatePermissions
);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Recherche des utilisateurs (auto-complétion)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme recherché
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/search",
    requireAuth,
    requirePermission("users.read"), [query("q").isString().notEmpty(), query("limit").optional().isInt({ min: 1, max: 50 }).toInt()],
    handleValidation,
    ctrl.search
);

router.post("/send-mail", ctrl.sendMailToUser);


module.exports = router;