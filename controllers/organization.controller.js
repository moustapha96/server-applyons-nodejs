// controllers/organization.controller.js
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");

const prisma = new PrismaClient();
const SORTABLE = new Set(["createdAt", "updatedAt", "name", "slug", "type", "country"]);
const MAX_LIMIT = 100;

const slugify = (s) =>
    String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-|\-$/g, "");

const shape = (o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    type: o.type,
    email: o.email,
    phone: o.phone,
    address: o.address,
    website: o.website,
    country: o.country,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    deletedAt: o.deletedAt || null,
    counts: o._count ? {
        users: o._count.users || 0,
        departments: o._count.departments || 0,
        subscriptions: o._count.subscriptions || 0,
    } : undefined,
});
const serializeDemande = (d) => ({
    id: d.id,
    code: d.code,
    dateDemande: d.dateDemande,
    isDeleted: d.isDeleted,
    status: d.status || null,
    user: d.user ? { id: d.user.id, email: d.user.email, username: d.user.username } : null,
    targetOrg: d.targetOrg ? { id: d.targetOrg.id, name: d.targetOrg.name, slug: d.targetOrg.slug, type: d.targetOrg.type } : null,
    assignedOrg: d.assignedOrg ? { id: d.assignedOrg.id, name: d.assignedOrg.name, slug: d.assignedOrg.slug } : null,
    meta: {
        serie: d.serie,
        niveau: d.niveau,
        mention: d.mention,
        annee: d.annee,
        countryOfSchool: d.countryOfSchool,
        secondarySchoolName: d.secondarySchoolName,
        graduationDate: d.graduationDate,
    },
    documentsCount: d._count.documents || 0,
    transaction: d.transaction ? { id: d.transaction.id, statut: d.transaction.statut, montant: d.transaction.montant } : null,
});


const sanitizePagination = (q) => {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 10)));
    const skip = (page - 1) * limit;
    const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "createdAt";
    const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
    return { page, limit, skip, sortBy, sortOrder };
};

const sanitizeUserPagination = (q) => {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 10)));
    const skip = (page - 1) * limit;
    const rawSortBy = String(q.sortBy || "");
    // alias pratique
    const normalized = rawSortBy === "name" ? "username" : rawSortBy;
    const sortBy = "createdAt";
    const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
    return { page, limit, skip, sortBy, sortOrder };
};

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const {
            type,
            search,
            country,
            withDeleted = "false", // querystring
        } = req.query;

        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const where = {};
        if (String(withDeleted) !== "true") where.deletedAt = null;
        if (type) where.type = type;
        if (country) where.country = { contains: country, mode: "insensitive" };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { website: { contains: search, mode: "insensitive" } },
            ];
        }

        const [rows, total] = await Promise.all([
            prisma.organization.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
                include: { _count: { select: { users: true, departments: true, subscriptions: true } } },
            }),
            prisma.organization.count({ where }),
        ]);

        res.status(200).json({
            organizations: rows.map(shape),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: {
                type: type || null,
                search: search || null,
                country: country || null,
                sortBy,
                sortOrder,
                withDeleted: String(withDeleted) === "true",
            },
        });
    } catch (e) {
        console.error("GET_ORGS_ERROR:", e);
        res.status(500).json({ message: "Failed to list organizations", code: "GET_ORGS_ERROR" });
    }
};

// ============ GET BY ID ============
// exports.getById = async(req, res) => {
//     try {
//         const o = await prisma.organization.findUnique({
//             where: { id: req.params.id },
//             include: {
//                 users: true,
//                 departments: { orderBy: { name: "asc" }, include: { _count: { select: { filieres: true } } } },
//                 subscriptions: { orderBy: { createdAt: "desc" } },
//                 _count: { select: { users: true, departments: true, subscriptions: true } },
//             },
//         });
//         if (!o) return res.status(404).json({ message: "Organization not found", code: "ORG_NOT_FOUND" });

//         res.status(200).json({
//             organization: shape(o),
//             departments: o.departments,
//             subscriptions: o.subscriptions,
//         });
//     } catch (e) {
//         console.error("GET_ORG_ERROR:", e);
//         res.status(500).json({ message: "Failed to get organization", code: "GET_ORG_ERROR" });
//     }
// };

// ============ GET BY ID ============
// ➕ Renvoie aussi les users de l'organisation (avec pagination/filtre/sort facultatifs)
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;

        // Paramètres dédiés aux users du détail
        const {
            usersPage,
            usersLimit,
            usersSearch,
            usersRole,
            usersSortBy,
            usersSortOrder,
        } = req.query;

        // 1) Récup org + ses collections (comme avant)
        const o = await prisma.organization.findUnique({
            where: { id },
            include: {
                // On peut laisser users: true ici pour _count si besoin,
                // mais on va paginer les users via une requête séparée.
                departments: {
                    orderBy: { name: "asc" },
                    include: { _count: { select: { filieres: true } } },
                },
                subscriptions: { orderBy: { createdAt: "desc" } },
                _count: { select: { users: true, departments: true, subscriptions: true } },
            },
        });
        if (!o) return res.status(404).json({ message: "Organization not found", code: "ORG_NOT_FOUND" });

        // 2) Users de l'orga avec pagination/filtre/sort dédiés
        const {
            page: uPage,
            limit: uLimit,
            skip: uSkip,
            sortBy: uSortBy,
            sortOrder: uSortOrder,
        } = sanitizeUserPagination({
            page: usersPage,
            limit: usersLimit,
            sortBy: usersSortBy,
            sortOrder: usersSortOrder,
        });

        const usersWhere = {
            organizationId: id,
            ...(usersRole ? { role: usersRole } : {}),
            ...(usersSearch ? {
                OR: [
                    { email: { contains: usersSearch, mode: "insensitive" } },
                    { username: { contains: usersSearch, mode: "insensitive" } },
                    { phone: { contains: usersSearch, mode: "insensitive" } },
                ],
            } : {}),
        };

        const [usersItems, usersTotal] = await Promise.all([
            prisma.user.findMany({
                where: usersWhere,
                skip: uSkip,
                take: uLimit,
                orderBy: {
                    [uSortBy]: uSortOrder
                },

            }),
            prisma.user.count({ where: usersWhere }),
        ]);

        // 3) Réponse enrichie
        res.status(200).json({
            organization: shape(o),
            departments: o.departments,
            subscriptions: o.subscriptions,
            users: {
                items: usersItems,
                pagination: {
                    page: uPage,
                    limit: uLimit,
                    total: usersTotal,
                    pages: Math.ceil(usersTotal / uLimit),
                },
                filters: {
                    search: usersSearch || null,
                    role: usersRole || null,
                    sortBy: uSortBy,
                    sortOrder: uSortOrder,
                },
                // Optionnel mais pratique au front
                totalCountInOrg: o._count.users || usersTotal,
            },
        });
    } catch (e) {
        console.error("GET_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to get organization", code: "GET_ORG_ERROR" });
    }
};


// ============ CREATE ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: "Validation errors", errors: errors.array() });

        const data = {...req.body };
        if (typeof data.slug !== "undefined") data.slug = slugify(data.slug);
        else data.slug = slugify(data.name);

        // collision slug -> refuser
        const dupe = await prisma.organization.findUnique({ where: { slug: data.slug } });
        if (dupe) return res.status(400).json({ message: "Slug déjà utilisé", code: "SLUG_EXISTS" });

        const created = await prisma.organization.create({ data });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ORG_CREATED",
            resource: "organization",
            resourceId: created.id,
            details: data,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Organization created", organization: shape(created) });
    } catch (e) {
        console.error("CREATE_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to create organization", code: "CREATE_ORG_ERROR" });
    }
};

// ============ UPDATE ============
exports.update = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: "Validation errors", errors: errors.array() });

        const { id } = req.params;
        const data = {...req.body };

        if (typeof data.slug !== "undefined") {
            data.slug = slugify(data.slug);
            const dupe = await prisma.organization.findUnique({
                where: { slug: data.slug },
                select: { id: true },
            });
            if (dupe && dupe.id !== id)
                return res.status(400).json({ message: "Slug déjà utilisé", code: "SLUG_EXISTS" });
        }

        const up = await prisma.organization.update({
            where: { id },
            data,
            include: { _count: { select: { users: true, departments: true, subscriptions: true } } },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ORG_UPDATED",
            resource: "organization",
            resourceId: id,
            details: data,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Organization updated", organization: shape(up) });
    } catch (e) {
        console.error("UPDATE_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to update organization", code: "UPDATE_ORG_ERROR" });
    }
};

// ============ SOFT DELETE ============
exports.softDelete = async(req, res) => {
    try {
        const { id } = req.params;
        await prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ORG_SOFT_DELETED",
            resource: "organization",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Organization archived" });
    } catch (e) {
        console.error("DELETE_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to delete organization", code: "DELETE_ORG_ERROR" });
    }
};

// ============ RESTORE (undo soft delete) ============
exports.restore = async(req, res) => {
    try {
        const { id } = req.params;
        const up = await prisma.organization.update({
            where: { id },
            data: { deletedAt: null },
            include: { _count: { select: { users: true, departments: true, subscriptions: true } } },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ORG_RESTORED",
            resource: "organization",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Organization restored", organization: shape(up) });
    } catch (e) {
        console.error("RESTORE_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to restore organization", code: "RESTORE_ORG_ERROR" });
    }
};

// ============ HARD DELETE (danger) ============
exports.hardDelete = async(req, res) => {
    try {
        const { id } = req.params;

        // Optionnel: vérifier qu’elle est déjà archivée avant suppression définitive
        const org = await prisma.organization.findUnique({ where: { id }, select: { deletedAt: true } });
        if (!org) return res.status(404).json({ message: "Organization not found", code: "ORG_NOT_FOUND" });
        if (!org.deletedAt) return res.status(400).json({ message: "Archive first before hard delete", code: "ORG_NOT_ARCHIVED" });

        await prisma.organization.delete({ where: { id } });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "ORG_HARD_DELETED",
            resource: "organization",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Organization permanently deleted" });
    } catch (e) {
        console.error("HARD_DELETE_ORG_ERROR:", e);
        res.status(500).json({ message: "Failed to hard delete organization", code: "HARD_DELETE_ORG_ERROR" });
    }
};

// ============ CHECK / SUGGEST SLUG ============
exports.checkSlug = async(req, res) => {
    try {
        const base = slugify(req.query.slug || req.query.name || "");
        if (!base) return res.status(400).json({ message: "Missing slug or name", code: "MISSING_SLUG" });

        let slug = base;
        let i = 1;
        while (true) {
            const exists = await prisma.organization.findUnique({ where: { slug } });
            if (!exists) break;
            slug = `${base}-${i++}`;
        }
        res.status(200).json({ ok: slug === base, slug });
    } catch (e) {
        console.error("CHECK_SLUG_ERROR:", e);
        res.status(500).json({ message: "Failed to check slug", code: "CHECK_SLUG_ERROR" });
    }
};

// ============ USERS BY ORG (pagination + search) ============
exports.listUsersByOrg = async(req, res) => {
    try {
        const { id } = req.params; // orgId
        const { search, role } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const where = {
            organizationId: id,
            ...(role ? { role } : {}),
            ...(search ? {
                OR: [
                    { email: { contains: search, mode: "insensitive" } },
                    { username: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                ],
            } : {}),
        };

        const [items, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder
                }, // createdAt/updatedAt autorisés via SORTABLE (ci-dessus)
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    enabled: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        res.status(200).json({
            users: items,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, role: role || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("ORG_USERS_ERROR:", e);
        res.status(500).json({ message: "Failed to list organization users", code: "ORG_USERS_ERROR" });
    }
};

// ============ DEPARTMENTS BY ORG (pagination + search) ============
exports.listDepartmentsByOrg = async(req, res) => {
    try {
        const { id } = req.params; // orgId
        const { search } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const where = {
            organizationId: id,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            } : {}),
        };

        const [items, total] = await Promise.all([
            prisma.department.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder
                },
                include: { _count: { select: { filieres: true } } },
            }),
            prisma.department.count({ where }),
        ]);

        res.status(200).json({
            departments: items.map((d) => ({
                id: d.id,
                name: d.name,
                code: d.code,
                description: d.description,
                filiereCount: d._count.filieres || 0,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            })),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("ORG_DEPTS_ERROR:", e);
        res.status(500).json({ message: "Failed to list organization departments", code: "ORG_DEPTS_ERROR" });
    }
};

// ============ STATS (par type, par pays, growth mensuel) ============
exports.stats = async(req, res) => {
        try {
            const { withDeleted = "false" } = req.query;
            const where = String(withDeleted) === "true" ? {} : { deletedAt: null };

            const [byType, byCountry, monthly] = await Promise.all([
                        prisma.organization.groupBy({
                            by: ["type"],
                            where,
                            _count: { _all: true },
                        }),
                        prisma.organization.groupBy({
                            by: ["country"],
                            where: {...where, NOT: { country: null } },
                            _count: { _all: true },
                        }),
                        prisma.$queryRaw `
        SELECT date_trunc('month', "createdAt") AS month, COUNT(*)::int AS total
        FROM "Organization"
        WHERE ${String(withDeleted) === "true" ? Prisma.sql`` : Prisma.sql`"deletedAt" IS NULL`}
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    res.status(200).json({
      byType: byType.map((r) => ({ type: r.type, count: r._count._all })),
      byCountry: byCountry
        .map((r) => ({ country: r.country, count: r._count._all }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      monthly: monthly.map((r) => ({ month: r.month, total: Number(r.total) })),
    });
  } catch (e) {
    console.error("ORG_STATS_ERROR:", e);
    res.status(500).json({ message: "Failed to compute stats", code: "ORG_STATS_ERROR" });
  }
};


exports.listDemandesByOrg = async(req, res) => {
    try {
        const { id } = req.params; // orgId
        const { search } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const where = {
            targetOrgId: id,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            } : {}),
        };

        const [items, total] = await Promise.all([
            prisma.demandePartage.findMany({
                where,
                include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.demandePartage.count({ where }),
        ]);


        res.status(200).json({
            demandes: items.map(serializeDemande),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("ORG_DEMANDS_ERROR:", e);
        res.status(500).json({ message: "Failed to list organization demands", code: "ORG_DEMANDS_ERROR" });
    }
};