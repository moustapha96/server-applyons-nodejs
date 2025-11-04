// controllers/filiere.controller.js
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");
const prisma = new PrismaClient();

const shapeFiliere = (filiere, opts = {}) => {
    const base = {
        id: filiere.id,
        departmentId: filiere.departmentId,
        name: filiere.name,
        code: filiere.code,
        description: filiere.description,
        level: filiere.level,
        createdAt: filiere.createdAt,
        updatedAt: filiere.updatedAt,
    };

    if (opts.withDepartment && filiere.department) {
        base.department = {
            id: filiere.department.id,
            name: filiere.department.name,
            code: filiere.department.code,
            organizationId: filiere.department.organizationId,
            organization: filiere.department.organization
        };
    }

    return base;
};

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const { page = 1, limit = 10, departmentId, search, level, withDepartment = "true", withDepartmentOrg = "false" } = req.query;
        const where = {};
        if (departmentId) where.departmentId = departmentId;
        if (level) where.level = { contains: level, mode: "insensitive" };
        if (search) where.name = { contains: search, mode: "insensitive" };

        const skip = (Number(page) - 1) * Number(limit);

        const include = {
            department: String(withDepartment) === "true" ? { include: { organization: String(withDepartmentOrg) === "true" } } : false,
        };

        const [rows, total] = await Promise.all([
            prisma.filiere.findMany({
                where,
                include,
                orderBy: { name: "asc" },
                skip,
                take: Number(limit),
                include: {
                    department: {
                        include: {
                            organization: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    type: true,
                                    phone: true,
                                    address: true,
                                    website: true,
                                    country: true,
                                }
                            },
                        }
                    },
                },
            }),
            prisma.filiere.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERES_LISTED",
            resource: "filieres",
            details: { departmentId, search, level, withDepartment },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            filieres: rows.map((r) => shapeFiliere(r, { withDepartment: include.department })),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: { departmentId, search, level, withDepartment: include.department },
        });
    } catch (e) {
        console.error("FIL_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération filières", code: "GET_FILIERES_ERROR" });
    }
};

// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const filiere = await prisma.filiere.findUnique({
            where: { id },
            include: {
                department: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                type: true,
                                phone: true,
                                address: true,
                                website: true,
                                country: true,
                            }
                        },
                    }
                }
            },
        });

        if (!filiere) {
            return res.status(404).json({ message: "Filière introuvable", code: "FILIERE_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_VIEWED",
            resource: "filieres",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ filiere: shapeFiliere(filiere, { withDepartment: true }) });
    } catch (e) {
        console.error("FIL_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération filière", code: "GET_FILIERE_ERROR" });
    }
};

// ============ CREATE ============
exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { departmentId, name, code, description, level } = req.body || {};

        if (!departmentId || !name) {
            return res.status(400).json({ message: "departmentId et name requis", code: "MISSING_REQUIRED_FIELDS" });
        }

        // Vérifier que le département existe
        const department = await prisma.department.findUnique({
            where: { id: departmentId },
        });

        if (!department) {
            return res.status(400).json({ message: "Département introuvable", code: "DEPARTMENT_NOT_FOUND" });
        }

        // Vérifier qu'une filière avec le même nom n'existe pas déjà dans ce département
        const existingFiliere = await prisma.filiere.findFirst({
            where: {
                departmentId,
                name: name.trim(),
            },
        });

        if (existingFiliere) {
            return res.status(409).json({ message: "Une filière avec ce nom existe déjà dans ce département", code: "FILIERE_DUPLICATE" });
        }

        const created = await prisma.filiere.create({
            data: {
                departmentId,
                name: name.trim(),
                code: code.trim() || null,
                description: description.trim() || null,
                level: level.trim() || null,
            },
            include: { department: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_CREATED",
            resource: "filieres",
            resourceId: created.id,
            details: { departmentId, name, code, description, level },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Filière créée", filiere: shapeFiliere(created, { withDepartment: true }) });
    } catch (e) {
        console.error("FIL_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création filière", code: "CREATE_FILIERE_ERROR" });
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
        const { name, code, description, level } = req.body;

        const filiere = await prisma.filiere.findUnique({
            where: { id },
        });

        if (!filiere) {
            return res.status(404).json({ message: "Filière introuvable", code: "FILIERE_NOT_FOUND" });
        }

        // Vérifier qu'une autre filière avec le même nom n'existe pas déjà dans ce département
        if (name && name.trim() !== filiere.name) {
            const existingFiliere = await prisma.filiere.findFirst({
                where: {
                    departmentId: filiere.departmentId,
                    name: name.trim(),
                    id: { not: id },
                },
            });

            if (existingFiliere) {
                return res.status(409).json({ message: "Une filière avec ce nom existe déjà dans ce département", code: "FILIERE_DUPLICATE" });
            }
        }

        const updated = await prisma.filiere.update({
            where: { id },
            data: {
                name: name !== undefined ? name.trim() : undefined,
                code: code !== undefined ? code.trim() || null : undefined,
                description: description !== undefined ? description.trim() || null : undefined,
                level: level !== undefined ? level.trim() || null : undefined,
            },
            include: { department: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_UPDATED",
            resource: "filieres",
            resourceId: id,
            details: { name, code, description, level },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Filière mise à jour", filiere: shapeFiliere(updated, { withDepartment: true }) });
    } catch (e) {
        console.error("FIL_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour filière", code: "UPDATE_FILIERE_ERROR" });
    }
};

// ============ DELETE ============
exports.delete = async(req, res) => {
    try {
        const { id } = req.params;

        const filiere = await prisma.filiere.findUnique({
            where: { id },
        });

        if (!filiere) {
            return res.status(404).json({ message: "Filière introuvable", code: "FILIERE_NOT_FOUND" });
        }

        await prisma.filiere.delete({ where: { id } });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_DELETED",
            resource: "filieres",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Filière supprimée" });
    } catch (e) {
        console.error("FIL_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec suppression filière", code: "DELETE_FILIERE_ERROR" });
    }
};

// ============ LIST BY ORGANIZATION ============
exports.listByOrganization = async(req, res) => {

    try {
        const { organizationId, search, level, page = 1, limit = 10 } = req.query;

        if (!organizationId) {
            return res.status(400).json({ message: "organizationId requis", code: "MISSING_ORGANIZATION_ID" });
        }

        const where = {
            department: {
                organizationId,
            },
        };

        if (level) where.level = { contains: level, mode: "insensitive" };
        if (search) where.name = { contains: search, mode: "insensitive" };

        const skip = (Number(page) - 1) * Number(limit);

        const [rows, total] = await Promise.all([
            prisma.filiere.findMany({
                where,
                include: {
                    department: {
                        include: {
                            organization: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    type: true,
                                    phone: true,
                                    address: true,
                                    website: true,
                                    country: true,
                                }
                            },
                        },
                    },
                },
                orderBy: { name: "asc" },
                skip,
                take: Number(limit),
            }),
            prisma.filiere.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERES_BY_ORGANIZATION_LISTED",
            resource: "filieres",
            details: { organizationId, search, level },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            filieres: rows.map((f) => ({
                ...shapeFiliere(f, { withDepartment: true }),
                organization: f.department.organization ? {
                    id: f.department.organization.id,
                    name: f.department.organization.name,
                    slug: f.department.organization.slug,
                } : null,
            })),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: { organizationId, search, level },
        });
    } catch (e) {
        console.error("FIL_LIST_BY_ORG_ERROR:", e);
        res.status(500).json({ message: "Échec récupération filières par organisation", code: "GET_FILIERES_BY_ORG_ERROR" });
    }
};

// ============ STATS ============
exports.stats = async(req, res) => {
    try {
        const { departmentId, organizationId } = req.query;

        const where = {};
        if (departmentId) where.departmentId = departmentId;
        if (organizationId) where.department = { organizationId };

        // Statistiques par niveau
        const byLevel = await prisma.filiere.groupBy({
            by: ["level"],
            where,
            _count: { _all: true },
            orderBy: {
                _count: {
                    _all: "desc",
                },
            },
        });

        // Top 10 des filières avec le plus d'étudiants (si vous avez une table Étudiant liée)
        // const topFilieres = await prisma.$queryRaw`...`;

        await createAuditLog({
            userId: res.locals.user.id,
            action: "FILIERE_STATS_VIEWED",
            resource: "filieres",
            details: { departmentId, organizationId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            byLevel: byLevel.map((item) => ({
                level: item.level || "INCONNU",
                count: item._count._all,
            })),
            // topFilieres: topFilieres,
        });
    } catch (e) {
        console.error("FIL_STATS_ERROR:", e);
        res.status(500).json({ message: "Échec récupération statistiques", code: "GET_FILIERE_STATS_ERROR" });
    }
};