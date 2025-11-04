// controllers/invite.controller.js
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const prisma = new PrismaClient();

exports.list = async(req, res) => {
    try {
        const { page = 1, limit = 10, status, inviterOrgId, inviteeOrgId, email } = req.query;
        const where = {};
        if (status) where.status = status;
        if (inviterOrgId) where.inviterOrgId = inviterOrgId;
        if (inviteeOrgId) where.inviteeOrgId = inviteeOrgId;
        if (email) where.inviteeEmail = { contains: email, mode: "insensitive" };

        const skip = (Number(page) - 1) * Number(limit);
        const [rows, total] = await Promise.all([
            prisma.organizationInvite.findMany({
                where,
                include: { inviterOrg: true, inviteeOrg: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.organizationInvite.count({ where }),
        ]);

        return res.status(200).json({
            invites: rows,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
            filters: { status, inviterOrgId, inviteeOrgId, email },
        });
    } catch (e) {
        console.error("INV_LIST_ERROR:", e);
        return res.status(500).json({ message: "Échec récupération invitations", code: "GET_INVITES_ERROR" });
    }
};

exports.create = async(req, res) => {
    try {
        const { inviterOrgId, inviteeEmail, inviteeName, inviteePhone, inviteeAddress, roleKey, inviteeOrgId } = req.body || {};
        if (!inviterOrgId || !inviteeEmail) return res.status(400).json({ message: "inviterOrgId et inviteeEmail requis" });

        const token = crypto.randomBytes(16).toString("hex");
        const inv = await prisma.organizationInvite.create({
            data: {
                inviterOrgId,
                inviteeOrgId: inviteeOrgId || null,
                inviteeEmail: String(inviteeEmail).toLowerCase().trim(),
                inviteeName: inviteeName || null,
                inviteePhone: inviteePhone || null,
                inviteeAddress: inviteeAddress || null,
                roleKey: roleKey || null,
                status: "PENDING",
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            },
        });
        return res.status(201).json({ message: "Invitation créée", invite: inv });
    } catch (e) {
        console.error("INV_CREATE_ERROR:", e);
        return res.status(500).json({ message: "Échec création invitation", code: "CREATE_INVITE_ERROR" });
    }
};

exports.accept = async(req, res) => {
    try {
        const { token } = req.params;
        const inv = await prisma.organizationInvite.findFirst({ where: { token, status: "PENDING" } });
        if (!inv) return res.status(400).json({ message: "Invitation invalide", code: "INVALID_INVITE" });
        if (inv.expiresAt && inv.expiresAt < new Date()) return res.status(400).json({ message: "Invitation expirée", code: "INVITE_EXPIRED" });

        const up = await prisma.organizationInvite.update({
            where: { id: inv.id },
            data: { status: "ACCEPTED", acceptedAt: new Date() },
        });

        return res.status(200).json({ message: "Invitation acceptée", invite: up });
    } catch (e) {
        console.error("INV_ACCEPT_ERROR:", e);
        return res.status(500).json({ message: "Échec acceptation invitation", code: "ACCEPT_INVITE_ERROR" });
    }
};