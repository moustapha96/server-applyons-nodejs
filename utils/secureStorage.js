// utils/secureStorage.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Service de stockage sécurisé pour les fichiers
 */
class SecureStorage {
    constructor() {
        // Répertoires de stockage
        this.baseDir = path.join(process.cwd(), 'uploads');
        this.documentsDir = path.join(this.baseDir, 'documents');
        this.encryptedDir = path.join(this.baseDir, 'encrypted');
        this.tempDir = path.join(process.cwd(), 'temp');
        
        // Créer les répertoires s'ils n'existent pas
        this.ensureDirectories();
    }

    /**
     * Crée les répertoires nécessaires avec les bonnes permissions
     */
    ensureDirectories() {
        const dirs = [
            this.baseDir,
            this.documentsDir,
            this.encryptedDir,
            this.tempDir
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                // Permissions restrictives (700 = rwx------)
                try {
                    fs.chmodSync(dir, 0o700);
                } catch (e) {
                    // Ignorer les erreurs de permissions sur Windows
                }
            }
        });
    }

    /**
     * Génère un nom de fichier sécurisé et non-prévisible
     */
    generateSecureFilename(originalName = 'document', extension = '.pdf') {
        // Hash de l'original name + timestamp + random
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        const hash = crypto
            .createHash('sha256')
            .update(originalName + timestamp + randomBytes)
            .digest('hex')
            .substring(0, 16);
        
        return `${hash}-${randomBytes}${extension}`;
    }

    /**
     * Organise les fichiers par date (année/mois)
     */
    getDateOrganizedPath(baseDir) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const datePath = path.join(baseDir, year.toString(), month);
        
        if (!fs.existsSync(datePath)) {
            fs.mkdirSync(datePath, { recursive: true });
            try {
                fs.chmodSync(datePath, 0o700);
            } catch (e) {}
        }
        
        return datePath;
    }

    /**
     * Stocke un fichier de manière sécurisée
     */
    async storeFile(sourcePath, type = 'document', originalName = null) {
        try {
            // Déterminer le répertoire de destination
            let destDir;
            if (type === 'encrypted') {
                destDir = this.encryptedDir;
            } else {
                destDir = this.documentsDir;
            }

            // Organiser par date
            const datePath = this.getDateOrganizedPath(destDir);

            // Générer un nom sécurisé
            const ext = path.extname(sourcePath) || path.extname(originalName || '') || '.pdf';
            const secureFilename = this.generateSecureFilename(originalName || 'document', ext);
            const destPath = path.join(datePath, secureFilename);

            // Copier le fichier
            fs.copyFileSync(sourcePath, destPath);

            // Permissions restrictives
            try {
                fs.chmodSync(destPath, 0o600); // rw-------
            } catch (e) {
                // Ignorer sur Windows
            }

            // Retourner le chemin relatif pour l'URL
            const relativePath = path.relative(this.baseDir, destPath).replace(/\\/g, '/');
            
            return {
                path: destPath,
                relativePath: relativePath,
                filename: secureFilename,
                url: `/uploads/${relativePath}`
            };
        } catch (error) {
            throw new Error(`Erreur lors du stockage du fichier: ${error.message}`);
        }
    }

    /**
     * Supprime un fichier de manière sécurisée
     */
    async deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Erreur suppression fichier ${filePath}:`, error);
            return false;
        }
    }

    /**
     * Nettoie les fichiers temporaires anciens
     */
    async cleanupTempFiles(maxAgeHours = 24) {
        try {
            if (!fs.existsSync(this.tempDir)) {
                return;
            }

            const files = this.getAllFilesRecursive(this.tempDir);
            const now = Date.now();
            const maxAge = maxAgeHours * 60 * 60 * 1000;
            let deletedCount = 0;

            for (const filePath of files) {
                try {
                    const stats = fs.statSync(filePath);
                    const age = now - stats.mtime.getTime();

                    if (age > maxAge) {
                        fs.unlinkSync(filePath);
                        deletedCount++;
                    }
                } catch (error) {
                    // Ignorer les erreurs
                }
            }

            // Nettoyer les répertoires vides
            this.cleanupEmptyDirs(this.tempDir);

            return deletedCount;
        } catch (error) {
            console.error('Erreur nettoyage fichiers temporaires:', error);
            return 0;
        }
    }

    /**
     * Récupère tous les fichiers récursivement
     */
    getAllFilesRecursive(dir) {
        const files = [];
        
        if (!fs.existsSync(dir)) {
            return files;
        }

        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files.push(...this.getAllFilesRecursive(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    /**
     * Nettoie les répertoires vides
     */
    cleanupEmptyDirs(dir) {
        if (!fs.existsSync(dir)) {
            return;
        }

        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                this.cleanupEmptyDirs(fullPath);
                
                // Essayer de supprimer le répertoire s'il est vide
                try {
                    const remaining = fs.readdirSync(fullPath);
                    if (remaining.length === 0) {
                        fs.rmdirSync(fullPath);
                    }
                } catch (e) {
                    // Ignorer
                }
            }
        }
    }

    /**
     * Vérifie qu'un chemin est dans le répertoire autorisé (prévention path traversal)
     */
    isPathSafe(filePath, baseDir) {
        const resolvedPath = path.resolve(filePath);
        const resolvedBase = path.resolve(baseDir);
        return resolvedPath.startsWith(resolvedBase);
    }
}

module.exports = new SecureStorage();

