const router = require("express").Router();
const ctrl = require("../controllers/notification.controller");
const { query, param, validationResult } = require("express-validator");
const { requireAuth } = require("../middleware/auth.middleware");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Erreurs de validation.",
            code: "VALIDATION_ERROR",
            errors: errors.array(),
        });
    }
    next();
};

/**
 * Liste les notifications du user connecté (demandeur)
 * GET /api/notifications?unreadOnly=true&page=1&limit=20
 */
router.get(
    "/",
    requireAuth,
    [
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("unreadOnly").optional().isBoolean().toBoolean(),
    ],
    handleValidation,
    ctrl.listForCurrentUser
);

/**
 * Marquer toutes les notifications comme lues
 * PUT /api/notifications/read-all
 */
router.put(
    "/read-all",
    requireAuth,
    handleValidation,
    ctrl.markAllAsReadForCurrentUser
);

/**
 * Marquer une notification comme lue
 * PATCH /api/notifications/:id/read
 */
router.patch(
    "/:id/read",
    requireAuth,
    [param("id").isString().trim()],
    handleValidation,
    ctrl.markAsRead
);

/**
 * Marquer une notification comme lue (compat front)
 * PUT /api/notifications/:id
 */
router.put(
    "/:id",
    requireAuth,
    [param("id").isString().trim()],
    handleValidation,
    ctrl.markAsRead
);

module.exports = router;


