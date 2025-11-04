// Dans une tâche planifiée ou un webhook
const cryptoService = require("../services/crypto.service");

async function verifyAllDocuments() {
    const documents = await prisma.documentPartage.findMany({
        where: { blockchainHash: { not: null } }
    });

    for (const doc of documents) {
        const isValid = await cryptoService.verifyDocumentIntegrity(doc.id);
        if (!isValid) {
            console.warn(`Violation d'intégrité détectée pour le document ${doc.id}`);
            // Envoyer une alerte, etc.
        }
    }
}

// Exécuter périodiquement
setInterval(verifyAllDocuments, 24 * 60 * 60 * 1000); // Toutes les 24h