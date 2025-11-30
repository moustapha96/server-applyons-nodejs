/**
 * Script d'export de la base de données
 * Exporte toutes les données dans un fichier JSON pour migration vers la production
 * 
 * Usage: node scripts/export-database.js [output-file]
 * 
 * Variables d'environnement:
 * - DATABASE_URL: URL de connexion à la base source (par défaut: .env)
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Ordre d'export (important pour l'import)
const EXPORT_ORDER = [
    'permissions',
    'organizations',
    'users',
    'departments',
    'filieres',
    'organizationInvites',
    'demandePartages',
    'documentPartages',
    'blockchainBlocks',
    'abonnements',
    'transactions',
    'payments',
    'contactMessages',
    'configurations',
    'siteSettings',
    'auditLogs',
];

async function exportDatabase(outputFile) {
    console.log("📤 Export de la base de données...");
    console.log(`📁 Fichier de sortie: ${outputFile}`);

    try {
        const timestamp = new Date().toISOString();
        const backup = {
            metadata: {
                timestamp,
                version: "1.0",
                exportedAt: new Date().toISOString(),
            },
            data: {},
        };

        // Export dans l'ordre défini
        for (const modelName of EXPORT_ORDER) {
            try {
                console.log(`📊 Export de ${modelName}...`);
                
                let data = [];
                switch (modelName) {
                    case 'permissions':
                        data = await prisma.permission.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'organizations':
                        data = await prisma.organization.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'users':
                        data = await prisma.user.findMany({
                            include: {
                                permissions: {
                                    select: { id: true, key: true }
                                }
                            },
                            orderBy: { createdAt: 'asc' }
                        });
                        // Sérialiser les relations permissions
                        data = data.map(user => ({
                            ...user,
                            permissionKeys: user.permissions.map(p => p.key),
                            permissions: undefined // Retirer l'objet relation
                        }));
                        break;
                    case 'departments':
                        data = await prisma.department.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'filieres':
                        data = await prisma.filiere.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'organizationInvites':
                        data = await prisma.organizationInvite.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'demandePartages':
                        data = await prisma.demandePartage.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'documentPartages':
                        data = await prisma.documentPartage.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'blockchainBlocks':
                        data = await prisma.blockchainBlock.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'abonnements':
                        data = await prisma.abonnement.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'transactions':
                        data = await prisma.transaction.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'payments':
                        data = await prisma.payment.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'contactMessages':
                        data = await prisma.contactMessage.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'configurations':
                        data = await prisma.configuration.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'siteSettings':
                        data = await prisma.siteSettings.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                    case 'auditLogs':
                        data = await prisma.auditLog.findMany({
                            orderBy: { createdAt: 'asc' }
                        });
                        break;
                }

                backup.data[modelName] = data;
                console.log(`  ✅ ${data.length} enregistrements exportés`);
            } catch (error) {
                console.error(`  ❌ Erreur lors de l'export de ${modelName}:`, error.message);
                backup.data[modelName] = [];
            }
        }

        // Créer le dossier si nécessaire
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Écrire le fichier JSON
        fs.writeFileSync(outputFile, JSON.stringify(backup, null, 2), 'utf8');

        // Statistiques
        const stats = {};
        let total = 0;
        for (const [key, value] of Object.entries(backup.data)) {
            stats[key] = value.length;
            total += value.length;
        }

        console.log("\n✅ Export terminé avec succès!");
        console.log(`📊 Statistiques:`);
        for (const [key, count] of Object.entries(stats)) {
            console.log(`   ${key}: ${count}`);
        }
        console.log(`\n📦 Total: ${total} enregistrements`);
        console.log(`💾 Fichier: ${outputFile}`);
        console.log(`\n💡 Pour importer dans la production, utilisez:`);
        console.log(`   node scripts/import-database.js ${outputFile}`);

    } catch (error) {
        console.error("❌ Erreur lors de l'export:", error);
        throw error;
    }
}

// Point d'entrée
const outputFile = process.argv[2] || path.join(__dirname, 'exports', `export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

exportDatabase(outputFile)
    .catch((e) => {
        console.error("❌ Export échoué:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

