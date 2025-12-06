# Guide de Migration - Sécurisation des Uploads de Documents

## 📋 Résumé des Changements

Ce guide décrit les améliorations de sécurité apportées au système d'upload et de stockage des documents.

## 🔒 Améliorations Implémentées

### 1. Validation Renforcée des Fichiers
- ✅ Vérification du MIME type réel (magic bytes)
- ✅ Validation de la structure PDF
- ✅ Sanitization des noms de fichiers
- ✅ Vérification de la taille réelle

### 2. Stockage Sécurisé
- ✅ Noms de fichiers aléatoires et non-prévisibles
- ✅ Organisation par date (année/mois)
- ✅ Permissions restrictives sur les fichiers
- ✅ Prévention des attaques path traversal

### 3. Contrôle d'Accès
- ✅ Route protégée pour servir les fichiers
- ✅ Vérification des permissions avant chaque accès
- ✅ Logging de tous les accès aux fichiers

### 4. Rate Limiting
- ✅ Limite de 10 uploads par 15 minutes par utilisateur
- ✅ Quota quotidien de 50 fichiers par utilisateur
- ✅ Exemption pour les administrateurs

### 5. Nettoyage Automatique
- ✅ Nettoyage automatique des fichiers temporaires
- ✅ Suppression des fichiers de plus de 24h
- ✅ Nettoyage hebdomadaire des fichiers très anciens

## 📦 Nouvelles Dépendances

```bash
npm install node-cron
```

## 🔄 Changements dans le Code

### Routes (`routes/document.routes.js`)

**Avant :**
```javascript
router.post("/", requireAuth, upload.single("file"), ctrl.createDocumentPartage);
```

**Après :**
```javascript
router.post(
    "/",
    requireAuth,
    requirePermission("documents.create"),
    uploadLimiter,
    checkUploadQuota,
    upload.single("file"),
    fileCleanup,
    validateUploadedFile,
    ctrl.createDocumentPartage
);
```

### Controller (`controllers/document.controller.js`)

**Avant :**
```javascript
const base = publicBase(req);
const rel = file.path.replace(/\\/g, "/").replace(/^\/?/, "/");
const urlOriginal = `${base}${rel}`;
```

**Après :**
```javascript
const secureStorage = require("../utils/secureStorage");
const storedFile = await secureStorage.storeFile(
    file.path,
    'document',
    file.originalname
);
const urlOriginal = `${base}/api/documents/file/${storedFile.relativePath}`;
```

### Serveur (`server.js`)

**Avant :**
```javascript
app.use("/documents", express.static(path.join(__dirname, "uploads")));
```

**Après :**
```javascript
// Documents ne sont plus servis statiquement - utilisation de la route protégée
// app.use("/documents", express.static(...)); // DÉSACTIVÉ
```

## 🆕 Nouveaux Fichiers

1. **`middleware/fileValidation.middleware.js`**
   - Validation MIME type réel
   - Validation structure PDF
   - Sanitization des noms

2. **`utils/secureStorage.js`**
   - Service de stockage sécurisé
   - Génération de noms aléatoires
   - Organisation par date

3. **`middleware/fileCleanup.middleware.js`**
   - Nettoyage automatique après traitement

4. **`utils/fileCleanupScheduler.js`**
   - Planification du nettoyage automatique

## 🔗 Nouvelles Routes

### Route Protégée pour les Fichiers

**Endpoint :** `GET /api/documents/file/:path`

**Description :** Remplace le serveur statique pour servir les documents avec contrôle d'accès.

**Exemple :**
```
GET /api/documents/file/2024/01/abc123-def456.pdf
```

**Headers requis :**
- `Authorization: Bearer <token>`

**Réponses :**
- `200` : Fichier PDF
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Fichier introuvable

## ⚠️ Points d'Attention

### Migration des Fichiers Existants

Les fichiers existants continuent de fonctionner, mais :

1. **Nouveaux uploads** utilisent le nouveau système sécurisé
2. **Anciens fichiers** restent accessibles via l'ancien système (pour compatibilité)
3. **Recommandation** : Migrer progressivement les anciens fichiers vers le nouveau système

### URLs des Documents

**Avant :**
```
/uploads/documents/document-1234567890-987654321.pdf
```

**Après :**
```
/api/documents/file/2024/01/abc123def456-xyz789.pdf
```

⚠️ **Important** : Les URLs ont changé. Mettez à jour le frontend pour utiliser les nouvelles URLs.

### Compatibilité

- ✅ Les anciens documents continuent de fonctionner
- ✅ Les nouveaux documents utilisent le système sécurisé
- ✅ Pas de breaking changes pour les APIs existantes

## 🧪 Tests à Effectuer

1. **Upload de document**
   ```bash
   POST /api/documents
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   
   file: <fichier.pdf>
   ownerOrgId: <id>
   demandeCode: <code>
   ```

2. **Upload de traduction**
   ```bash
   POST /api/documents/:id/traduire-upload
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   
   file: <fichier.pdf>
   ```

3. **Accès au fichier**
   ```bash
   GET /api/documents/file/:path
   Authorization: Bearer <token>
   ```

4. **Vérification du rate limiting**
   - Essayer d'uploader plus de 10 fichiers en 15 minutes
   - Vérifier que la limite est appliquée

## 📊 Monitoring

### Logs à Surveiller

1. **Uploads réussis**
   - Action: `DOCUMENT_CREATED`
   - Action: `DOCUMENT_TRANSLATED_UPLOADED`

2. **Accès aux fichiers**
   - Action: `DOCUMENT_FILE_ACCESSED`

3. **Erreurs de validation**
   - Code: `FILE_VALIDATION_ERROR`
   - Code: `INVALID_FILE_TYPE`

4. **Rate limiting**
   - Code: `RATE_LIMIT_EXCEEDED`
   - Code: `QUOTA_EXCEEDED`

### Métriques

- Nombre d'uploads par jour
- Taux d'erreur de validation
- Nombre de fichiers nettoyés automatiquement
- Taux de rate limiting

## 🔧 Configuration

### Variables d'Environnement

Aucune nouvelle variable d'environnement requise. Les valeurs par défaut sont :
- Taille max : 5MB
- Quota quotidien : 50 fichiers
- Rate limit : 10 uploads / 15 minutes

### Personnalisation

Pour modifier les limites, éditez :
- `middleware/fileValidation.middleware.js` : `MAX_FILES_PER_USER`
- `routes/document.routes.js` : `uploadLimiter` max
- `utils/fileCleanupScheduler.js` : Heures de rétention

## 🚀 Déploiement

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Vérifier la configuration**
   - Vérifier que les répertoires `uploads/` et `temp/` existent
   - Vérifier les permissions d'écriture

3. **Tester en local**
   - Tester l'upload d'un document
   - Tester l'accès à un fichier
   - Vérifier le rate limiting

4. **Déployer**
   - Les changements sont rétrocompatibles
   - Pas de migration de base de données requise

## 📝 Notes Importantes

1. **Sécurité** : Les fichiers ne sont plus accessibles publiquement
2. **Performance** : Le contrôle d'accès ajoute une vérification DB à chaque requête
3. **Stockage** : Les fichiers sont organisés par date pour faciliter la maintenance
4. **Nettoyage** : Le nettoyage automatique s'exécute tous les jours à 2h du matin

## 🆘 Support

En cas de problème :
1. Vérifier les logs du serveur
2. Vérifier les permissions des répertoires
3. Vérifier que node-cron est installé
4. Vérifier que les middlewares sont correctement appliqués

