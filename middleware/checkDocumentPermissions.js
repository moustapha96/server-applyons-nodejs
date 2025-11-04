// middlewares/checkDocumentPermissions.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async(req, res, next) => {
    try {
        const { id } = req.params;
        const userId = res.locals.user.id;

        // 1. Récupérer le document
        const document = await prisma.documentPartage.findUnique({
            where: { id },
            include: {
                demandePartage: {
                    include: {
                        user: true,
                        targetOrg: true,
                        assignedOrg: true
                    }
                }
            }
        });

        if (!document) {
            return res.status(404).json({
                message: "Document introuvable",
                code: "DOCUMENT_NOT_FOUND"
            });
        }

        // 2. Récupérer les informations de l'utilisateur
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                organization: true,
                permissions: true
            }
        });

        if (!user) {
            return res.status(403).json({
                message: "Utilisateur non autorisé",
                code: "UNAUTHORIZED"
            });
        }

        // 3. Vérifier les permissions
        const hasPermission =
            // L'utilisateur est le demandeur original
            document.demandePartage.userId === userId ||
            // L'utilisateur appartient à l'organisation cible
            user.organizationId === document.demandePartage.targetOrgId ||
            // L'utilisateur appartient à l'organisation assignée
            user.organizationId === document.demandePartage.assignedOrgId ||
            // L'utilisateur est le propriétaire du document (organisation)
            user.organizationId === document.ownerOrgId ||
            // L'utilisateur a la permission explicite
            user.permissions.some(p => [
                "documents.read",
                "documents.manage",
                "documents.verify"
            ].includes(p.key));

        if (!hasPermission) {
            return res.status(403).json({
                message: "Accès refusé - permissions insuffisantes",
                code: "ACCESS_DENIED"
            });
        }

        // 4. Passer le document à la requête pour usage ultérieur
        res.locals.document = document;
        next();
    } catch (error) {
        console.error("PERMISSION_CHECK_ERROR:", error);
        res.status(500).json({
            message: "Échec vérification permissions",
            code: "PERMISSION_CHECK_ERROR"
        });
    }
};