const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Liste les notifications du demandeur connecté
 * Query params possibles:
 *  - unreadOnly=true pour ne récupérer que les non lues
 *  - limit, page pour la pagination
 */
exports.listForCurrentUser = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
        const skip = (page - 1) * limit;
        const unreadOnly = String(req.query.unreadOnly).toLowerCase() === "true";

        const where = { userId };
        if (unreadOnly) {
            where.readAt = null;
        }

        const [items, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: {
                    demandePartage: {
                        select: {
                            id: true,
                            code: true,
                            status: true,
                            dateDemande: true,
                        },
                    },
                    documentPartage: {
                        select: {
                            id: true,
                            type: true,
                            mention: true,
                            dateObtention: true,
                            estTraduit: true,
                            aDocument: true,
                            createdAt: true,
                        },
                    },
                },
            }),
            prisma.notification.count({ where }),
        ]);

        res.status(200).json({
            notifications: items,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (e) {
        console.error("NOTIFICATION_LIST_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération notifications",
            code: "NOTIFICATION_LIST_ERROR",
        });
    }
};

/**
 * Marque une notification comme lue
 */
exports.markAsRead = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { id } = req.params;

        const notif = await prisma.notification.findUnique({ where: { id } });
        if (!notif || notif.userId !== userId) {
            return res.status(404).json({
                message: "Notification introuvable",
                code: "NOTIFICATION_NOT_FOUND",
            });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { readAt: new Date() },
            include: {
                demandePartage: {
                    select: {
                        id: true,
                        code: true,
                        status: true,
                        dateDemande: true,
                    },
                },
                documentPartage: {
                    select: {
                        id: true,
                        type: true,
                        mention: true,
                        dateObtention: true,
                        estTraduit: true,
                        aDocument: true,
                        createdAt: true,
                    },
                },
            },
        });

        res.status(200).json({
            message: "Notification marquée comme lue",
            notification: updated,
        });
    } catch (e) {
        console.error("NOTIFICATION_MARK_READ_ERROR:", e);
        res.status(500).json({
            message: "Échec mise à jour notification",
            code: "NOTIFICATION_MARK_READ_ERROR",
        });
    }
};

/**
 * Marque toutes les notifications du user courant comme lues
 */
exports.markAllAsReadForCurrentUser = async (req, res) => {
    try {
        const userId = res.locals.user.id;

        const result = await prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });

        res.status(200).json({
            message: "Toutes les notifications ont été marquées comme lues",
            updatedCount: result.count,
        });
    } catch (e) {
        console.error("NOTIFICATION_MARK_ALL_READ_ERROR:", e);
        res.status(500).json({
            message: "Échec mise à jour des notifications",
            code: "NOTIFICATION_MARK_ALL_READ_ERROR",
        });
    }
};


