// // routes/contact.routes.js
// const router = require("express").Router();
// const ctrl = require("../controllers/contact.controller");
// const { query, body, param, validationResult } = require("express-validator");

// // Middlewares unifiés
// const { requireAuth, requirePermission } = require("../middleware/auth.middleware");

// /* -------------------------------------------
//  * Helper validation
//  * -----------------------------------------*/
// const handleValidation = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res
//             .status(400)
//             .json({ message: "Erreurs de validation.", code: "VALIDATION_ERROR", errors: errors.array() });
//     }
//     next();
// };

// // Validators communs
// const paginated = [
//     query("page").optional().isInt({ min: 1 }).toInt(),
//     query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
//     query("sortBy").optional().isString(),
//     query("sortOrder").optional().isIn(["asc", "desc"]),
// ];

// const listValidators = [
//     ...paginated,
//     query("email").optional().isString().trim(),
//     query("search").optional().isString().trim(),
//     query("dateFrom").optional().isISO8601(),
//     query("dateTo").optional().isISO8601(),
// ];

// /**
//  * @swagger
//  * tags:
//  *   name: ContactMessages
//  *   description: Gestion des messages de contact
//  */

// /**
//  * @swagger
//  * /api/contact-messages:
//  *   get:
//  *     summary: Liste des messages de contact
//  *     tags: [ContactMessages]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - $ref: '#/components/parameters/page'
//  *       - $ref: '#/components/parameters/limit'
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *         description: "Champ de tri (ex: createdAt)"
//  *       - in: query
//  *         name: sortOrder
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *         description: Ordre de tri
//  *       - in: query
//  *         name: email
//  *         schema:
//  *           type: string
//  *         description: Filtrer par email
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Recherche texte (name, subject, message)
//  *       - in: query
//  *         name: dateFrom
//  *         schema:
//  *           type: string
//  *           format: date-time
//  *         description: Date début (ISO)
//  *       - in: query
//  *         name: dateTo
//  *         schema:
//  *           type: string
//  *           format: date-time
//  *         description: Date fin (ISO)
//  *     responses:
//  *       200:
//  *         description: Liste des messages
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 messages:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/ContactMessage'
//  *                 pagination:
//  *                   $ref: '#/components/schemas/Pagination'
//  *                 filters:
//  *                   type: object
//  *                   properties:
//  *                     email:
//  *                       type: string
//  *                     search:
//  *                       type: string
//  *                     dateFrom:
//  *                       type: string
//  *                       format: date-time
//  *                     dateTo:
//  *                       type: string
//  *                       format: date-time
//  *                     sortBy:
//  *                       type: string
//  *                     sortOrder:
//  *                       type: string
//  *       500:
//  *         description: Erreur serveur
//  */

// router.get(
//     "/",
//     requireAuth,
//     requirePermission("contacts.read"),
//     ctrl.list
// );

// /**
//  * @swagger
//  * /api/contact-messages/{id}:
//  *   get:
//  *     summary: Récupère un message de contact par ID
//  *     tags: [ContactMessages]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID du message
//  *     responses:
//  *       200:
//  *         description: Détails du message
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   $ref: '#/components/schemas/ContactMessage'
//  *       404:
//  *         description: Message introuvable
//  *       500:
//  *         description: Erreur serveur
//  */
// router.get(
//     "/:id",
//     requireAuth,
//     requirePermission("contacts.read"),
//     ctrl.getById
// );

// /**
//  * @swagger
//  * /api/contact-messages:
//  *   post:
//  *     summary: Crée un message de contact (public)
//  *     tags: [ContactMessages]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateContactMessage'
//  *     responses:
//  *       201:
//  *         description: Message enregistré
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Message enregistré"
//  *                 item:
//  *                   $ref: '#/components/schemas/ContactMessage'
//  *       400:
//  *         description: Erreurs de validation
//  *       500:
//  *         description: Erreur serveur
//  */
// router.post(
//     "/", [
//         body("name").isString().trim().isLength({ min: 2 }),
//         body("email").isEmail().normalizeEmail(),
//         body("subject").optional().isString().trim(),
//         body("message").isString().trim().isLength({ min: 2 }),
//     ],
//     handleValidation,
//     ctrl.create
// );

// /**
//  * @swagger
//  * /api/contact-messages/{id}:
//  *   delete:
//  *     summary: Supprime définitivement un message
//  *     tags: [ContactMessages]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID du message
//  *     responses:
//  *       200:
//  *         description: Message supprimé
//  *       404:
//  *         description: Message introuvable
//  *       500:
//  *         description: Erreur serveur
//  */
// router.delete(
//     "/:id",
//     requireAuth,
//     requirePermission("messages_contact.manage"), [param("id").isString().trim()],
//     handleValidation,
//     ctrl.remove
// );

// /**
//  * @swagger
//  * /api/contact-messages:
//  *   delete:
//  *     summary: Purge les messages plus anciens que X jours
//  *     tags: [ContactMessages]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: days
//  *         schema:
//  *           type: integer
//  *           default: 30
//  *         description: Supprime les messages créés il y a plus de N jours
//  *     responses:
//  *       200:
//  *         description: Purge effectuée
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 deleted:
//  *                   type: integer
//  *       500:
//  *         description: Erreur serveur
//  */
// router.delete(
//     "/",
//     requireAuth,
//     requirePermission("messages_contact.manage"), [query("days").optional().isInt({ min: 1 }).toInt()],
//     handleValidation,
//     ctrl.purgeOlderThan
// );

// /**
//  * @swagger
//  * /api/contact-messages:
//  *   get:
//  *     summary: Liste des messages contact
//  *     tags: [Contact]
//  *     security: [ { bearerAuth: [] } ]
//  *     parameters:
//  *       - $ref: '#/components/parameters/page'
//  *       - $ref: '#/components/parameters/limit'
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *         description: "Champ de tri (ex: createdAt)"
//  *       - in: query
//  *         name: sortOrder
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *         description: Ordre de tri
//  *       - in: query
//  *         name: email
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: dateFrom
//  *         schema:
//  *           type: string
//  *           format: date
//  *       - in: query
//  *         name: dateTo
//  *         schema:
//  *           type: string
//  *           format: date
//  *     responses:
//  *       200:
//  *         description: OK
//  */

// router.get(
//     "/export/csv",
//     requireAuth,
//     requirePermission("messages_contact.read"),
//     listValidators,
//     handleValidation,
//     ctrl.exportCsv
// );

// /**
//  * @swagger
//  * /api/contact-messages/stats:
//  *   get:
//  *     summary: Statistiques des messages de contact
//  *     tags: [ContactMessages]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Statistiques
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 total:
//  *                   type: integer
//  *                 byMonth:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       month:
//  *                         type: string
//  *                       count:
//  *                         type: integer
//  *                 byEmailDomain:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       domain:
//  *                         type: string
//  *                       count:
//  *                         type: integer
//  *       500:
//  *         description: Erreur serveur
//  */
// router.get(
//     "/stats",
//     requireAuth,
//     requirePermission("messages_contact.read"), [],
//     handleValidation,
//     ctrl.stats
// );

// module.exports = router;

const router = require("express").Router()
const { body } = require("express-validator")

const contactController = require("../controllers/contact.controller")
const { requireAuth, requireRole } = require("../middleware/auth.middleware")
const { requirePermission } = require("../middleware/auth.middleware");


// Validation rules
const createContactValidation = [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("subject").trim().isLength({ min: 5, max: 200 }).withMessage("Subject must be between 5 and 200 characters"),
    body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be between 10 and 2000 characters"),
]

const updateContactValidation = [
    body("status").isIn(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]).withMessage("Invalid status"),
    body("response").optional().trim().isLength({ max: 2000 }).withMessage("Response must be less than 2000 characters"),
]

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         subject:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, CLOSED]
 *         response:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts (Admin/Moderator only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.get("/", requireAuth,
    requirePermission("contacts.read"),
    requireRole(["ADMIN", "SUPER_ADMIN"]),
    contactController.getAllContacts)

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact (public)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.post("/", createContactValidation, contactController.createContact)

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact (Admin/Moderator only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, RESOLVED, CLOSED]
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact not found
 */
router.put(
    "/:id",
    requireAuth,
    requireRole(["ADMIN", "SUPER_ADMIN"]),
    requirePermission("contacts.read"),
    updateContactValidation,
    contactController.updateContact,
)

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact not found
 */
router.delete("/:id",
    requireAuth,
    requirePermission("contacts.read"),
    requireRole(["ADMIN", "SUPER_ADMIN"]),
    contactController.deleteContact)


// update status

router.patch(
    "/:id/status",
    requireAuth,
    requireRole(["ADMIN", "SUPER_ADMIN"]),
    requirePermission("contacts.manage"),
    contactController.updateContactStatus,
)

router.put(
    "/:id/respond",
    requireAuth,
    requireRole(["ADMIN", "SUPER_ADMIN"]),
    requirePermission("contacts.manage"),
    contactController.respondContact,
)

module.exports = router