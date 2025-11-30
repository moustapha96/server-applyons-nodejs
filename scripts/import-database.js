/**
 * Script d'import de la base de données
 * Importe les données depuis un fichier JSON vers la base de production
 * 
 * Usage: node scripts/import-database.js <export-file> [--dry-run] [--skip-audit]
 * 
 * Variables d'environnement:
 * - DATABASE_URL: URL de connexion à la base de destination (production)
 * 
 * Options:
 * --dry-run: Mode test (affiche ce qui serait importé sans modifier la base)
 * --skip-audit: Ignore les logs d'audit lors de l'import
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Ordre d'import (respecte les dépendances)
const IMPORT_ORDER = [
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

const args = process.argv.slice(2);
const exportFile = args.find(arg => !arg.startsWith('--'));
const isDryRun = args.includes('--dry-run');
const skipAudit = args.includes('--skip-audit');

if (!exportFile) {
    console.error("❌ Usage: node scripts/import-database.js <export-file> [--dry-run] [--skip-audit]");
    process.exit(1);
}

if (!fs.existsSync(exportFile)) {
    console.error(`❌ Fichier introuvable: ${exportFile}`);
    process.exit(1);
}

async function importDatabase(exportFile) {
    console.log("📥 Import de la base de données...");
    if (isDryRun) {
        console.log("🧪 MODE DRY-RUN (aucune modification ne sera effectuée)");
    }
    console.log(`📁 Fichier: ${exportFile}`);

    try {
        // Lire le fichier d'export
        const backup = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
        console.log(`📅 Export créé le: ${backup.metadata?.timestamp || 'Date inconnue'}`);

        if (!backup.data) {
            throw new Error("Format de fichier invalide: 'data' manquant");
        }

        const stats = {
            imported: {},
            skipped: {},
            errors: {},
        };

        // Import dans l'ordre défini
        for (const modelName of IMPORT_ORDER) {
            if (skipAudit && modelName === 'auditLogs') {
                console.log(`⏭️  Ignoré: ${modelName} (--skip-audit)`);
                continue;
            }

            const data = backup.data[modelName] || [];
            if (data.length === 0) {
                console.log(`⏭️  ${modelName}: aucun enregistrement à importer`);
                continue;
            }

            console.log(`\n📊 Import de ${modelName} (${data.length} enregistrements)...`);

            if (isDryRun) {
                console.log(`   🧪 DRY-RUN: ${data.length} enregistrements seraient importés`);
                stats.imported[modelName] = data.length;
                continue;
            }

            let imported = 0;
            let skipped = 0;
            let errors = 0;

            try {
                switch (modelName) {
                    case 'permissions':
                        for (const item of data) {
                            try {
                                await prisma.permission.upsert({
                                    where: { key: item.key },
                                    update: {
                                        name: item.name,
                                        description: item.description,
                                    },
                                    create: {
                                        id: item.id,
                                        key: item.key,
                                        name: item.name,
                                        description: item.description,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.key}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'organizations':
                        for (const item of data) {
                            try {
                                await prisma.organization.upsert({
                                    where: { slug: item.slug },
                                    update: {
                                        name: item.name,
                                        type: item.type,
                                        email: item.email,
                                        phone: item.phone,
                                        address: item.address,
                                        website: item.website,
                                        country: item.country,
                                    },
                                    create: {
                                        id: item.id,
                                        name: item.name,
                                        slug: item.slug,
                                        type: item.type,
                                        email: item.email,
                                        phone: item.phone,
                                        address: item.address,
                                        website: item.website,
                                        country: item.country,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.slug}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'users':
                        // D'abord créer les utilisateurs sans permissions
                        for (const item of data) {
                            try {
                                const { permissionKeys, ...userData } = item;
                                await prisma.user.upsert({
                                    where: { email: item.email },
                                    update: {
                                        username: userData.username,
                                        passwordHash: userData.passwordHash,
                                        role: userData.role,
                                        enabled: userData.enabled,
                                        firstName: userData.firstName,
                                        lastName: userData.lastName,
                                        avatar: userData.avatar,
                                        phone: userData.phone,
                                        adress: userData.adress,
                                        country: userData.country,
                                        gender: userData.gender,
                                        organizationId: userData.organizationId,
                                        profession: userData.profession,
                                        dateOfBirth: userData.dateOfBirth,
                                        placeOfBirth: userData.placeOfBirth,
                                    },
                                    create: {
                                        id: userData.id,
                                        email: userData.email,
                                        username: userData.username,
                                        passwordHash: userData.passwordHash,
                                        role: userData.role,
                                        enabled: userData.enabled,
                                        firstName: userData.firstName,
                                        lastName: userData.lastName,
                                        avatar: userData.avatar,
                                        phone: userData.phone,
                                        adress: userData.adress,
                                        country: userData.country,
                                        gender: userData.gender,
                                        organizationId: userData.organizationId,
                                        profession: userData.profession,
                                        dateOfBirth: userData.dateOfBirth,
                                        placeOfBirth: userData.placeOfBirth,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.email}:`, error.message);
                                }
                            }
                        }
                        // Ensuite connecter les permissions
                        for (const item of data) {
                            if (item.permissionKeys && item.permissionKeys.length > 0) {
                                try {
                                    const permissions = await prisma.permission.findMany({
                                        where: { key: { in: item.permissionKeys } },
                                    });
                                    await prisma.user.update({
                                        where: { email: item.email },
                                        data: {
                                            permissions: {
                                                set: [],
                                                connect: permissions.map(p => ({ id: p.id })),
                                            },
                                        },
                                    });
                                } catch (error) {
                                    console.error(`   ⚠️  Erreur permissions pour ${item.email}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'departments':
                        for (const item of data) {
                            try {
                                await prisma.department.upsert({
                                    where: {
                                        organizationId_name: {
                                            organizationId: item.organizationId,
                                            name: item.name,
                                        },
                                    },
                                    update: {
                                        code: item.code,
                                        description: item.description,
                                    },
                                    create: {
                                        id: item.id,
                                        organizationId: item.organizationId,
                                        name: item.name,
                                        code: item.code,
                                        description: item.description,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.name}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'filieres':
                        for (const item of data) {
                            try {
                                await prisma.filiere.upsert({
                                    where: {
                                        departmentId_name: {
                                            departmentId: item.departmentId,
                                            name: item.name,
                                        },
                                    },
                                    update: {
                                        code: item.code,
                                        description: item.description,
                                        level: item.level,
                                    },
                                    create: {
                                        id: item.id,
                                        departmentId: item.departmentId,
                                        name: item.name,
                                        code: item.code,
                                        description: item.description,
                                        level: item.level,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.name}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'organizationInvites':
                        for (const item of data) {
                            try {
                                await prisma.organizationInvite.upsert({
                                    where: { token: item.token },
                                    update: {
                                        status: item.status,
                                        inviteeOrgId: item.inviteeOrgId,
                                        inviteeName: item.inviteeName,
                                        inviteeEmail: item.inviteeEmail,
                                        inviteePhone: item.inviteePhone,
                                        inviteeAddress: item.inviteeAddress,
                                        roleKey: item.roleKey,
                                        expiresAt: item.expiresAt,
                                        acceptedAt: item.acceptedAt,
                                    },
                                    create: {
                                        id: item.id,
                                        inviterOrgId: item.inviterOrgId,
                                        inviteeOrgId: item.inviteeOrgId,
                                        inviteeName: item.inviteeName,
                                        inviteeEmail: item.inviteeEmail,
                                        inviteePhone: item.inviteePhone,
                                        inviteeAddress: item.inviteeAddress,
                                        token: item.token,
                                        status: item.status,
                                        roleKey: item.roleKey,
                                        expiresAt: item.expiresAt,
                                        acceptedAt: item.acceptedAt,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.token}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'demandePartages':
                        for (const item of data) {
                            try {
                                await prisma.demandePartage.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'documentPartages':
                        for (const item of data) {
                            try {
                                await prisma.documentPartage.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'blockchainBlocks':
                        for (const item of data) {
                            try {
                                await prisma.blockchainBlock.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'abonnements':
                        for (const item of data) {
                            try {
                                await prisma.abonnement.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'transactions':
                        for (const item of data) {
                            try {
                                await prisma.transaction.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'payments':
                        for (const item of data) {
                            try {
                                await prisma.payment.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'contactMessages':
                        for (const item of data) {
                            try {
                                await prisma.contactMessage.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'configurations':
                        for (const item of data) {
                            try {
                                await prisma.configuration.upsert({
                                    where: { key: item.key },
                                    update: {
                                        value: item.value,
                                    },
                                    create: {
                                        id: item.id,
                                        key: item.key,
                                        value: item.value,
                                    },
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.key}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'siteSettings':
                        for (const item of data) {
                            try {
                                await prisma.siteSettings.upsert({
                                    where: { id: item.id },
                                    update: item,
                                    create: item,
                                });
                                imported++;
                            } catch (error) {
                                if (error.code === 'P2002') {
                                    skipped++;
                                } else {
                                    errors++;
                                    console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                                }
                            }
                        }
                        break;

                    case 'auditLogs':
                        for (const item of data) {
                            try {
                                await prisma.auditLog.create({
                                    data: item,
                                });
                                imported++;
                            } catch (error) {
                                errors++;
                                console.error(`   ⚠️  Erreur sur ${item.id}:`, error.message);
                            }
                        }
                        break;
                }

                stats.imported[modelName] = imported;
                stats.skipped[modelName] = skipped;
                stats.errors[modelName] = errors;

                console.log(`   ✅ Importés: ${imported}, Ignorés: ${skipped}, Erreurs: ${errors}`);

            } catch (error) {
                console.error(`   ❌ Erreur fatale lors de l'import de ${modelName}:`, error);
                stats.errors[modelName] = error.message;
            }
        }

        // Résumé
        console.log("\n" + "=".repeat(60));
        console.log("✅ Import terminé!");
        console.log("=".repeat(60));
        console.log("\n📊 Résumé:");
        
        let totalImported = 0;
        let totalSkipped = 0;
        let totalErrors = 0;

        for (const [model, count] of Object.entries(stats.imported)) {
            const skipped = stats.skipped[model] || 0;
            const errors = stats.errors[model] || 0;
            console.log(`   ${model}:`);
            console.log(`      ✅ Importés: ${count}`);
            if (skipped > 0) console.log(`      ⏭️  Ignorés: ${skipped}`);
            if (errors > 0) console.log(`      ❌ Erreurs: ${errors}`);
            totalImported += count;
            totalSkipped += skipped;
            totalErrors += errors;
        }

        console.log(`\n📦 Total: ${totalImported} importés, ${totalSkipped} ignorés, ${totalErrors} erreurs`);

    } catch (error) {
        console.error("❌ Erreur lors de l'import:", error);
        throw error;
    }
}

importDatabase(exportFile)
    .catch((e) => {
        console.error("❌ Import échoué:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

