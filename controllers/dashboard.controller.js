// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// // 1. Récupérer les statistiques du dashboard
// const getDashboardStats = async(req, res) => {
//     try {
//         const [
//             totalUsers,
//             totalActivities,
//             totalEvents,
//             totalResources,
//             totalPartners,
//             totalContacts,
//             totalNews,
//             activeUsers,
//             draftActivities,
//             publishedActivities,
//             upcomingEvents,
//             pastEvents,
//             pendingContacts,
//             publishedNews,
//         ] = await Promise.all([
//             prisma.user.count(),
//             prisma.contact.count(),
//             prisma.user.count({ where: { status: "ACTIVE" } }),
//             prisma.contact.count({ where: { status: "PENDING" } }),
//         ]);

//         res.json({
//             success: true,
//             data: {
//                 users: {
//                     total: totalUsers,
//                     active: activeUsers,
//                 },
//                 activities: {
//                     total: totalActivities,
//                     draft: draftActivities,
//                     published: publishedActivities,
//                 },
//                 events: {
//                     total: totalEvents,
//                     upcoming: upcomingEvents,
//                     past: pastEvents,
//                 },
//                 resources: totalResources,
//                 partners: totalPartners,
//                 contacts: {
//                     total: totalContacts,
//                     pending: pendingContacts,
//                 },
//                 news: {
//                     total: totalNews,
//                     published: publishedNews,
//                 },
//             },
//         });
//     } catch (error) {
//         console.error("Get dashboard stats error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching dashboard stats",
//             error: error.message,
//         });
//     }
// };

// // 2. Récupérer les activités récentes
// const getRecentActivities = async(req, res) => {
//     try {
//         const { limit = 5 } = req.query;
//         const recentActivities = await prisma.activity.findMany({
//             take: parseInt(limit),
//             orderBy: { createdAt: "desc" },
//             include: {
//                 author: {
//                     select: {
//                         id: true,
//                         firstName: true,
//                         lastName: true,
//                         profilePic: true,
//                     },
//                 },
//             },
//         });
//         res.json({
//             success: true,
//             data: recentActivities,
//         });
//     } catch (error) {
//         console.error("Get recent activities error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching recent activities",
//             error: error.message,
//         });
//     }
// };

// // 3. Récupérer les notifications système
// const getSystemNotifications = async(req, res) => {
//     try {
//         const { limit = 10, type } = req.query;

//         // Exemple de notifications système (à adapter selon tes besoins)
//         const where = {};
//         if (type) {
//             where.type = type;
//         }

//         // Récupérer les notifications (exemple avec des logs d'audit critiques)
//         const notifications = await prisma.auditLog.findMany({
//             where: {
//                 OR: [
//                     { action: "DELETE" },
//                     { action: "UNAUTHORIZED_ACCESS_ATTEMPT" },
//                     { action: "PERMISSION_DENIED" },
//                 ],
//             },
//             take: parseInt(limit),
//             orderBy: { createdAt: "desc" },
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         firstName: true,
//                         lastName: true,
//                         email: true,
//                     },
//                 },
//             },
//         });

//         res.json({
//             success: true,
//             data: notifications.map((log) => ({
//                 id: log.id,
//                 type: "AUDIT",
//                 message: `${log.user?.firstName || "Unknown"} ${log.user?.lastName || ""} (${log.user?.email || "N/A"}) performed ${log.action} on ${log.resource}#${log.resourceId}`,
//                 details: log.details,
//                 createdAt: log.createdAt,
//             })),
//         });
//     } catch (error) {
//         console.error("Get system notifications error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching system notifications",
//             error: error.message,
//         });
//     }
// };

// // 4. Récupérer les logs d'audit
// const getAuditLogs = async(req, res) => {
//     try {
//         const { page = 1, limit = 10, action, resource, userId, startDate, endDate } = req.query;
//         const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

//         const where = {};
//         if (action) where.action = action;
//         if (resource) where.resource = resource;
//         if (userId) where.userId = userId;
//         if (startDate || endDate) {
//             where.createdAt = {};
//             if (startDate) where.createdAt.gte = new Date(startDate);
//             if (endDate) where.createdAt.lte = new Date(endDate);
//         }

//         const [auditLogs, total] = await Promise.all([
//             prisma.auditLog.findMany({
//                 where,
//                 skip,
//                 take: Number.parseInt(limit),
//                 orderBy: { createdAt: "desc" },
//                 include: {
//                     user: {
//                         select: {
//                             id: true,
//                             firstName: true,
//                             lastName: true,
//                             email: true,
//                         },
//                     },
//                 },
//             }),
//             prisma.auditLog.count({ where }),
//         ]);

//         res.json({
//             success: true,
//             data: auditLogs,
//             pagination: {
//                 page: Number.parseInt(page),
//                 limit: Number.parseInt(limit),
//                 total,
//                 pages: Math.ceil(total / Number.parseInt(limit)),
//             },
//         });
//     } catch (error) {
//         console.error("Get audit logs error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching audit logs",
//             error: error.message,
//         });
//     }
// };

// module.exports = {
//     getDashboardStats,
//     getRecentActivities,
//     getSystemNotifications,
//     getAuditLogs,
// };
/* controllers/dashboard.controller.js */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ---------------------------- Utils ---------------------------- */
const toInt = (v, def) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
};
const toDate = (v) => (v ? new Date(v) : undefined);

/**
 * Regroupe un groupBy({ by: ['status'], _count: { _all: true } }) en { status: count }
 */
const reduceGroupBy = (rows, key = "status") =>
    rows.reduce((acc, r) => {
        const k = (r[key] || "UNKNOWN");
        acc[k] = Number(r._count._all ? r._count : 0);
        return acc;
    }, {});

/* ----------------------- 1) Dashboard stats -------------------- */
const getDashboardStats = async(req, res) => {
    try {
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // ---- Users ----
        const [totalUsers, enabledUsers, usersByRole] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { enabled: true } }),
            prisma.user.groupBy({
                by: ["role"],
                _count: { _all: true },
            }),
        ]);

        // ---- Organizations ----
        const [totalOrgs, orgsByType] = await Promise.all([
            prisma.organization.count(),
            prisma.organization.groupBy({
                by: ["type"],
                _count: { _all: true },
            }),
        ]);

        // ---- Demandes ---- (status est String libre -> on regroupe tel quel)
        const [totalDemandes, demandesByStatus] = await Promise.all([
            prisma.demandePartage.count({ where: { isDeleted: false } }),
            prisma.demandePartage.groupBy({
                by: ["status"],
                where: { isDeleted: false },
                _count: { _all: true },
            }),
        ]);

        // ---- Documents ----
        const [totalDocs, translatedDocs] = await Promise.all([
            prisma.documentPartage.count({ where: { aDocument: true } }),
            prisma.documentPartage.count({ where: { aDocument: true, estTraduit: true } }),
        ]);

        // ---- Transactions ----
        const [totalTx, txByStatus] = await Promise.all([
            prisma.transaction.count({ where: { isDeleted: false } }),
            prisma.transaction.groupBy({
                by: ["statut"],
                where: { isDeleted: false },
                _count: { _all: true },
            }),
        ]);

        // ---- Payments ----
        const [totalPayments, paymentsByStatus] = await Promise.all([
            prisma.payment.count(),
            prisma.payment.groupBy({
                by: ["status"],
                _count: { _all: true },
            }),
        ]);

        // ---- Abonnements ----
        const [totalSubs, activeSubs, expiringSoonSubs] = await Promise.all([
            prisma.abonnement.count({ where: { isDeleted: false } }),
            prisma.abonnement.count({
                where: { isDeleted: false, dateDebut: { lte: now }, dateExpiration: { gte: now } },
            }),
            prisma.abonnement.count({
                where: {
                    isDeleted: false,
                    dateExpiration: { gte: now, lte: in30Days },
                },
            }),
        ]);

        // ---- Invites ----
        const [pendingInvites, acceptedInvites] = await Promise.all([
            prisma.organizationInvite.count({ where: { status: "PENDING" } }),
            prisma.organizationInvite.count({ where: { status: "ACCEPTED" } }),
        ]);

        // ---- Contacts / Blockchain ----
        const [totalContacts, totalBlocks] = await Promise.all([
            prisma.contactMessage.count(),
            prisma.blockchainBlock.count(),
        ]);

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    enabled: enabledUsers,
                    byRole: usersByRole.reduce((acc, r) => ({...acc, [r.role]: r._count._all }), {}),
                },
                organizations: {
                    total: totalOrgs,
                    byType: orgsByType.reduce((acc, r) => ({...acc, [r.type]: r._count._all }), {}),
                },
                demandes: {
                    total: totalDemandes,
                    byStatus: reduceGroupBy(demandesByStatus, "status"),
                },
                documents: {
                    total: totalDocs,
                    translated: translatedDocs,
                },
                transactions: {
                    total: totalTx,
                    byStatus: reduceGroupBy(txByStatus, "statut"),
                },
                payments: {
                    total: totalPayments,
                    byStatus: reduceGroupBy(paymentsByStatus, "status"),
                },
                abonnements: {
                    total: totalSubs,
                    active: activeSubs,
                    expiringSoon: expiringSoonSubs,
                },
                invites: {
                    pending: pendingInvites,
                    accepted: acceptedInvites,
                },
                contacts: { total: totalContacts },
                blockchain: { totalBlocks },
            },
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
            error: error.message,
        });
    }
};

/* -------------------- 2) Activités récentes -------------------- */
/**
 * Renvoie un mix d'événements récents utiles pour le dashboard :
 * - AuditLogs (toutes actions)
 * - Demandes créées
 * - Payments récents
 * - Transactions récentes
 */
const getRecentActivities = async(req, res) => {
        try {
            const limit = toInt(req.query.limit, 12);

            const [logs, demandes, payments, txs] = await Promise.all([
                prisma.auditLog.findMany({
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { id: true, firstName: true, lastName: true, email: true } },
                    },
                }),
                prisma.demandePartage.findMany({
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { id: true, firstName: true, lastName: true, email: true } },
                        targetOrg: { select: { id: true, name: true } },
                        assignedOrg: { select: { id: true, name: true } },
                    },
                }),
                prisma.payment.findMany({
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.transaction.findMany({
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { id: true, firstName: true, lastName: true, email: true } },
                        demandePartage: { select: { id: true, code: true } },
                    },
                }),
            ]);

            // Normalisation
            const items = [
                    ...logs.map((l) => ({
                                type: "AUDIT",
                                id: `audit_${l.id}`,
                                at: l.createdAt,
                                summary: `${l.action} on ${l.resource}${l.resourceId ? `#${l.resourceId}` : ""}`,
        actor: l.user
          ? `${l.user.firstName || ""} ${l.user.lastName || ""}`.trim() || l.user.email
          : "System",
        meta: { details: l.details, ip: l.ipAddress, ua: l.userAgent },
      })),
      ...demandes.map((d) => ({
        type: "DEMANDE",
        id: `dem_${d.id}`,
        at: d.createdAt,
        summary: `Nouvelle demande${d.code ? ` ${d.code}` : ""} (${d.status || "—"})`,
        actor: d.user ? `${d.user.firstName || ""} ${d.user.lastName || ""}`.trim() || d.user.email : "Unknown",
        meta: {
          targetOrg: d.targetOrg?.name,
          assignedOrg: d.assignedOrg?.name,
        },
      })),
      ...payments.map((p) => ({
        type: "PAYMENT",
        id: `pay_${p.id}`,
        at: p.createdAt,
        summary: `Paiement ${p.amount} ${p.currency} — ${p.status}`,
        actor: null,
        meta: { provider: p.provider, providerRef: p.providerRef, paymentType: p.paymentType },
      })),
      ...txs.map((t) => ({
        type: "TRANSACTION",
        id: `tx_${t.id}`,
        at: t.createdAt,
        summary: `Transaction ${t.montant} — ${t.statut}`,
        actor: t.user ? `${t.user.firstName || ""} ${t.user.lastName || ""}`.trim() || t.user.email : "Unknown",
        meta: { demandeCode: t.demandePartage?.code, type: t.typeTransaction },
      })),
    ];

    // Tri décroissant sur la date puis slice limit global
    items.sort((a, b) => new Date(b.at) - new Date(a.at));
    const result = items.slice(0, limit);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get recent activities error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent activities",
      error: error.message,
    });
  }
};

/* ---------------- 3) Notifications système (Audit) ------------- */
/**
 * On remonte des logs jugés « critiques ».
 * Adapte la liste des actions selon tes conventions d’écriture dans AuditLog.action.
 */
const getSystemNotifications = async (req, res) => {
  try {
    const limit = toInt(req.query.limit, 10);
    const type = req.query.type; // pas utilisé ici mais conservé pour future extension

    const CRITICAL_ACTIONS = [
      "DELETE",
      "UNAUTHORIZED_ACCESS_ATTEMPT",
      "PERMISSION_DENIED",
      "LOGIN_FAILED",
      "PAYMENT_FAILED",
      "TRANSACTION_FAILED",
    ];

    const notifications = await prisma.auditLog.findMany({
      where: { action: { in: CRITICAL_ACTIONS } },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.json({
      success: true,
      data: notifications.map((log) => ({
        id: log.id,
        type: "AUDIT",
        message: `${log.user?.firstName || "Unknown"} ${log.user?.lastName || ""} (${log.user?.email || "N/A"}) performed ${log.action} on ${log.resource}${log.resourceId ? `#${log.resourceId}` : ""}`,
        details: log.details,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get system notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching system notifications",
      error: error.message,
    });
  }
};

/* ---------------------- 4) Liste des audit logs ---------------- */
const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(100, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const { action, resource, userId, startDate, endDate } = req.query;

    const where = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = toDate(startDate);
      if (endDate) where.createdAt.lte = toDate(endDate);
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true , avatar: true} },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: auditLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching audit logs",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getSystemNotifications,
  getAuditLogs,
};