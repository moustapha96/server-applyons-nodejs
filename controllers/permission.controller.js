// controllers/permission.controller.js
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const SORTABLE = new Set(["createdAt", "updatedAt", "key", "name"]);
const MAX_LIMIT = 100;

/** Normalise page/limit/sort */
function readPagination(q) {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 20)));
    const skip = (page - 1) * limit;

    const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "name";
    const sortOrder = String(q.sortOrder).toLowerCase() === "desc" ? "desc" : "asc";

    return { page, limit, skip, sortBy, sortOrder };
}

exports.list = async(req, res) => {
    try {
        const { search } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = readPagination(req.query);

        const where = {};
        if (search) {
            where.OR = [
                { key: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const [rows, total] = await Promise.all([
            prisma.permission.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.permission.count({ where }),
        ]);

        return res.status(200).json({
            permissions: rows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            filters: {
                search: search || null,
                sortBy,
                sortOrder,
            },
        });
    } catch (e) {
        console.error("PERM_LIST_ERROR:", e);
        return res
            .status(500)
            .json({ message: "Échec récupération permissions", code: "GET_PERMS_ERROR" });
    }
};

exports.create = async(req, res) => {
    try {
        const key = (req.body.key || "").trim();
        const name = (req.body.name || "").trim();
        const description = req.body.description.trim() || null;

        if (!key || !name) {
            return res
                .status(400)
                .json({ message: "Champs requis manquants: key, name", code: "MISSING_FIELDS" });
        }

        // Vérif duplication
        const dupe = await prisma.permission.findUnique({ where: { key } });
        if (dupe) {
            return res
                .status(409)
                .json({ message: "Clé de permission déjà existante", code: "PERM_EXISTS" });
        }

        const created = await prisma.permission.create({
            data: { key, name, description },
        });

        return res
            .status(201)
            .json({ message: "Permission créée", permission: created });
    } catch (e) {
        console.error("PERM_CREATE_ERROR:", e);

        // Unique constraint
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return res
                .status(409)
                .json({ message: "Clé de permission déjà existante", code: "PERM_EXISTS" });
        }

        return res
            .status(500)
            .json({ message: "Échec création permission", code: "CREATE_PERM_ERROR" });
    }
};

exports.update = async(req, res) => {
    try {
        const { id } = req.params;

        // Si le client veut changer la clé, valider la non-duplication
        const newKey =
            typeof req.body.key === "string" ? req.body.key.trim() : undefined;

        if (newKey) {
            const existing = await prisma.permission.findUnique({ where: { key: newKey } });
            if (existing && existing.id !== id) {
                return res
                    .status(409)
                    .json({ message: "Clé de permission déjà existante", code: "PERM_EXISTS" });
            }
        }

        const patch = {
            key: newKey,
            name: typeof req.body.name === "string" ? req.body.name.trim() : undefined,
            description: typeof req.body.description === "string" ?
                req.body.description.trim() || null : undefined,
        };

        const updated = await prisma.permission.update({
            where: { id },
            data: patch,
        });

        return res
            .status(200)
            .json({ message: "Permission mise à jour", permission: updated });
    } catch (e) {
        console.error("PERM_UPDATE_ERROR:", e);

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Not found
            if (e.code === "P2025") {
                return res
                    .status(404)
                    .json({ message: "Permission introuvable", code: "PERM_NOT_FOUND" });
            }
            // Unique
            if (e.code === "P2002") {
                return res
                    .status(409)
                    .json({ message: "Clé de permission déjà existante", code: "PERM_EXISTS" });
            }
        }

        return res
            .status(500)
            .json({ message: "Échec mise à jour permission", code: "UPDATE_PERM_ERROR" });
    }
};

exports.delete = async(req, res) => {
    try {
        const { id } = req.params;

        await prisma.permission.delete({ where: { id } });

        return res.status(200).json({ message: "Permission supprimée" });
    } catch (e) {
        console.error("PERM_DELETE_ERROR:", e);

        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
            return res
                .status(404)
                .json({ message: "Permission introuvable", code: "PERM_NOT_FOUND" });
        }

        return res
            .status(500)
            .json({ message: "Échec suppression permission", code: "DELETE_PERM_ERROR" });
    }
};