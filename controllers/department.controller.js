// controllers/department.controller.js
const { PrismaClient, Prisma } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { stringify } = require("csv-stringify/sync");
const { createAuditLog } = require("../utils/audit");
const prisma = new PrismaClient();
const SORTABLE = new Set(["name", "code", "createdAt", "updatedAt"]);
const MAX_LIMIT = 100;

const sanitizePagination = (q) => {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 10)));
    const skip = (page - 1) * limit;
    const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "name";
    const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
    return { page, limit, skip, sortBy, sortOrder };
};

const shapeDepartment = (d, opts = {}) => {
    const base = {
        id: d.id,
        organizationId: d.organizationId,
        name: d.name,
        code: d.code,
        description: d.description,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        filiereCount: d._count.filieres || (typeof d.filiereCount === "number" ? d.filiereCount : undefined),
    };
    if (d.organization) {
        base.organization = {
            id: d.organization.id,
            name: d.organization.name,
            slug: d.organization.slug,
            type: d.organization.type,
        };
    }
    return base;
};

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const {
            organizationId,
            search,
            withOrganization = "true",
        } = req.query;

        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);

        const where = {};
        if (organizationId) where.organizationId = organizationId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { code: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const include = {
            organization: String(withOrganization) === "true",
            _count: { select: { filieres: true } },
        };

        const [rows, total] = await Promise.all([
            prisma.department.findMany({
                where,
                include,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.department.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_LISTED",
            resource: "departments",
            details: { organizationId, search, withOrganization },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            departments: rows.map(r =>
                shapeDepartment(r, {
                    withOrganization: include.organization,
                    withCounts: true,
                })
            ),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: {
                organizationId: organizationId || null,
                search: search || null,
                sortBy,
                sortOrder,
                withOrg: include.organization,
            },
        });
    } catch (e) {
        console.error("DEPT_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération départements", code: "GET_DEPTS_ERROR" });
    }
};
// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const d = await prisma.department.findUnique({
            where: { id: req.params.id },
            include: { organization: true, _count: { select: { filieres: true } } },
        });
        if (!d) {
            return res.status(404).json({ message: "Département introuvable", code: "DEPT_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_VIEWED",
            resource: "departments",
            resourceId: d.id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ department: shapeDepartment(d, { withOrg: true }) });
    } catch (e) {
        console.error("DEPT_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération département", code: "GET_DEPT_ERROR" });
    }
};

// ============ CREATE ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { organizationId, name, code, description } = req.body || {};

        // Vérifier l'organisation existe et n'est pas supprimée
        const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { id: true, deletedAt: true },
        });
        if (!org || org.deletedAt) {
            return res.status(400).json({ message: "Organisation invalide", code: "ORG_INVALID" });
        }

        // Le schéma a @@unique([organizationId, name]) => duplicata catch ci-dessous
        const created = await prisma.department.create({
            data: {
                organizationId,
                name: name.trim(),
                code: code.trim() || null,
                description: description.trim() || null,
            },
            include: { organization: true, _count: { select: { filieres: true } } },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_CREATED",
            resource: "departments",
            resourceId: created.id,
            details: { organizationId, name, code, description },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Département créé", department: shapeDepartment(created, { withOrg: true }) });
    } catch (e) {
        console.error("DEPT_CREATE_ERROR:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            // violation unique [organizationId, name]
            return res.status(409).json({ message: "Un département avec ce nom existe déjà dans cette organisation", code: "DEPT_DUPLICATE" });
        }
        res.status(500).json({ message: "Échec création département", code: "CREATE_DEPT_ERROR" });
    }
};

// ============ UPDATE ============
exports.update = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params;
        const patch = {};
        if (typeof req.body.name !== "undefined") patch.name = req.body.name.trim();
        if (typeof req.body.code !== "undefined") patch.code = req.body.code.trim() || null;
        if (typeof req.body.description !== "undefined") patch.description = req.body.description.trim() || null;
        if (typeof req.body.organizationId !== "undefined") patch.organizationId = req.body.organizationId;

        if (patch.organizationId) {
            const org = await prisma.organization.findUnique({
                where: { id: patch.organizationId },
                select: { id: true, deletedAt: true },
            });
            if (!org || org.deletedAt) {
                return res.status(400).json({ message: "Organisation invalide", code: "ORG_INVALID" });
            }
        }

        const updated = await prisma.department.update({
            where: { id },
            data: patch,
            include: { organization: true, _count: { select: { filieres: true } } },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_UPDATED",
            resource: "departments",
            resourceId: id,
            details: patch,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Département mis à jour", department: shapeDepartment(updated, { withOrg: true }) });
    } catch (e) {
        console.error("DEPT_UPDATE_ERROR:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return res.status(409).json({ message: "Un département avec ce nom existe déjà dans cette organisation", code: "DEPT_DUPLICATE" });
        }
        res.status(500).json({ message: "Échec mise à jour département", code: "UPDATE_DEPT_ERROR" });
    }
};

// ============ DELETE (hard) ============
exports.delete = async(req, res) => {
    try {
        const { id } = req.params;
        await prisma.department.delete({ where: { id } }); // cascade supprime les filières (schéma: onDelete: Cascade)

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_DELETED",
            resource: "departments",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Département supprimé" });
    } catch (e) {
        console.error("DEPT_DELETE_ERROR:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
            return res.status(404).json({ message: "Département introuvable", code: "DEPT_NOT_FOUND" });
        }
        res.status(500).json({ message: "Échec suppression département", code: "DELETE_DEPT_ERROR" });
    }
};

// ============ FILIÈRES PAR DÉPARTEMENT ============
exports.listFilieres = async(req, res) => {
    try {
        const { id } = req.params; // departmentId
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);
        const { search, level } = req.query;
        const where = { departmentId: id };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { code: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        if (level) where.level = { contains: level, mode: "insensitive" };
        const [rows, total] = await Promise.all([
            prisma.filiere.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true,
                    level: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.filiere.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERES_LISTED",
            resource: "filieres",
            resourceId: id,
            details: { search, level },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            filieres: rows,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, level: level || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("DEPT_LIST_FILIERES_ERROR:", e);
        res.status(500).json({ message: "Échec récupération filières", code: "GET_FILIERES_ERROR" });
    }
};

// ============ CREATE FILIÈRE ============
exports.createFiliere = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params; // departmentId
        const { name, code, description, level } = req.body || {};

        // @@unique([departmentId, name])
        const created = await prisma.filiere.create({
            data: {
                departmentId: id,
                name: name.trim(),
                code: code.trim() || null,
                description: description.trim() || null,
                level: level.trim() || null,
            },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_CREATED",
            resource: "filieres",
            resourceId: created.id,
            details: { departmentId: id, name, code, description, level },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Filière créée", filiere: created });
    } catch (e) {
        console.error("DEPT_CREATE_FILIERE_ERROR:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return res.status(409).json({ message: "Une filière avec ce nom existe déjà dans ce département", code: "FILIERE_DUPLICATE" });
        }
        res.status(500).json({ message: "Échec création filière", code: "CREATE_FILIERE_ERROR" });
    }
};

// ============ EXPORT CSV ============
exports.exportCsv = async(req, res) => {
    try {
        const { organizationId, search } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);
        const where = {};
        if (organizationId) where.organizationId = organizationId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { code: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const rows = await prisma.department.findMany({
            where,
            include: { organization: true, _count: { select: { filieres: true } } },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limit,
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENTS_EXPORTED",
            resource: "departments",
            details: { organizationId, search },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        const csv = stringify(
            rows.map((d) => ({
                id: d.id,
                name: d.name,
                code: d.code || "",
                organization: d.organization.name || "",
                filiereCount: d._count.filieres || 0,
                createdAt: d.createdAt.toISOString(),
                updatedAt: d.updatedAt.toISOString(),
            })), { header: true }
        );
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="departments_${Date.now()}.csv"`);
        res.status(200).send(csv);
    } catch (e) {
        console.error("DEPT_EXPORT_ERROR:", e);
        res.status(500).json({ message: "Échec export", code: "DEPT_EXPORT_ERROR" });
    }
};

// ============ STATS ============
exports.stats = async(req, res) => {
    try {
        const top = await prisma.$queryRaw `
      SELECT o.id as "organizationId", o.name, COUNT(d.*)::int as count
      FROM "Department" d
      JOIN "Organization" o ON o.id = d."organizationId"
      GROUP BY o.id, o.name
      ORDER BY count DESC
      LIMIT 20
    `;

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEPARTMENT_STATS_VIEWED",
            resource: "departments",
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            topOrganizations: top.map((r) => ({
                organizationId: r.organizationId,
                name: r.name,
                count: Number(r.count),
            })),
        });
    } catch (e) {
        console.error("DEPT_STATS_ERROR:", e);
        res.status(500).json({ message: "Échec stats", code: "DEPT_STATS_ERROR" });
    }
};