const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const now = () => new Date();


// Paramètres par défaut pour SiteSettings
const DEFAULT_SITE_SETTINGS = {
    siteName: "APPLYONS",
    contactEmail: "contact@applyons.org",
    contactAddress: "Dakar, Sénégal",
    contactPhone: "+221 33 800 90 90",
    contactMobile: "+221 77 000 00 00",
    urlSite: "https://applyons.org",
    footer: "APPLYONS © 2025 - Tous droits réservés",
    socialMedia: {
        twitter: "https://twitter.com/applyons",
        facebook: "https://facebook.com/applyons",
        linkedin: "https://linkedin.com/company/applyons",
        instagram: "https://instagram.com/applyons",
        youtube: "https://youtube.com/@applyons",
    },
    // logo et favicon seront ajoutés manuellement via l'interface admin
};


async function upsertSiteSettings() {
    await prisma.siteSettings.upsert({
        where: { id: "default" }, // Utilisez un ID fixe pour garantir la mise à jour
        update: DEFAULT_SITE_SETTINGS,
        create: {...DEFAULT_SITE_SETTINGS, id: "default" },
    });
}

/* -------------------- main -------------------- */
async function main() {
    console.log('🔧 Seeding…');

    await upsertSiteSettings();
    console.log('✅ SiteSettings: seeded');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });