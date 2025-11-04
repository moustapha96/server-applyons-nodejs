// routes/auth.routes.js
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const ctrl = require("../controllers/auth.controller");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middlewares d’auth
const {
    checkUser, // si tu l'utilises en amont via app.use(checkUser)
    requireAuth,
    requirePermission,
} = require("../middleware/auth.middleware");

// Bloque les invités SI l’utilisateur est déjà connecté
const guestOnly = (req, res, next) => {
    if (res.locals.user) {
        res.locals.user = null;
        // return res
        //     .status(403)
        //     .json({ message: "Déjà connecté.", code: "ALREADY_AUTHENTICATED" });
    }
    return next();
};

// Centralise les erreurs de validation
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
    return next();
};

// Ensure upload directory exists
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);
        console.log(mimetype, extname);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});


// Validation rules
const registerValidation = [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),
    body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),
    body("role").optional().isIn(["ADMIN", "MEMBER", "GUEST"]).withMessage("Invalid role"),
]

const loginValidation = [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
]

const updateProfileValidation = [
    body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),
    body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),
]

const changePasswordValidation = [
        body("currentPassword").notEmpty().withMessage("Current password is required"),
        body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("New password must contain at least one lowercase letter, one uppercase letter, and one number"),
    ]
    /**
     * @swagger
     * tags:
     *   name: Auth
     *   description: Authentification et gestion des utilisateurs
     */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Inscription réussie" }
 *                 token:   { type: string }
 *                 requiresActivation: { type: boolean, example: true }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Erreurs de validation ou email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/register",
    // guestOnly, [
    //     body("username").optional().isString().trim(),
    //     body("email").isEmail().normalizeEmail(),
    //     body("password").isString().isLength({ min: 6 }),
    //     body("role")
    //     .optional()
    //     .isIn(["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"]),
    //     body("organizationId").optional().isString(),
    //     body("permissions").optional().isArray(),
    // ],
    handleValidation,
    ctrl.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *               password: { type: string, example: "secret123" }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Connexion réussie" }
 *                 token:   { type: string }
 *                 user:    { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Identifiants invalides
 *       403:
 *         description: Compte désactivé/archivé
 *       500:
 *         description: Erreur serveur
 */
router.post(
    "/login",
    guestOnly, [
        body("email").isEmail().normalizeEmail(),
        body("password").isString().notEmpty(),
    ],
    handleValidation,
    ctrl.login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401:
 *         description: Non authentifié
 */
router.post("/logout", requireAuth, ctrl.logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Non authentifié
 */
router.get("/profile", requireAuth, ctrl.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Profil mis à jour" }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Non authentifié
 */
router.put(
    "/profile",
    upload.single("avatar"),
    requireAuth,
    // [
    // body("username").optional().isString().trim(),
    // body("phone").optional().isString().trim(),
    // body("adress").optional().isString().trim(),
    // body("country").optional().isString().trim(),
    // body("gender").optional().isIn(["MALE", "FEMALE", "OTHER"]),
    // body("enabled").optional().isBoolean().toBoolean(),
    // body("firstName").optional().isString().trim(),
    // body("lastName").optional().isString().trim(),
    // ],
    handleValidation,
    ctrl.updateProfile
);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change le mot de passe de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, example: "oldPass123" }
 *               newPassword:     { type: string, example: "newPass456" }
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       400:
 *         description: Mot de passe actuel invalide
 *       401:
 *         description: Non authentifié
 */
router.post(
    "/change-password",
    requireAuth, [
        body("currentPassword").isString().notEmpty(),
        body("newPassword").isString().isLength({ min: 6 }),
    ],
    handleValidation,
    ctrl.changePassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Email envoyé si l'adresse existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 */
router.post(
    "/forgot-password",
    guestOnly, [body("email").isEmail().normalizeEmail()],
    // handleValidation,
    ctrl.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialise le mot de passe avec un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:       { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       400:
 *         description: Token invalide ou expiré
 */
router.post(
    "/reset-password",
    guestOnly, [
        body("token").isString().notEmpty(),
        body("newPassword").isString().isLength({ min: 6 }),
    ],
    handleValidation,
    ctrl.resetPassword
);

/**
 * @swagger
 * /api/auth/resend-activation:
 *   post:
 *     summary: Renvoie un lien d'activation
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lien renvoyé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401:
 *         description: Non authentifié
 */
router.post("/resend-activation", ctrl.resendActivation);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     summary: Vérifie le compte avec un token d'activation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Compte vérifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       400:
 *         description: Token invalide ou expiré
 */
router.post(
    "/verify-account",
    // guestOnly, [body("token").isString().notEmpty()],
    // handleValidation,
    ctrl.verifyAccount
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Rafraîchit le token d'authentification
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token rafraîchi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Token rafraîchi" }
 *                 token:   { type: string }
 *                 user:    { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Session invalide / Aucune session
 */
router.post("/refresh-token", ctrl.refreshToken);

/* ------------------------- Zone Admin ------------------------- */

/**
 * @swagger
 * /api/auth/admin/set-enabled:
 *   post:
 *     summary: Active/Désactive un utilisateur (admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, enabled]
 *             properties:
 *               userId: { type: string }
 *               enabled: { type: boolean }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Statut utilisateur mis à jour" }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 */
router.post(
    "/admin/set-enabled",
    requireAuth,
    requirePermission("users.manage"), [body("userId").isString().notEmpty(), body("enabled").isBoolean()],
    handleValidation,
    ctrl.adminSetEnabled
);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Déconnecte toutes les sessions de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions invalidées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnly'
 *       401:
 *         description: Non authentifié
 */
router.post("/logout-all", requireAuth, ctrl.logoutAllSessions);

/**
 * @swagger
 * /api/auth/admin/impersonate:
 *   post:
 *     summary: Permet à un admin d'emprunter l'identité d'un autre utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUserId]
 *             properties:
 *               targetUserId: { type: string }
 *     responses:
 *       200:
 *         description: Impersonation réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Impersonation réussie" }
 *                 token: { type: string }
 *                 user:  { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur cible introuvable
 */
router.post(
    "/admin/impersonate",
    requireAuth,
    requirePermission("users.impersonate"), [body("targetUserId").isString().notEmpty()],
    handleValidation,
    ctrl.impersonate
);


router.post("/create-with-organization", ctrl.createWithOrganization);


module.exports = router;