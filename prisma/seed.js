/* prisma/seed.js */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'Password123!';

const hash = (pwd) => bcrypt.hash(pwd, BCRYPT_ROUNDS);
const now = () => new Date();

/* -------------------- Permissions socle -------------------- */
const PERMISSIONS = [
    'users.read', 'users.manage', 'users.impersonate',
    'permissions.read', 'permissions.manage',
    'organizations.read', 'organizations.manage',
    'departments.read', 'departments.manage',
    'filieres.read', 'filieres.manage',
    'demandes.read', 'demandes.manage',
    'documents.read', 'documents.create', 'documents.update', 'documents.delete', 'documents.translate', 'documents.verify',
    'payments.read', 'payments.manage',
    'transactions.read', 'transactions.manage',
    'abonnements.read', 'abonnements.manage',
    'messages_contact.read', 'messages_contact.manage',
    'config.read', 'config.manage', 'dashboard.read'
];

async function upsertPermissions() {
    const created = [];
    for (const key of PERMISSIONS) {
        const name = key.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        const p = await prisma.permission.upsert({
            where: { key },
            update: {},
            create: { key, name, description: `Permission ${key}` },
        });
        created.push(p);
    }
    return created;
}

/* -------------------- Orgs (1 par type enum) -------------------- */
/* NB: `type` DOIT être l’une des valeurs: COLLEGE | BANQUE | UNIVERSITE | LYCEE | ENTREPRISE | TRADUCTEUR */
const ORGS = [{
        name: 'Applyons HQ',
        slug: 'applyons-hq',
        type: 'ENTREPRISE',
        email: 'hq@applyons.com',
        phone: '+221000000001',
        address: 'HQ Street 1',
        website: 'https://applyons.com',
        country: 'SN',
    },
    {
        name: 'Université Démo',
        slug: 'universite-demo',
        type: 'UNIVERSITE',
        email: 'contact@univ-demo.edu',
        phone: '+221000000002',
        address: 'Campus Way',
        website: 'https://univ-demo.edu',
        country: 'SN',
    },
    {
        name: 'Lycée Modèle',
        slug: 'lycee-modele',
        type: 'LYCEE',
        email: 'contact@lycee-modele.edu',
        phone: '+221000000003',
        address: 'Rue de l’Éducation',
        website: 'https://lycee-modele.edu',
        country: 'SN',
    },
    {
        name: 'Collège Pilote',
        slug: 'college-pilote',
        type: 'COLLEGE',
        email: 'contact@college-pilote.edu',
        phone: '+221000000004',
        address: 'Avenue du Savoir',
        website: 'https://college-pilote.edu',
        country: 'SN',
    },
    {
        name: 'Banque Partenaire',
        slug: 'banque-partenaire',
        type: 'BANQUE',
        email: 'contact@banque-partenaire.com',
        phone: '+221000000005',
        address: 'Quartier des Affaires',
        website: 'https://banque-partenaire.com',
        country: 'SN',
    },
    {
        name: 'Agence de Traduction Démo',
        slug: 'agence-traduction-demo',
        type: 'TRADUCTEUR',
        email: 'contact@trad-demo.com',
        phone: '+221000000006',
        address: 'Traduction Ave',
        website: 'https://trad-demo.com',
        country: 'SN',
    },
];

async function upsertOrganizations() {
    const ids = {};
    for (const o of ORGS) {
        const org = await prisma.organization.upsert({
            where: { slug: o.slug }, // slug est @unique
            update: {
                name: o.name,
                type: o.type,
                email: o.email,
                phone: o.phone,
                address: o.address,
                website: o.website,
                country: o.country,
                updatedAt: now(),
            },
            create: {
                name: o.name,
                slug: o.slug,
                type: o.type,
                email: o.email,
                phone: o.phone,
                address: o.address,
                website: o.website,
                country: o.country,
                createdAt: now(),
                updatedAt: now(),
            },
        });
        ids[o.slug] = org.id;
    }
    return ids;
}

/* -------------------- Users démo (1 par rôle) -------------------- */
/* Rôles côté User.role (UserProfileType):
   DEMANDEUR | INSTITUT | TRADUCTEUR | SUPERVISEUR | ADMIN */
function userDefinitions(orgIds) {
    return [
        // ADMIN (attaché à l’entreprise HQ, toutes permissions)
        {
            email: 'admin@applyons.com',
            username: 'admin',
            role: 'ADMIN',
            organizationId: orgIds['applyons-hq'],
            gender: 'MALE',
            enabled: true,
            permissions: 'ALL',
        },
        // SUPERVISEUR (attaché à HQ aussi)
        {
            email: 'superviseur@applyons.com',
            username: 'superviseur',
            role: 'SUPERVISEUR',
            organizationId: orgIds['applyons-hq'],
            gender: 'MALE',
            enabled: true,
            permissions: [
                'users.read', 'demandes.read', 'documents.read',
                'payments.read', 'transactions.read', 'abonnements.read',
                'messages_contact.read',
            ],
        },
        // INSTITUT (attaché à une université)
        {
            email: 'institut@applyons.com',
            username: 'institut',
            role: 'INSTITUT',
            organizationId: orgIds['universite-demo'],
            gender: 'FEMALE',
            enabled: true,
            permissions: ['demandes.read', 'documents.read', 'documents.verify'],
        },
        // TRADUCTEUR (attaché à l’org de type TRADUCTEUR)
        {
            email: 'traducteur@applyons.com',
            username: 'traducteur',
            role: 'TRADUCTEUR',
            organizationId: orgIds['agence-traduction-demo'],
            gender: 'OTHER',
            enabled: true,
            permissions: ['documents.read', 'documents.translate'],
        },
        // DEMANDEUR (sans org)
        {
            email: 'demandeur@applyons.com',
            username: 'demandeur',
            role: 'DEMANDEUR',
            organizationId: null,
            gender: 'MALE',
            enabled: true,
            permissions: [],
        },
    ];
}

async function upsertUser(u, allPerms) {
    const passwordHash = await hash(DEFAULT_PASSWORD);

    let connectPerms = [];
    if (u.permissions === 'ALL') {
        connectPerms = allPerms.map((p) => ({ id: p.id }));
    } else if (Array.isArray(u.permissions) && u.permissions.length) {
        const found = await prisma.permission.findMany({
            where: { key: { in: u.permissions } },
            select: { id: true },
        });
        connectPerms = found.map((p) => ({ id: p.id }));
    }

    const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {
            username: u.username,
            role: u.role,
            enabled: u.enabled,
            organizationId: u.organizationId,
            gender: u.gender,
            updatedAt: now(),
        },
        create: {
            email: u.email,
            username: u.username,
            role: u.role,
            enabled: u.enabled,
            passwordHash,
            organizationId: u.organizationId,
            gender: u.gender,
            createdAt: now(),
            updatedAt: now(),
        },
        include: { permissions: true },
    });

    if (u.permissions !== undefined) {
        await prisma.user.update({
            where: { id: user.id },
            data: { permissions: { set: [], connect: connectPerms } },
        });
    }

    return user;
}

async function main() {
    console.log('🔧 Seeding…');

    const allPerms = await upsertPermissions();
    console.log(`✅ Permissions: ${allPerms.length}`);

    const orgIds = await upsertOrganizations();
    console.log('✅ Organizations:', orgIds);

    const defs = userDefinitions(orgIds);
    for (const u of defs) {
        const user = await upsertUser(u, allPerms);
        console.log(`👤 ${user.email} [${user.role}] OK`);
    }

    console.log('🎉 Seed terminé. Mot de passe par défaut:', DEFAULT_PASSWORD);
}

main()
    .catch((e) => { <<
        << << < HEAD
        console.error('❌ Seed error:', e); ===
        === =
        console.error("❌ Seed failed:", e); >>>
        >>> > 11638 a4e762238cb6e37ed9e80678871acdd4887
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });