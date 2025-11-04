// // controllers/contact.controller.js
// const { PrismaClient, Prisma } = require("@prisma/client");
// const { validationResult } = require("express-validator");
// const emailService = require("../services/email.service");
// const stringify = require("csv-stringify/sync").stringify;

// const prisma = new PrismaClient();

// const SORTABLE = new Set(["createdAt", "email", "name", "subject"]);
// const MAX_LIMIT = 100;

// const sanitizePagination = (q) => {
//     const page = Math.max(1, Number(q.page || 1));
//     const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 10)));
//     const skip = (page - 1) * limit;
//     const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "createdAt";
//     const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
//     return { page, limit, skip, sortBy, sortOrder };
// };

// // ============ LIST ============
// exports.list = async(req, res) => {
//     try {
//         const { email, search, dateFrom, dateTo } = req.query;
//         const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

//         const where = {};
//         if (email) where.email = { contains: String(email), mode: "insensitive" };
//         if (search) {
//             where.OR = [
//                 { name: { contains: String(search), mode: "insensitive" } },
//                 { subject: { contains: String(search), mode: "insensitive" } },
//                 { message: { contains: String(search), mode: "insensitive" } },
//             ];
//         }
//         if (dateFrom || dateTo) {
//             where.createdAt = {};
//             if (dateFrom) where.createdAt.gte = new Date(dateFrom);
//             if (dateTo) where.createdAt.lte = new Date(dateTo);
//         }

//         const [rows, total] = await Promise.all([
//             prisma.contactMessage.findMany({
//                 where,
//                 orderBy: {
//                     [sortBy]: sortOrder
//                 },
//                 skip,
//                 take: limit,
//             }),
//             prisma.contactMessage.count({ where }),
//         ]);

//         return res.status(200).json({
//             messages: rows,
//             pagination: { page, limit, total, pages: Math.ceil(total / limit) },
//             filters: { email: email || null, search: search || null, dateFrom: dateFrom || null, dateTo: dateTo || null, sortBy, sortOrder },
//         });
//     } catch (e) {
//         console.error("CONTACT_LIST_ERROR:", e);
//         return res.status(500).json({ message: "Échec récupération messages", code: "GET_CONTACTS_ERROR" });
//     }
// };

// // ============ GET BY ID ============
// exports.getById = async(req, res) => {
//     try {
//         const row = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
//         if (!row) return res.status(404).json({ message: "Message introuvable", code: "CONTACT_NOT_FOUND" });
//         return res.status(200).json({ message: row });
//     } catch (e) {
//         console.error("CONTACT_GET_ERROR:", e);
//         return res.status(500).json({ message: "Échec récupération message", code: "GET_CONTACT_ERROR" });
//     }
// };

// // ============ CREATE ============
// exports.create = async(req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty())
//             return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });

//         const { name, email, subject, message } = req.body || {};
//         const c = await prisma.contactMessage.create({
//             data: {
//                 name: String(name).trim(),
//                 email: String(email).trim().toLowerCase(),
//                 subject: subject ? String(subject).trim() : null,
//                 message: String(message).trim(),
//             },
//         });
//         // après la création du message c (prisma.contactMessage.create(...))
//         try {
//             await Promise.all([
//                 emailService.sendContactToAdmin(c), // vers l’admin/settings.contactEmail
//                 emailService.sendContactConfirmation(c), // vers l’expéditeur
//             ]);
//         } catch (e) {
//             console.warn("CONTACT_EMAIL_WARN:", e.message || e);
//         }

//         return res.status(201).json({ message: "Message enregistré", contact: c });
//     } catch (e) {
//         console.error("CONTACT_CREATE_ERROR:", e);
//         return res.status(500).json({ message: "Échec enregistrement message", code: "CREATE_CONTACT_ERROR" });
//     }
// };

// // ============ DELETE (hard) ============
// exports.remove = async(req, res) => {
//     try {
//         const { id } = req.params;
//         await prisma.contactMessage.delete({ where: { id } });
//         return res.status(200).json({ message: "Message supprimé" });
//     } catch (e) {
//         console.error("CONTACT_DELETE_ERROR:", e);
//         if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
//             return res.status(404).json({ message: "Message introuvable", code: "CONTACT_NOT_FOUND" });
//         }
//         return res.status(500).json({ message: "Échec suppression", code: "DELETE_CONTACT_ERROR" });
//     }
// };

// // ============ PURGE older than X days ============
// exports.purgeOlderThan = async(req, res) => {
//     try {
//         const days = Math.max(1, Number(req.query.days || 90));
//         const threshold = new Date(Date.now() - days * 24 * 3600 * 1000);
//         const result = await prisma.contactMessage.deleteMany({
//             where: { createdAt: { lt: threshold } },
//         });
//         return res.status(200).json({ message: "Purge effectuée", deleted: result.count, olderThanDays: days });
//     } catch (e) {
//         console.error("CONTACT_PURGE_ERROR:", e);
//         return res.status(500).json({ message: "Échec purge", code: "PURGE_CONTACT_ERROR" });
//     }
// };

// // ============ EXPORT CSV ============
// exports.exportCsv = async(req, res) => {
//     try {
//         // On réutilise les mêmes filtres que list()
//         const { email, search, dateFrom, dateTo } = req.query;

//         const where = {};
//         if (email) where.email = { contains: String(email), mode: "insensitive" };
//         if (search) {
//             where.OR = [
//                 { name: { contains: String(search), mode: "insensitive" } },
//                 { subject: { contains: String(search), mode: "insensitive" } },
//                 { message: { contains: String(search), mode: "insensitive" } },
//             ];
//         }
//         if (dateFrom || dateTo) {
//             where.createdAt = {};
//             if (dateFrom) where.createdAt.gte = new Date(dateFrom);
//             if (dateTo) where.createdAt.lte = new Date(dateTo);
//         }

//         const rows = await prisma.contactMessage.findMany({
//             where,
//             orderBy: { createdAt: "desc" },
//             select: { id: true, name: true, email: true, subject: true, message: true, createdAt: true },
//         });

//         const csv = stringify(rows.map(r => ({
//             id: r.id,
//             name: r.name,
//             email: r.email,
//             subject: r.subject || "",
//             message: r.message.replace(/\r?\n/g, " ").slice(0, 5000), // éviter les retours chars sauvages
//             createdAt: r.createdAt.toISOString(),
//         })), { header: true });

//         res.setHeader("Content-Type", "text/csv; charset=utf-8");
//         res.setHeader("Content-Disposition", `attachment; filename="contacts_export_${Date.now()}.csv"`);
//         return res.status(200).send(csv);
//     } catch (e) {
//         console.error("CONTACT_EXPORT_CSV_ERROR:", e);
//         return res.status(500).json({ message: "Échec export CSV", code: "EXPORT_CSV_ERROR" });
//     }
// };

// // ============ STATS (mensuel + domaines d'email) ============
// exports.stats = async(req, res) => {
//     try {
//         const [monthly, byDomain] = await Promise.all([
//             prisma.$queryRaw `
//         SELECT date_trunc('month', "createdAt") AS month, COUNT(*)::int AS total
//         FROM "ContactMessage"
//         GROUP BY month
//         ORDER BY month ASC
//       `,
//             prisma.$queryRaw `
//         SELECT split_part("email", '@', 2) AS domain, COUNT(*)::int AS total
//         FROM "ContactMessage"
//         GROUP BY domain
//         ORDER BY total DESC
//         LIMIT 20
//       `,
//         ]);

//         return res.status(200).json({
//             monthly: monthly.map((r) => ({ month: r.month, total: Number(r.total) })),
//             byDomain: byDomain.map((r) => ({ domain: r.domain || "(unknown)", total: Number(r.total) })),
//         });
//     } catch (e) {
//         console.error("CONTACT_STATS_ERROR:", e);
//         return res.status(500).json({ message: "Échec stats", code: "CONTACT_STATS_ERROR" });
//     }
// };


const { PrismaClient } = require("@prisma/client")
const { validationResult } = require("express-validator")
const { logAudit, createAuditLog } = require("../utils/audit")

const emailService = require("../services/email.service")
const prisma = new PrismaClient()

// Get all contacts with pagination and filtering
const getAllContacts = async(req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query
        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

        const where = {}
        if (status) {
            where.status = status
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { subject: { contains: search, mode: "insensitive" } },
            ]
        }

        const [contacts, total] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                skip,
                take: Number.parseInt(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.contactMessage.count({ where }),
        ])

        res.json({
            success: true,
            data: contacts,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                total,
                pages: Math.ceil(total / Number.parseInt(limit)),
            },
        })
    } catch (error) {
        console.error("Get contacts error:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching contacts",
            error: error.message,
        })
    }
}

// Create new contact (public endpoint)
const createContact = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            })
        }

        const { name, email, subject, message } = req.body

        const contact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        })

        // Send notification email to admin
        try {
            await sendEmail({
                to: process.env.ADMIN_EMAIL || "contact@applyons.com",
                subject: `New Contact Form Submission: ${subject}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
            })
        } catch (emailError) {
            console.error("Failed to send notification email:", emailError)
        }

        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully",
            data: contact,
        })
    } catch (error) {
        console.error("Create contact error:", error)
        res.status(500).json({
            success: false,
            message: "Error submitting contact form",
            error: error.message,
        })
    }
}

// Update contact status and add response
const updateContact = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            })
        }

        const { id } = req.params
        const { status, response } = req.body

        const contact = await prisma.contactMessage.findUnique({
            where: { id },
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            })
        }

        const updateData = {
            status,
            response,
            respondedBy: req.user.id,
            respondedAt: new Date(),
        }

        const updatedContact = await prisma.contactMessage.update({
            where: { id },
            data: updateData,
        })

        // Send response email if provided
        if (response && status === "RESOLVED") {
            try {
                await emailService.sendEmail({
                    to: contact.email,
                    subject: `Re: ${contact.subject}`,
                    html: `
            <h2>Response to your inquiry</h2>
            <p>Dear ${contact.name},</p>
            <p>Thank you for contacting us. Here is our response:</p>
            <p>${response.replace(/\n/g, "<br>")}</p>
            <p>Best regards,<br>Applyons</p>
          `,
                })
            } catch (emailError) {
                console.error("Failed to send response email:", emailError)
            }
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "UPDATE",
            resource: "Contact",
            resourceId: updateData.id,
            details: updateData,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });


        res.json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact,
        })
    } catch (error) {
        console.error("Update contact error:", error)
        res.status(500).json({
            success: false,
            message: "Error updating contact",
            error: error.message,
        })
    }
}

const updateContactStatus = async(req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            })
        }

        const { id } = req.params
        const { status } = req.body

        const contact = await prisma.contactMessage.findUnique({
            where: { id },
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            })
        }

        const updateData = {
            status
        }

        const updatedContact = await prisma.contactMessage.update({
            where: { id },
            data: updateData,
        })

        await createAuditLog({
            userId: res.locals.user.id,
            action: "UPDATE",
            resource: "Contact",
            resourceId: updatedContact.id,
            details: {
                status: updatedContact.status,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact,
        })
    } catch (error) {
        console.error("Update contact error:", error)
        res.status(500).json({
            success: false,
            message: "Error updating contact",
            error: error.message,
        })
    }
}

// Delete contact
const deleteContact = async(req, res) => {
    try {
        const { id } = req.params

        const contact = await prisma.contactMessage.findUnique({
            where: { id },
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            })
        }

        await prisma.contactMessage.delete({
            where: { id },
        })

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DELETE",
            resource: "Contact",
            resourceId: id,
            details: { subject: contact.subject },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.json({
            success: true,
            message: "Contact deleted successfully",
        })
    } catch (error) {
        console.error("Delete contact error:", error)
        res.status(500).json({
            success: false,
            message: "Error deleting contact",
            error: error.message,
        })
    }
}

const respondContact = async(req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        // Trouver le contact
        const contact = await prisma.contactMessage.findUnique({
            where: { id },
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        // Mettre à jour le contact
        const updateData = await prisma.contactMessage.update({
            where: { id },
            data: {
                respondedBy: res.locals.user.id,
                respondedAt: new Date(),
                response: message,
                status: "RESOLVED"
            },
        });

        // Envoyer l'email avec gestion du loader
        if (updateData) {
            try {
                await emailService.sendResponseEmail({
                    to: contact.email,
                    name: contact.name,
                    subject: `Re: ${contact.subject}`,
                    message: message
                });
            } catch (emailError) {
                console.error("Failed to send response email:", emailError);
            }
        }

        // Créer le log d'audit
        await createAuditLog({
            userId: res.locals.user.id,
            action: "RESPOND_CONTACT",
            resource: "Contact",
            resourceId: updateData.id,
            details: { status: "RESOLVED" },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // Répondre avec succès
        res.json({
            success: true,
            message: "Contact responded successfully",
        });

    } catch (error) {
        console.error("Respond contact error:", error);
        res.status(500).json({
            success: false,
            message: "Error responding to contact",
            error: error.message,
        });
    }
};

module.exports = {
    getAllContacts,
    createContact,
    updateContact,
    deleteContact,
    updateContactStatus,
    respondContact
}