// middleware/fileValidation.middleware.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES_PER_USER = 50; // Limite par utilisateur

/**
 * Vérifie le type MIME réel du fichier (magic bytes)
 */
async function checkMimeType(filePath) {
    try {
        // Lire les premiers bytes pour vérifier le type réel
        const buffer = fs.readFileSync(filePath);
        const fileSignature = buffer.toString('hex', 0, 4);
        
        // Signature PDF: %PDF
        if (buffer.toString('ascii', 0, 4) === '%PDF') {
            return 'application/pdf';
        }
        
        // Vérifier d'autres signatures si nécessaire
        // PDF peut aussi commencer par des bytes spécifiques
        if (fileSignature.startsWith('25504446') || // %PDF en hex
            buffer.toString('ascii', 0, 4) === '%PDF') {
            return 'application/pdf';
        }
        
        return null;
    } catch (error) {
        throw new Error(`Erreur lors de la vérification du type de fichier: ${error.message}`);
    }
}

/**
 * Valide la structure d'un fichier PDF
 */
async function validatePDFStructure(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        
        // Vérifier que le fichier commence par %PDF
        const header = buffer.toString('ascii', 0, 4);
        if (header !== '%PDF') {
            throw new Error('Fichier PDF invalide: en-tête manquant');
        }
        
        // Vérifier qu'il y a un %%EOF à la fin (signe d'un PDF valide)
        const footer = buffer.toString('ascii', buffer.length - 6, buffer.length);
        if (!footer.includes('%%EOF') && !footer.includes('%%EOF\n')) {
            // Certains PDFs valides n'ont pas %%EOF, donc on ne le rend pas obligatoire
            // Mais on vérifie au moins qu'il y a du contenu
            if (buffer.length < 100) {
                throw new Error('Fichier PDF trop petit ou corrompu');
            }
        }
        
        return true;
    } catch (error) {
        throw new Error(`Erreur validation PDF: ${error.message}`);
    }
}

/**
 * Sanitize le nom de fichier
 */
function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.\./g, '') // Prévenir path traversal
        .substring(0, 255); // Limiter la longueur
}

/**
 * Valide la taille du fichier
 */
function validateFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        
        if (stats.size === 0) {
            throw new Error('Fichier vide');
        }
        
        if (stats.size > MAX_FILE_SIZE) {
            throw new Error(`Fichier trop volumineux (max: ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
        }
        
        return true;
    } catch (error) {
        if (error.message.includes('vide') || error.message.includes('volumineux')) {
            throw error;
        }
        throw new Error(`Erreur lors de la vérification de la taille: ${error.message}`);
    }
}

/**
 * Middleware de validation de fichier complet
 */
async function validateUploadedFile(req, res, next) {
    try {
        const file = req.file || (req.files && req.files.file && req.files.file[0]);
        
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni',
                code: 'NO_FILE'
            });
        }

        // 1. Vérifier la taille
        validateFileSize(file.path);

        // 2. Vérifier le MIME type réel
        const realMimeType = await checkMimeType(file.path);
        if (!realMimeType || !ALLOWED_MIME_TYPES.includes(realMimeType)) {
            // Nettoyer le fichier
            try {
                fs.unlinkSync(file.path);
            } catch (e) {}
            
            return res.status(400).json({
                success: false,
                message: 'Type de fichier non autorisé. Seuls les fichiers PDF sont acceptés.',
                code: 'INVALID_FILE_TYPE'
            });
        }

        // 3. Valider la structure PDF
        await validatePDFStructure(file.path);

        // 4. Sanitizer le nom original
        if (file.originalname) {
            file.originalname = sanitizeFilename(file.originalname);
        }

        // Marquer le fichier comme validé
        req.validatedFile = file;
        
        // Ajouter à la liste des fichiers temporaires pour nettoyage
        if (!req.tempFiles) {
            req.tempFiles = [];
        }
        req.tempFiles.push(file.path);

        next();
    } catch (error) {
        // Nettoyer le fichier en cas d'erreur
        const file = req.file || (req.files && req.files.file && req.files.file[0]);
        if (file && file.path) {
            try {
                fs.unlinkSync(file.path);
            } catch (e) {}
        }

        return res.status(400).json({
            success: false,
            message: error.message || 'Erreur de validation du fichier',
            code: 'FILE_VALIDATION_ERROR'
        });
    }
}

/**
 * Vérifie le quota d'upload par utilisateur
 */
async function checkUploadQuota(req, res, next) {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
                code: 'UNAUTHORIZED'
            });
        }

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // Compter les documents uploadés aujourd'hui par cet utilisateur
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const count = await prisma.documentPartage.count({
            where: {
                createdAt: {
                    gte: today
                },
                encryptedBy: userId
            }
        });

        if (count >= MAX_FILES_PER_USER) {
            return res.status(429).json({
                success: false,
                message: `Quota d'upload atteint (${MAX_FILES_PER_USER} fichiers/jour)`,
                code: 'QUOTA_EXCEEDED'
            });
        }

        await prisma.$disconnect();
        next();
    } catch (error) {
        console.error('Erreur vérification quota:', error);
        next(); // Continuer en cas d'erreur pour ne pas bloquer
    }
}

module.exports = {
    validateUploadedFile,
    checkUploadQuota,
    sanitizeFilename,
    validateFileSize,
    checkMimeType,
    validatePDFStructure
};

