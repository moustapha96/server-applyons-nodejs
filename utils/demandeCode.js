// utils/demandeCode.js
function pad(n) { return String(n).padStart(2, "0"); }

function buildCodeBase(date = new Date()) {
    const Y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const H = pad(date.getHours());
    const m = pad(date.getMinutes());
    return `DP${Y}${M}${D}${H}${m}`;
}

async function generateUniqueDemandeCode(prisma, model = "demande") {
    const base = buildCodeBase();

    // Adapte le nom de modèle selon ton schéma: prisma.demande ou prisma.demandePartage
    const repo = prisma[model]; // "demande" par défaut

    // Récupère le dernier code qui commence par la base
    const last = await repo.findFirst({
        where: { code: { startsWith: base } },
        orderBy: { code: "desc" },
        select: { code: true },
    });

    if (!last) return base; // aucun conflit

    // Extrait le suffixe numérique déjà utilisé
    const suffix = last.code.slice(base.length); // "", "01", "02", ...
    const next = (parseInt(suffix || "0", 10) + 1);
    return base + String(next).padStart(2, "0"); // DP... + "01"
}

module.exports = { buildCodeBase, generateUniqueDemandeCode };