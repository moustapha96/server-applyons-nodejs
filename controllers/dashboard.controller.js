// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// /* ---------------------------- Utils ---------------------------- */
// const toInt = (v, def) => {
//     const n = parseInt(v, 10);
//     return Number.isFinite(n) ? n : def;
// };
// const toDate = (v) => (v ? new Date(v) : undefined);

// /**
//  * Regroupe un groupBy({ by: ['status'], _count: { _all: true } }) en { status: count }
//  */
// const reduceGroupBy = (rows, key = "status") =>
//     rows.reduce((acc, r) => {
//         const k = (r[key] || "UNKNOWN");
//         acc[k] = Number(r._count._all ? r._count : 0);
//         return acc;
//     }, {});

// /* ----------------------- 1) Dashboard stats -------------------- */
// const getDashboardStats = async(req, res) => {
//     try {
//         const now = new Date();
//         const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

//         // ---- Users ----
//         const [totalUsers, enabledUsers, usersByRole] = await Promise.all([
//             prisma.user.count(),
//             prisma.user.count({ where: { enabled: true } }),
//             prisma.user.groupBy({
//                 by: ["role"],
//                 _count: { _all: true },
//             }),
//         ]);

//         // ---- Organizations ----
//         const [totalOrgs, orgsByType] = await Promise.all([
//             prisma.organization.count(),
//             prisma.organization.groupBy({
//                 by: ["type"],
//                 _count: { _all: true },
//             }),
//         ]);

//         // ---- Demandes ---- (status est String libre -> on regroupe tel quel)
//         const [totalDemandes, demandesByStatus] = await Promise.all([
//             prisma.demandePartage.count({ where: { isDeleted: false } }),
//             prisma.demandePartage.groupBy({
//                 by: ["status"],
//                 where: { isDeleted: false },
//                 _count: { _all: true },
//             }),
//         ]);

//         // ---- Documents ----
//         const [totalDocs, translatedDocs] = await Promise.all([
//             prisma.documentPartage.count({ where: { aDocument: true } }),
//             prisma.documentPartage.count({ where: { aDocument: true, estTraduit: true } }),
//         ]);

//         // ---- Transactions ----
//         const [totalTx, txByStatus] = await Promise.all([
//             prisma.transaction.count({ where: { isDeleted: false } }),
//             prisma.transaction.groupBy({
//                 by: ["statut"],
//                 where: { isDeleted: false },
//                 _count: { _all: true },
//             }),
//         ]);

//         // ---- Payments ----
//         const [totalPayments, paymentsByStatus] = await Promise.all([
//             prisma.payment.count(),
//             prisma.payment.groupBy({
//                 by: ["status"],
//                 _count: { _all: true },
//             }),
//         ]);

//         // ---- Abonnements ----
//         const [totalSubs, activeSubs, expiringSoonSubs] = await Promise.all([
//             prisma.abonnement.count({ where: { isDeleted: false } }),
//             prisma.abonnement.count({
//                 where: { isDeleted: false, dateDebut: { lte: now }, dateExpiration: { gte: now } },
//             }),
//             prisma.abonnement.count({
//                 where: {
//                     isDeleted: false,
//                     dateExpiration: { gte: now, lte: in30Days },
//                 },
//             }),
//         ]);

//         // ---- Invites ----
//         const [pendingInvites, acceptedInvites] = await Promise.all([
//             prisma.organizationInvite.count({ where: { status: "PENDING" } }),
//             prisma.organizationInvite.count({ where: { status: "ACCEPTED" } }),
//         ]);

//         // ---- Contacts / Blockchain ----
//         const [totalContacts, totalBlocks] = await Promise.all([
//             prisma.contactMessage.count(),
//             prisma.blockchainBlock.count(),
//         ]);

//         res.json({
//             success: true,
//             data: {
//                 users: {
//                     total: totalUsers,
//                     enabled: enabledUsers,
//                     byRole: usersByRole.reduce((acc, r) => ({...acc, [r.role]: r._count._all }), {}),
//                 },
//                 organizations: {
//                     total: totalOrgs,
//                     byType: orgsByType.reduce((acc, r) => ({...acc, [r.type]: r._count._all }), {}),
//                 },
//                 demandes: {
//                     total: totalDemandes,
//                     byStatus: reduceGroupBy(demandesByStatus, "status"),
//                 },
//                 documents: {
//                     total: totalDocs,
//                     translated: translatedDocs,
//                 },
//                 transactions: {
//                     total: totalTx,
//                     byStatus: reduceGroupBy(txByStatus, "statut"),
//                 },
//                 payments: {
//                     total: totalPayments,
//                     byStatus: reduceGroupBy(paymentsByStatus, "status"),
//                 },
//                 abonnements: {
//                     total: totalSubs,
//                     active: activeSubs,
//                     expiringSoon: expiringSoonSubs,
//                 },
//                 invites: {
//                     pending: pendingInvites,
//                     accepted: acceptedInvites,
//                 },
//                 contacts: { total: totalContacts },
//                 blockchain: { totalBlocks },
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

// /* -------------------- 2) Activités récentes -------------------- */
// /**
//  * Renvoie un mix d'événements récents utiles pour le dashboard :
//  * - AuditLogs (toutes actions)
//  * - Demandes créées
//  * - Payments récents
//  * - Transactions récentes
//  */
// const getRecentActivities = async(req, res) => {
//         try {
//             const limit = toInt(req.query.limit, 12);

//             const [logs, demandes, payments, txs] = await Promise.all([
//                 prisma.auditLog.findMany({
//                     take: limit,
//                     orderBy: { createdAt: "desc" },
//                     include: {
//                         user: { select: { id: true, firstName: true, lastName: true, email: true } },
//                     },
//                 }),
//                 prisma.demandePartage.findMany({
//                     take: limit,
//                     orderBy: { createdAt: "desc" },
//                     include: {
//                         user: { select: { id: true, firstName: true, lastName: true, email: true } },
//                         targetOrg: { select: { id: true, name: true } },
//                         assignedOrg: { select: { id: true, name: true } },
//                     },
//                 }),
//                 prisma.payment.findMany({
//                     take: limit,
//                     orderBy: { createdAt: "desc" },
//                 }),
//                 prisma.transaction.findMany({
//                     take: limit,
//                     orderBy: { createdAt: "desc" },
//                     include: {
//                         user: { select: { id: true, firstName: true, lastName: true, email: true } },
//                         demandePartage: { select: { id: true, code: true } },
//                     },
//                 }),
//             ]);

//             // Normalisation
//             const items = [
//                     ...logs.map((l) => ({
//                                 type: "AUDIT",
//                                 id: `audit_${l.id}`,
//                                 at: l.createdAt,
//                                 summary: `${l.action} on ${l.resource}${l.resourceId ? `#${l.resourceId}` : ""}`,
//         actor: l.user
//           ? `${l.user.firstName || ""} ${l.user.lastName || ""}`.trim() || l.user.email
//           : "System",
//         meta: { details: l.details, ip: l.ipAddress, ua: l.userAgent },
//       })),
//       ...demandes.map((d) => ({
//         type: "DEMANDE",
//         id: `dem_${d.id}`,
//         at: d.createdAt,
//         summary: `Nouvelle demande${d.code ? ` ${d.code}` : ""} (${d.status || "—"})`,
//         actor: d.user ? `${d.user.firstName || ""} ${d.user.lastName || ""}`.trim() || d.user.email : "Unknown",
//         meta: {
//           targetOrg: d.targetOrg?.name,
//           assignedOrg: d.assignedOrg?.name,
//         },
//       })),
//       ...payments.map((p) => ({
//         type: "PAYMENT",
//         id: `pay_${p.id}`,
//         at: p.createdAt,
//         summary: `Paiement ${p.amount} ${p.currency} — ${p.status}`,
//         actor: null,
//         meta: { provider: p.provider, providerRef: p.providerRef, paymentType: p.paymentType },
//       })),
//       ...txs.map((t) => ({
//         type: "TRANSACTION",
//         id: `tx_${t.id}`,
//         at: t.createdAt,
//         summary: `Transaction ${t.montant} — ${t.statut}`,
//         actor: t.user ? `${t.user.firstName || ""} ${t.user.lastName || ""}`.trim() || t.user.email : "Unknown",
//         meta: { demandeCode: t.demandePartage?.code, type: t.typeTransaction },
//       })),
//     ];

//     // Tri décroissant sur la date puis slice limit global
//     items.sort((a, b) => new Date(b.at) - new Date(a.at));
//     const result = items.slice(0, limit);

//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.error("Get recent activities error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching recent activities",
//       error: error.message,
//     });
//   }
// };

// /* ---------------- 3) Notifications système (Audit) ------------- */
// /**
//  * On remonte des logs jugés « critiques ».
//  * Adapte la liste des actions selon tes conventions d’écriture dans AuditLog.action.
//  */
// const getSystemNotifications = async (req, res) => {
//   try {
//     const limit = toInt(req.query.limit, 10);
//     const type = req.query.type; // pas utilisé ici mais conservé pour future extension

//     const CRITICAL_ACTIONS = [
//       "DELETE",
//       "UNAUTHORIZED_ACCESS_ATTEMPT",
//       "PERMISSION_DENIED",
//       "LOGIN_FAILED",
//       "PAYMENT_FAILED",
//       "TRANSACTION_FAILED",
//     ];

//     const notifications = await prisma.auditLog.findMany({
//       where: { action: { in: CRITICAL_ACTIONS } },
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: { select: { id: true, firstName: true, lastName: true, email: true } },
//       },
//     });

//     res.json({
//       success: true,
//       data: notifications.map((log) => ({
//         id: log.id,
//         type: "AUDIT",
//         message: `${log.user?.firstName || "Unknown"} ${log.user?.lastName || ""} (${log.user?.email || "N/A"}) performed ${log.action} on ${log.resource}${log.resourceId ? `#${log.resourceId}` : ""}`,
//         details: log.details,
//         createdAt: log.createdAt,
//       })),
//     });
//   } catch (error) {
//     console.error("Get system notifications error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching system notifications",
//       error: error.message,
//     });
//   }
// };

// /* ---------------------- 4) Liste des audit logs ---------------- */
// const getAuditLogs = async (req, res) => {
//   try {
//     const page = Math.max(1, toInt(req.query.page, 1));
//     const limit = Math.min(100, Math.max(1, toInt(req.query.limit, 10)));
//     const skip = (page - 1) * limit;

//     const { action, resource, userId, startDate, endDate } = req.query;

//     const where = {};
//     if (action) where.action = action;
//     if (resource) where.resource = resource;
//     if (userId) where.userId = userId;
//     if (startDate || endDate) {
//       where.createdAt = {};
//       if (startDate) where.createdAt.gte = toDate(startDate);
//       if (endDate) where.createdAt.lte = toDate(endDate);
//     }

//     const [auditLogs, total] = await Promise.all([
//       prisma.auditLog.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//         include: {
//           user: { select: { id: true, firstName: true, lastName: true, email: true , avatar: true} },
//         },
//       }),
//       prisma.auditLog.count({ where }),
//     ]);

//     res.json({
//       success: true,
//       data: auditLogs,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get audit logs error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching audit logs",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getDashboardStats,
//   getRecentActivities,
//   getSystemNotifications,
//   getAuditLogs,
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

/* ---------- Helpers ---------- */
const parseRecentDays = (q) => {
    const n = Number.parseInt(q || '', 10);
    return Number.isFinite(n) && n >= 0 ? n : 30;
};



/* ----------------------- 1) Dashboard stats -------------------- */
exports.getDashboardStats = async(req, res) => {
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





/* ---------------------- 4) Liste des audit logs ---------------- */
exports.getAuditLogs = async(req, res) => {
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
                    user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
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


/* ===========================================================
 * 1) DEMANDEUR
 * ===========================================================*/
exports.getDemandeurDashboardStats = async(req, res) => {
    try {
        const { userId } = req.params;

        const [
            myDemTotal,
            myDemByStatus,
            myDocsTotal,
            myDocsTranslated,
            myTxTotal,
            myTxByStatus,
            myPaymentsTotal,
            myPaymentsByStatus,
            allMyDemandes, // Renommé pour clarifier
            allMyPayments, // Renommé pour clarifier
        ] = await Promise.all([
            // Total des demandes non supprimées pour l'utilisateur
            prisma.demandePartage.count({ where: { isDeleted: false, userId } }),

            // Demandes regroupées par statut
            prisma.demandePartage.groupBy({
                by: ['status'],
                where: { isDeleted: false, userId },
                _count: { _all: true },
            }),

            // Total des documents liés aux demandes de l'utilisateur
            prisma.documentPartage.count({ where: { demandePartage: { userId } } }),

            // Total des documents traduits
            prisma.documentPartage.count({ where: { estTraduit: true, demandePartage: { userId } } }),

            // Total des transactions non supprimées pour l'utilisateur
            prisma.transaction.count({ where: { isDeleted: false, demandePartage: { userId } } }),

            // Transactions regroupées par statut
            prisma.transaction.groupBy({
                by: ['statut'],
                where: { isDeleted: false, demandePartage: { userId } },
                _count: { _all: true },
            }),

            // Total des paiements liés à l'utilisateur
            prisma.payment.count({
                where: {
                    OR: [{ demandePartage: { userId } }, { transaction: { userId } }],
                },
            }),

            // Paiements regroupés par statut
            prisma.payment.groupBy({
                by: ['status'],
                where: {
                    OR: [{ demandePartage: { userId } }, { transaction: { userId } }],
                },
                _count: { _all: true },
            }),

            // Toutes les demandes de l'utilisateur (sans filtre de date)
            prisma.demandePartage.findMany({
                where: { isDeleted: false, userId },
                select: { id: true, code: true, status: true, createdAt: true, targetOrgId: true },
                orderBy: { createdAt: 'desc' },
            }),

            // Tous les paiements liés à l'utilisateur (sans filtre de date)
            prisma.payment.findMany({
                where: {
                    OR: [{ demandePartage: { userId } }, { transaction: { userId } }],
                },
                select: { id: true, status: true, amount: true, currency: true, createdAt: true, provider: true },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        // Réponse JSON
        res.json({
            success: true,
            meta: { role: 'DEMANDEUR' }, // Suppression de recentWindowDays et now
            data: {
                widgets: {
                    myDemandes: { total: myDemTotal, byStatus: reduceGroupBy(myDemByStatus, 'status') },
                    myDocuments: { total: myDocsTotal, translated: myDocsTranslated },
                    myTransactions: { total: myTxTotal, byStatus: reduceGroupBy(myTxByStatus, 'statut') },
                    myPayments: { total: myPaymentsTotal, byStatus: reduceGroupBy(myPaymentsByStatus, 'status') },
                },
                tables: {
                    allDemandes: allMyDemandes, // Renommé pour clarifier
                    allPayments: allMyPayments, // Renommé pour clarifier
                },
                charts: {
                    demandesByStatus: reduceGroupBy(myDemByStatus, 'status'),
                    paymentsByStatus: reduceGroupBy(myPaymentsByStatus, 'status'),
                },
            },
        });
    } catch (error) {
        console.error('getDemandeurDashboardStats error:', error);
        res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
};

/* ===========================================================
 * 2) INSTITUT
 * ===========================================================*/
// controllers/dashboard.controller.js
exports.getInstitutDashboardStats = async(req, res) => {
    try {
        const { organizationId } = req.params;
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (!organizationId) {
            return res.json({
                success: true,
                meta: { role: 'INSTITUT', now: now.toISOString() },
                data: { warning: "Aucune organizationId fournie dans l'URL." },
            });
        }

        // Récupération de toutes les statistiques en parallèle
        const [
            // Demandes visant l'org
            totalTargetMe,
            targetMeByStatus,
            // Demandes assignées à l'org
            totalAssignedMe,
            assignedMeByStatus,
            // Documents propriété de l'org
            docsOwnedTotal,
            docsOwnedTranslated,
            // Abonnements de l'org
            orgSubsTotal,
            orgSubsActive,
            orgSubsExpiringSoon,
            // Paiements rattachés aux abonnements de l'org
            paymentsForOrg,
            // Dernières demandes reçues
            recentIncomingDemandes,
            // File d'attente de traduction (docs non traduits)
            queueToTranslate,
            // Utilisateurs de l'org
            orgUsersTotal,
            orgUsersByRole,
            // Départements de l'org
            orgDepartmentsTotal,
            orgDepartmentsList,
            // Filières de l'org
            orgFilieresTotal,
            orgFilieresList,
        ] = await Promise.all([
            // Demandes visant l'org
            prisma.demandePartage.count({ where: { isDeleted: false, targetOrgId: organizationId } }),
            prisma.demandePartage.groupBy({
                by: ['status'],
                where: { isDeleted: false, targetOrgId: organizationId },
                _count: { _all: true },
            }),
            // Demandes assignées à l'org
            prisma.demandePartage.count({ where: { isDeleted: false, assignedOrgId: organizationId } }),
            prisma.demandePartage.groupBy({
                by: ['status'],
                where: { isDeleted: false, assignedOrgId: organizationId },
                _count: { _all: true },
            }),
            // Documents propriété de l'org
            prisma.documentPartage.count({ where: { ownerOrgId: organizationId } }),
            prisma.documentPartage.count({ where: { ownerOrgId: organizationId, estTraduit: true } }),
            // Abonnements de l'org
            prisma.abonnement.count({ where: { isDeleted: false, organizationId } }),
            prisma.abonnement.count({
                where: { isDeleted: false, organizationId, dateDebut: { lte: now }, dateExpiration: { gte: now } },
            }),
            prisma.abonnement.count({
                where: { isDeleted: false, organizationId, dateExpiration: { gte: now, lte: in30Days } },
            }),
            // Paiements rattachés aux abonnements de l'org
            prisma.payment.groupBy({
                by: ['status'],
                where: { abonnement: { organizationId } },
                _count: { _all: true },
            }),
            // Dernières demandes reçues
            prisma.demandePartage.findMany({
                where: { isDeleted: false, targetOrgId: organizationId },
                select: { id: true, code: true, status: true, createdAt: true, userId: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            // File d'attente de traduction (docs non traduits)
            prisma.documentPartage.count({ where: { ownerOrgId: organizationId, estTraduit: false } }),
            // Utilisateurs de l'org
            prisma.user.count({ where: { organizationId } }),
            prisma.user.groupBy({
                by: ['role'],
                where: { organizationId },
                _count: { _all: true },
            }),
            // Départements de l'org
            prisma.department.count({ where: { organizationId } }),
            prisma.department.findMany({
                where: { organizationId },
                select: { id: true, name: true, code: true, description: true },
            }),
            // Filières de l'org
            prisma.filiere.count({ where: { department: { organizationId } } }),
            prisma.filiere.findMany({
                where: { department: { organizationId } },
                select: { id: true, name: true, code: true, level: true, department: { select: { name: true } } },
            }),
        ]);

        // Réduction des résultats groupBy en objets exploitables
        const reduceGroupBy = (grouped, keyField) => {
            return grouped.reduce((acc, r) => {
                const key = r[keyField] || 'UNKNOWN';
                return {...acc, [key]: r._count._all || 0 };
            }, {});
        };

        res.json({
            success: true,
            meta: {
                role: 'INSTITUT',
                organizationId,
                now: now.toISOString(),
            },
            data: {
                widgets: {
                    // Demandes
                    demandesTargetOrg: {
                        total: totalTargetMe,
                        byStatus: reduceGroupBy(targetMeByStatus, 'status'),
                    },
                    demandesAssignedOrg: {
                        total: totalAssignedMe,
                        byStatus: reduceGroupBy(assignedMeByStatus, 'status'),
                    },
                    // Documents
                    docsOwnedByOrg: {
                        total: docsOwnedTotal,
                        translated: docsOwnedTranslated,
                        toTranslate: queueToTranslate,
                    },
                    // Abonnements
                    subscriptions: {
                        total: orgSubsTotal,
                        active: orgSubsActive,
                        expiringSoon: orgSubsExpiringSoon,
                    },
                    // Utilisateurs
                    users: {
                        total: orgUsersTotal,
                        byRole: reduceGroupBy(orgUsersByRole, 'role'),
                    },
                    // Départements
                    departments: {
                        total: orgDepartmentsTotal,
                        list: orgDepartmentsList,
                    },
                    // Filières
                    filieres: {
                        total: orgFilieresTotal,
                        list: orgFilieresList,
                    },
                    // Paiements
                    payments: {
                        byStatus: reduceGroupBy(paymentsForOrg, 'status'),
                    },
                },
                tables: {
                    recentIncomingDemandes,
                },
                charts: {
                    targetVsAssigned: {
                        target: totalTargetMe,
                        assigned: totalAssignedMe,
                    },
                },
            },
        });
    } catch (error) {
        console.error('getInstitutDashboardStats error:', error);
        res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
};


/* ===========================================================
 * 3) TRADUCTEUR
 * ===========================================================*/
exports.getTraducteurDashboardStats = async(req, res) => {
    try {
        const userId = req.user.id;
        const windowDays = parseRecentDays(req.query.recentDays);
        const now = new Date();
        const since = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

        // Hypothèses (avec votre schéma actuel) :
        // - “Traduit par moi” = encryptedByTraduit === userId
        // - “À traduire (global)” = estTraduit === false
        // Si vous ajoutez assignedTranslatorId: filtrez dessus pour la file perso.
        const [
            doneByMe,
            recentDoneByMe,
            toTranslateGlobal,
            myVelocityRecent,
        ] = await Promise.all([
            prisma.documentPartage.count({ where: { estTraduit: true, encryptedByTraduit: userId } }),
            prisma.documentPartage.findMany({
                where: { estTraduit: true, encryptedByTraduit: userId, encryptedAtTraduit: { gte: since } },
                select: { id: true, type: true, mention: true, encryptedAtTraduit: true, ownerOrgId: true },
                orderBy: { encryptedAtTraduit: 'desc' },
                take: 15,
            }),
            prisma.documentPartage.count({ where: { estTraduit: false } }),
            prisma.documentPartage.count({
                where: { estTraduit: true, encryptedByTraduit: userId, encryptedAtTraduit: { gte: since } },
            }),
        ]);

        res.json({
            success: true,
            meta: { role: 'TRADUCTEUR', recentWindowDays: windowDays, now: now.toISOString() },
            data: {
                widgets: {
                    translatedByMe: doneByMe,
                    toTranslate: toTranslateGlobal, // si vous avez assignedTranslatorId => à remplacer par "à faire pour moi"
                    recentVelocity: myVelocityRecent,
                },
                tables: { recentMyTranslations: recentDoneByMe },
            },
        });
    } catch (error) {
        console.error('getTraducteurDashboardStats error:', error);
        res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
};