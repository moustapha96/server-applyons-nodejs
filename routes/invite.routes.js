// routes/invite.routes.js
const router = require("express").Router();
const { body, query, param } = require("express-validator");
const ctrl = require("../controllers/invite.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.get(
    "/",
    requireAuth, [
        query("page").optional().toInt(),
        query("limit").optional().toInt(),
        query("status").optional().isIn(["PENDING", "ACCEPTED", "EXPIRED", "CANCELED"]),
        query("inviterOrgId").optional().isString(),
        query("inviteeOrgId").optional().isString(),
        query("email").optional().isString(),
    ],
    ctrl.list
);

router.post(
    "/",
    requireAuth, [
        body("inviterOrgId").isString(),
        body("inviteeEmail").isEmail().normalizeEmail(),
        body("inviteeName").optional().isString(),
        body("inviteePhone").optional().isString(),
        body("inviteeAddress").optional().isString(),
        body("roleKey").optional().isString(),
        body("inviteeOrgId").optional().isString(),
    ],
    ctrl.create
);

router.post("/accept/:token", [param("token").isString()], ctrl.accept);

module.exports = router;