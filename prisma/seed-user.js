const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Password123!";

async function main() {
  console.log("🌱 Starting seed...");

  // --- 1) Permissions (idempotent via upsert par 'key')
  // Le schéma Prisma utilise 'key' comme unique, pas 'name'
  const permissionsData = [
    { key: "gerer.activites", name: "Gérer les activités", description: "Gérer les activités" },
    { key: "gerer.ressources", name: "Gérer les ressources", description: "Gérer les ressources" },
    { key: "gerer.utilisateurs", name: "Gérer les utilisateurs", description: "Gérer les utilisateurs" },
    { key: "gerer.bureaux", name: "Gérer les bureaux", description: "Gérer les bureaux" },
    { key: "gerer.actualites", name: "Gérer les actualités", description: "Gérer les actualités" },
    { key: "gerer.partenariats", name: "Gérer les partenariats", description: "Gérer les partenariats" },
    { key: "gerer.evenements", name: "Gérer les événements", description: "Gérer les événements" },
    { key: "gerer.newsletters", name: "Gérer les newsletters", description: "Gérer les newsletters" },
    { key: "gerer.espace.apropos", name: "Gérer l'espace à propos", description: "Gérer l'espace à propos" },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { key: p.key }, // Utiliser 'key' comme unique
      update: { 
        name: p.name,
        description: p.description 
      },
      create: {
        key: p.key,
        name: p.name,
        description: p.description,
      },
    });
    permissions.push(perm);
  }
  console.log(`🔐 Permissions upserted: ${permissions.length}`);

  // --- 2) Admin User (idempotent via upsert par 'email')
  console.log("\n👥 Creating/Updating users...");
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@applyons.com" },
    update: {
      role: "ADMIN", // UserProfileType n'a pas SUPER_ADMIN, utiliser ADMIN
      enabled: true, // Utiliser 'enabled' au lieu de 'status'
      firstName: "Super Admin",
      lastName: "APPLYONS",
      phone: "+221000000000",
      username: "admin", // username est requis et unique
    },
    create: {
      email: "admin@applyons.com",
      username: "admin", // username est requis et unique
      passwordHash, // Utiliser 'passwordHash' au lieu de 'password'
      firstName: "Super Admin",
      lastName: "APPLYONS",
      role: "ADMIN", // UserProfileType: ADMIN | SUPER_ADMIN | DEMANDEUR | INSTITUT | TRADUCTEUR | SUPERVISEUR
      enabled: true, // Utiliser 'enabled' au lieu de 'status'
      phone: "+221000000000",
      gender: "MALE", // GenderType: MALE | FEMALE | OTHER
      permissions: {
        connect: permissions.map((p) => ({ id: p.id })),
      },
    },
    include: { permissions: true },
  });

  // S'assurer que l'ADMIN possède toutes les permissions
  await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      permissions: {
        set: [],
        connect: permissions.map((p) => ({ id: p.id })),
      },
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(
    `Created/Updated:
- ADMIN: ${adminUser.email} (username: ${adminUser.username})
- Total permissions: ${permissions.length}
- Default password: ${DEFAULT_PASSWORD}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
