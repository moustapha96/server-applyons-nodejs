// routes/dashboard.routes.js
const router = require("express").Router();
const { query } = require("express-validator");
const ctrl = require("../controllers/dashboard.controller");
const { requirePermission, requireAuth } = require("../middleware/auth.middleware");


/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints liés au tableau de bord et à la supervision
 */


/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Récupérer les statistiques globales du dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: recentDays
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Fenêtre en jours pour calculer des métriques "récentes"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données de stats
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/stats",
    requireAuth,
    ctrl.getDashboardStats
);


/**
 * @swagger
 * /api/dashboard/system-notifications:
 *   get:
 *     summary: Notifications système (événements critiques)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type de notification (optionnel)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/system-notifications",
    requireAuth,
    ctrl.getSystemNotifications
);

// /**
//  * @swagger
//  * /api/dashboard/audit-logs/export/csv:
//  *   get:
//  *     summary: Exporter les logs d'audit en CSV (avec filtres)
//  *     tags: [Dashboard]
//  *     parameters:
//  *       - in: query
//  *         name: action
//  *         schema: { type: string }
//  *       - in: query
//  *         name: resource
//  *         schema: { type: string }
//  *       - in: query
//  *         name: userId
//  *         schema: { type: string }
//  *       - in: query
//  *         name: startDate
//  *         schema: { type: string, format: date-time }
//  *       - in: query
//  *         name: endDate
//  *         schema: { type: string, format: date-time }
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Fichier CSV
//  *       500:
//  *         description: Erreur serveur
//  */
// router.get(
//     "/audit-logs/export/csv",
//     requireAuth,
//     requirePermission("audit.read"),
//     ctrl.exportAuditLogsCsv
// );


/**
 * @swagger
 * /api/dashboard/audit-logs:
 *   get:
 *     summary: Liste paginée des logs d'audit
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, action, resource, userId] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: resource
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs d'audit paginés
 *       500:
 *         description: Erreur serveur
 */
router.get(
    "/audit-logs",
    requireAuth,
    requirePermission("audit.read"),
    ctrl.getAuditLogs
);


module.exports = router;