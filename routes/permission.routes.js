// routes/permission.routes.js
const router = require("express").Router();
const { body, query, param, validationResult } = require("express-validator");
const ctrl = require("../controllers/permission.controller");
const { requireAuth, requirePermission } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Gestion des permissions (droits d'accès)
 *
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         key:
 *           type: string
 *           example: "users.read"
 *         name:
 *           type: string
 *           example: "Lire les utilisateurs"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Autorise la lecture des utilisateurs"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreatePermission:
 *       type: object
 *       required:
 *         - key
 *         - name
 *       properties:
 *         key:
 *           type: string
 *           example: "users.read"
 *         name:
 *           type: string
 *           example: "Lire les utilisateurs"
 *         description:
 *           type: string
 *           nullable: true
 *     UpdatePermission:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *     PermissionListResponse:
 *       type: object
 *       properties:
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *         filters:
 *           type: object
 *           properties:
 *             search:
 *               type: string
 *             sortBy:
 *               type: string
 *             sortOrder:
 *               type: string
 *     MessageOnly:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/* -------------------------------------------
 * Helper validation
 * -----------------------------------------*/
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({
                message: "Erreurs de validation.",
                code: "VALIDATION_ERROR",
                errors: errors.array(),
            });
    }
    next();
};

/* -------------------------------------------
 * Routes
 * -----------------------------------------*/

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Liste des permissions
 *     description: Retourne une liste paginée et filtrable des permissions.
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Recherche texte (key, name)"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - updatedAt
 *             - key
 *             - name
 *         description: "Champ de tri"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionListResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/",
    requireAuth,
    requirePermission("permissions.read"), [
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("search").optional().isString().trim(),
        query("sortBy").optional().isIn(["createdAt", "updatedAt", "key", "name"]),
        query("sortOrder").optional().isIn(["asc", "desc"]),
    ],
    handleValidation,
    ctrl.list
);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Crée une permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermission'
 *     responses:
 *       201:
 *         description: Permission créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission créée"
 *                 permission:
 *                   $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       409:
 *         description: Clé déjà existante
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/",
    requireAuth,
    requirePermission("permissions.manage"), [
        body("key").isString().notEmpty().trim(),
        body("name").isString().notEmpty().trim(),
        body("description").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.create
);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Met à jour une permission
 *     tags: [Permissions]
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
 *             $ref: '#/components/schemas/UpdatePermission'
 *     responses:
 *       200:
 *         description: Permission mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission mise à jour"
 *                 permission:
 *                   $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Permission introuvable
 *       409:
 *         description: Conflit de clé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    "/:id",
    requireAuth,
    requirePermission("permissions.manage"), [
        param("id").isString().trim(),
        body("key").optional().isString().notEmpty().trim(),
        body("name").optional().isString().notEmpty().trim(),
        body("description").optional().isString().trim(),
    ],
    handleValidation,
    ctrl.update
);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Supprime une permission
 *     tags: [Permissions]
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
 *         description: Permission supprimée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Permission introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    "/:id",
    requireAuth,
    requirePermission("permissions.manage"), [param("id").isString().trim()],
    handleValidation,
    ctrl.delete
);

module.exports = router;