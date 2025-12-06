# Suggestions pour Sécuriser l'Upload et le Stockage des Documents

## 📋 Analyse du Système Actuel

### Points Positifs ✅
- Chiffrement automatique des documents (AES-256-CBC)
- Vérification d'intégrité via hash blockchain
- Système d'audit des actions
- Validation basique des types de fichiers (PDF uniquement)
- Limite de taille (5MB)
- Permissions basées sur les rôles

### Points à Améliorer ⚠️

## 🔒 Recommandations de Sécurité

### 1. **Validation Renforcée des Fichiers**

#### Problèmes identifiés :
- ✅ Extension vérifiée (`.pdf`)
- ❌ MIME type réel non vérifié (peut être falsifié)
- ❌ Pas de scan antivirus/malware
- ❌ Pas de vérification de la structure réelle du PDF
- ❌ Pas de limite sur le nombre de fichiers uploadés par utilisateur

#### Solutions recommandées :

```javascript
// 1. Vérification du MIME type réel (magic bytes)
const fileType = require('file-type');
const allowedMimeTypes = ['application/pdf'];

// 2. Vérification de la structure PDF
const pdfParser = require('pdf-parse');

// 3. Scan antivirus (optionnel mais recommandé)
const ClamScan = require('clamscan');

// 4. Validation du contenu
async function validateFile(filePath) {
    // Vérifier le type réel du fichier
    const type = await fileType.fromFile(filePath);
    if (!type || !allowedMimeTypes.includes(type.mime)) {
        throw new Error('Type de fichier invalide');
    }
    
    // Vérifier que c'est un PDF valide
    try {
        const dataBuffer = fs.readFileSync(filePath);
        await pdfParser(dataBuffer);
    } catch (error) {
        throw new Error('Fichier PDF corrompu ou invalide');
    }
    
    // Scan antivirus (si disponible)
    if (process.env.ENABLE_VIRUS_SCAN === 'true') {
        const clamscan = await new ClamScan().init();
        const { isInfected, viruses } = await clamscan.isInfected(filePath);
        if (isInfected) {
            throw new Error(`Fichier infecté détecté: ${viruses.join(', ')}`);
        }
    }
}
```

### 2. **Sécurisation du Stockage**

#### Problèmes identifiés :
- ❌ Fichiers accessibles publiquement via URL statique (`/uploads/documents/...`)
- ❌ Pas de contrôle d'accès sur les fichiers statiques
- ❌ Noms de fichiers prévisibles
- ❌ Pas de séparation entre fichiers originaux et chiffrés

#### Solutions recommandées :

**A. Stockage sécurisé avec contrôle d'accès :**

```javascript
// Au lieu de servir les fichiers statiquement, créer une route protégée
router.get('/uploads/documents/:filename', 
    requireAuth,
    requirePermission('documents.read'),
    async (req, res) => {
        const { filename } = req.params;
        const filePath = path.join(uploadDir, filename);
        
        // Vérifier que le fichier existe et que l'utilisateur y a accès
        const document = await prisma.documentPartage.findFirst({
            where: { urlOriginal: { contains: filename } }
        });
        
        if (!document) {
            return res.status(404).json({ message: 'Fichier introuvable' });
        }
        
        // Vérifier les permissions (utiliser checkDocumentAccess)
        // ... logique de vérification ...
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${document.codeAdn || 'document'}.pdf"`);
        res.sendFile(filePath);
    }
);
```

**B. Noms de fichiers sécurisés :**

```javascript
// Générer des noms de fichiers non-prévisibles
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Organiser par date pour faciliter le nettoyage
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const uploadPath = path.join(uploadDir, year.toString(), month);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nom aléatoire + hash pour éviter les collisions
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256')
            .update(file.originalname + Date.now())
            .digest('hex')
            .substring(0, 8);
        const ext = path.extname(file.originalname);
        cb(null, `${hash}-${randomBytes}${ext}`);
    },
});
```

**C. Stockage dans un répertoire non-accessible publiquement :**

```javascript
// Déplacer les fichiers dans un répertoire privé
const privateUploadDir = path.join(process.cwd(), 'private', 'uploads', 'documents');
// Ne pas exposer ce répertoire via express.static()
```

### 3. **Gestion des Fichiers Temporaires**

#### Problèmes identifiés :
- ❌ Fichiers temporaires peuvent rester sur le disque en cas d'erreur
- ❌ Pas de nettoyage automatique
- ❌ Risque de saturation du disque

#### Solutions recommandées :

```javascript
// Middleware de nettoyage automatique
const cleanupTempFiles = async (req, res, next) => {
    const originalEnd = res.end;
    res.end = function(...args) {
        // Nettoyer les fichiers temporaires après la réponse
        if (req.tempFiles) {
            req.tempFiles.forEach(file => {
                try {
                    if (fs.existsSync(file)) {
                        fs.unlinkSync(file);
                    }
                } catch (err) {
                    console.error(`Erreur nettoyage fichier ${file}:`, err);
                }
            });
        }
        originalEnd.apply(this, args);
    };
    next();
};

// Utiliser un système de nettoyage programmé
const cron = require('node-cron');

// Nettoyer les fichiers temporaires de plus de 24h
cron.schedule('0 2 * * *', async () => {
    const tempDir = path.join(process.cwd(), 'temp');
    const files = fs.readdirSync(tempDir, { recursive: true });
    const now = Date.now();
    
    for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtime.getTime();
        
        // Supprimer les fichiers de plus de 24h
        if (age > 24 * 60 * 60 * 1000) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`Erreur suppression ${filePath}:`, err);
            }
        }
    }
});
```

### 4. **Sécurisation des Clés de Chiffrement**

#### Problèmes identifiés :
- ⚠️ Clés stockées en base de données (risque si DB compromise)
- ⚠️ Pas de rotation des clés
- ⚠️ Pas de gestion de clés maîtres

#### Solutions recommandées :

**A. Utiliser un service de gestion de clés (KMS) :**

```javascript
// Option 1: AWS KMS
const AWS = require('aws-sdk');
const kms = new AWS.KMS({ region: process.env.AWS_REGION });

async function encryptKey(plaintextKey) {
    const result = await kms.encrypt({
        KeyId: process.env.KMS_KEY_ID,
        Plaintext: plaintextKey
    }).promise();
    return result.CiphertextBlob.toString('base64');
}

async function decryptKey(encryptedKey) {
    const result = await kms.decrypt({
        CiphertextBlob: Buffer.from(encryptedKey, 'base64')
    }).promise();
    return result.Plaintext.toString();
}

// Option 2: HashiCorp Vault (open source)
// Option 3: Stocker les clés chiffrées avec une clé maître
```

**B. Rotation des clés :**

```javascript
// Implémenter une stratégie de rotation
// - Chiffrer les anciens documents avec de nouvelles clés
// - Archiver les anciennes clés
// - Planifier la rotation périodique
```

### 5. **Rate Limiting et Quotas**

#### Problèmes identifiés :
- ❌ Pas de limite sur le nombre d'uploads par utilisateur
- ❌ Pas de limite globale sur les uploads
- ❌ Risque de DoS par upload massif

#### Solutions recommandées :

```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Limite par utilisateur
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 uploads par fenêtre
    message: 'Trop de fichiers uploadés, veuillez réessayer plus tard',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

// Ralentissement progressif
const uploadSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 5, // Commencer à ralentir après 5 uploads
    delayMs: 500, // Ajouter 500ms de délai par upload supplémentaire
});

// Appliquer aux routes d'upload
router.post('/', 
    requireAuth,
    uploadLimiter,
    uploadSlowDown,
    upload.single('file'),
    // ...
);
```

### 6. **Validation du Contenu et Sanitization**

#### Solutions recommandées :

```javascript
// Sanitizer pour les noms de fichiers
function sanitizeFilename(filename) {
    // Supprimer les caractères dangereux
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.\./g, '') // Prévenir path traversal
        .substring(0, 255); // Limiter la longueur
}

// Validation de la taille réelle du fichier
function validateFileSize(filePath, maxSize = 5 * 1024 * 1024) {
    const stats = fs.statSync(filePath);
    if (stats.size > maxSize) {
        throw new Error(`Fichier trop volumineux (max: ${maxSize} bytes)`);
    }
    if (stats.size === 0) {
        throw new Error('Fichier vide');
    }
}
```

### 7. **Logging et Monitoring**

#### Solutions recommandées :

```javascript
// Logger tous les uploads avec détails
async function logUpload(req, file, documentId) {
    await createAuditLog({
        userId: req.user?.id,
        action: 'FILE_UPLOADED',
        resource: 'documents',
        resourceId: documentId,
        details: {
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            path: file.path,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
    });
}

// Alertes pour activités suspectes
function detectSuspiciousActivity(uploads) {
    // Détecter :
    // - Nombre anormal d'uploads
    // - Taille totale excessive
    // - Patterns suspects dans les noms de fichiers
    // - Uploads depuis des IPs multiples
}
```

### 8. **Backup et Récupération**

#### Solutions recommandées :

```javascript
// Système de backup automatique
// - Sauvegarder les fichiers chiffrés régulièrement
// - Sauvegarder les métadonnées (DB)
// - Tester la restauration périodiquement
// - Stocker les backups dans un emplacement séparé
```

### 9. **Séparation des Environnements**

#### Solutions recommandées :

```javascript
// Utiliser des répertoires différents selon l'environnement
const uploadDir = process.env.NODE_ENV === 'production' 
    ? '/secure/storage/documents'
    : path.join(process.cwd(), 'uploads', 'documents');

// Permissions de fichiers restrictives
fs.chmodSync(uploadDir, 0o700); // Lecture/écriture/exécution pour le propriétaire uniquement
```

### 10. **Migration vers Stockage Cloud (Optionnel mais Recommandé)**

#### Avantages :
- ✅ Scalabilité
- ✅ Redondance automatique
- ✅ Gestion des permissions intégrée
- ✅ Versioning
- ✅ Lifecycle policies

#### Implémentation :

```javascript
// Utiliser AWS S3 avec bucket privé
// Déjà présent dans config/storage.js mais pas utilisé partout

// Migrer progressivement :
// 1. Nouveaux uploads → S3
// 2. Migrer les fichiers existants
// 3. Supprimer les fichiers locaux après migration
```

## 📝 Plan d'Implémentation Priorisé

### Priorité Haute 🔴
1. ✅ Validation MIME type réel
2. ✅ Contrôle d'accès sur les fichiers statiques
3. ✅ Noms de fichiers sécurisés
4. ✅ Nettoyage automatique des fichiers temporaires
5. ✅ Rate limiting

### Priorité Moyenne 🟡
6. ✅ Scan antivirus (si budget disponible)
7. ✅ Validation structure PDF
8. ✅ Chiffrement des clés (KMS)
9. ✅ Logging renforcé
10. ✅ Quotas par utilisateur

### Priorité Basse 🟢
11. ✅ Migration vers S3
12. ✅ Rotation des clés
13. ✅ Backup automatique
14. ✅ Monitoring avancé

## 🔧 Fichiers à Modifier

1. `routes/document.routes.js` - Ajouter rate limiting, validation renforcée
2. `controllers/document.controller.js` - Ajouter validation fichiers, nettoyage
3. `services/crypto.service.js` - Améliorer gestion des clés
4. `middleware/auth.middleware.js` - Renforcer checkDocumentAccess
5. Créer `middleware/fileValidation.middleware.js` - Nouveau middleware
6. Créer `utils/fileCleanup.js` - Utilitaires de nettoyage
7. Créer `services/storage.service.js` - Service de stockage unifié

## ⚠️ Points d'Attention

1. **Rétrocompatibilité** : Les fichiers existants doivent continuer à fonctionner
2. **Performance** : Les validations ne doivent pas ralentir significativement les uploads
3. **Coûts** : Le scan antivirus et le stockage cloud ont des coûts associés
4. **Migration** : Planifier la migration des fichiers existants vers le nouveau système

## 📚 Ressources

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [AWS S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

