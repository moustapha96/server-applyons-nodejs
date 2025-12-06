// middleware/fileCleanup.middleware.js
const fs = require('fs');

/**
 * Middleware pour nettoyer automatiquement les fichiers temporaires après la réponse
 */
function fileCleanupMiddleware(req, res, next) {
    // Stocker la fonction end originale
    const originalEnd = res.end;
    const originalJson = res.json;
    
    // Liste des fichiers à nettoyer
    if (!req.tempFiles) {
        req.tempFiles = [];
    }

    // Intercepter res.end pour nettoyer après l'envoi
    res.end = function(...args) {
        cleanupFiles(req.tempFiles);
        originalEnd.apply(this, args);
    };

    // Intercepter res.json aussi
    res.json = function(...args) {
        cleanupFiles(req.tempFiles);
        return originalJson.apply(this, args);
    };

    next();
}

/**
 * Nettoie une liste de fichiers
 */
function cleanupFiles(files) {
    if (!Array.isArray(files)) {
        return;
    }

    files.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            // Ignorer les erreurs de nettoyage
            console.error(`Erreur nettoyage fichier ${filePath}:`, error.message);
        }
    });
}

module.exports = fileCleanupMiddleware;

