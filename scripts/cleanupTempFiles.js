// scripts/cleanupTempFiles.js
const fs = require('fs');
const path = require('path');

function cleanupTempFiles() {
    const tempDir = path.join(__dirname, '../temp');
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    if (!fs.existsSync(tempDir)) {
        console.log('Répertoire temporaire inexistant');
        return;
    }

    const files = fs.readdirSync(tempDir);
    let deleted = 0;

    files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtimeMs > maxAge) {
            try {
                fs.unlinkSync(filePath);
                deleted++;
                console.log(`Suppression de ${file} (âgé de ${Math.floor((now - stats.mtimeMs)/3600000)} heures)`);
            } catch (err) {
                console.error(`Échec suppression ${file}:`, err.message);
            }
        }
    });

    console.log(`Nettoyage terminé. ${deleted} fichiers supprimés.`);
}

// Lancer le nettoyage
if (require.main === module) {
    cleanupTempFiles();
}