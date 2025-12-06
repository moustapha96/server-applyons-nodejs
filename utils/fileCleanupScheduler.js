// utils/fileCleanupScheduler.js
const cron = require('node-cron');
const secureStorage = require('./secureStorage');

/**
 * Planifie le nettoyage automatique des fichiers temporaires
 */
function startCleanupScheduler() {
    // Nettoyer les fichiers temporaires tous les jours à 2h du matin
    cron.schedule('0 2 * * *', async () => {
        console.log('🧹 Début du nettoyage automatique des fichiers temporaires...');
        try {
            const deletedCount = await secureStorage.cleanupTempFiles(24); // 24 heures
            console.log(`✅ Nettoyage terminé: ${deletedCount} fichier(s) supprimé(s)`);
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage automatique:', error);
        }
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
    });

    // Nettoyer aussi les fichiers très anciens (plus de 7 jours) une fois par semaine
    cron.schedule('0 3 * * 0', async () => {
        console.log('🧹 Début du nettoyage des fichiers très anciens...');
        try {
            const deletedCount = await secureStorage.cleanupTempFiles(168); // 7 jours
            console.log(`✅ Nettoyage fichiers anciens terminé: ${deletedCount} fichier(s) supprimé(s)`);
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage des fichiers anciens:', error);
        }
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
    });

    console.log('📅 Planificateur de nettoyage automatique activé');
}

module.exports = { startCleanupScheduler };

