# Guide d'Envoi d'Emails avec Pièces Jointes

Ce guide explique comment utiliser l'endpoint `/api/users/send-mail` pour envoyer des emails avec des pièces jointes.

## 📋 Endpoint

**POST** `/api/users/send-mail`

**Authentification** : Requise (Bearer Token)
**Permission** : `users.manage`

## 📤 Méthodes d'Envoi de Fichiers

### 1. Upload via Multipart/Form-Data (Recommandé)

Envoyez les fichiers directement via le formulaire multipart :

```javascript
const formData = new FormData();
formData.append('to', 'user@example.com');
formData.append('subject', 'Email avec pièces jointes');
formData.append('html', '<p>Voici votre document</p>');
formData.append('files', file1); // Fichier 1
formData.append('files', file2); // Fichier 2
// ... jusqu'à 10 fichiers

fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

**Limites** :
- Maximum **10 fichiers** par email
- Maximum **25MB** par fichier
- Types acceptés : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP, RAR, Images (JPG, PNG, GIF, BMP, SVG, WEBP), Vidéos (MP4, AVI, MOV, WMV, FLV), Audio (MP3)

### 2. Fichiers en Base64 (JSON)

Envoyez les fichiers encodés en base64 dans le body JSON :

```javascript
const attachments = [
    {
        filename: 'document.pdf',
        content: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMy...', // Base64 avec préfixe data URI
        contentType: 'application/pdf'
    },
    {
        filename: 'image.jpg',
        content: 'iVBORw0KGgoAAAANSUhEUgAA...', // Base64 simple
        contentType: 'image/jpeg'
    }
];

fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Email avec pièces jointes',
        html: '<p>Voici vos documents</p>',
        attachments: attachments
    })
});
```

### 3. Fichiers depuis le Serveur (Path)

Référencez des fichiers déjà présents sur le serveur :

```javascript
fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Email avec pièces jointes',
        html: '<p>Voici vos documents</p>',
        attachments: [
            {
                filename: 'rapport.pdf',
                path: 'uploads/documents/rapport-123.pdf', // Chemin relatif
                contentType: 'application/pdf'
            },
            {
                filename: 'logo.png',
                path: '/absolute/path/to/logo.png', // Chemin absolu
                contentType: 'image/png'
            }
        ]
    })
});
```

### 4. Fichiers depuis URL

Téléchargez automatiquement les fichiers depuis une URL :

```javascript
fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Email avec pièces jointes',
        html: '<p>Voici vos documents</p>',
        attachments: [
            {
                filename: 'document.pdf',
                url: 'https://example.com/files/document.pdf',
                contentType: 'application/pdf' // Optionnel, détecté automatiquement
            }
        ]
    })
});
```

## 📝 Exemples Complets

### Exemple 1 : Email avec Template + Fichiers Uploadés

```javascript
const formData = new FormData();
formData.append('to', 'user@example.com');
formData.append('templateName', 'generic-notification');
formData.append('subject', 'Notification importante');
formData.append('context', JSON.stringify({
    message: 'Veuillez trouver ci-joint les documents demandés.',
    userName: 'John Doe'
}));
formData.append('files', pdfFile);
formData.append('files', imageFile);

fetch('/api/users/send-mail', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
});
```

### Exemple 2 : Email Raw HTML avec Base64

```javascript
const pdfBase64 = await fileToBase64(pdfFile);

fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Document important',
        html: '<h1>Bonjour</h1><p>Veuillez trouver le document ci-joint.</p>',
        attachments: [{
            filename: 'document.pdf',
            content: pdfBase64,
            contentType: 'application/pdf'
        }]
    })
});
```

### Exemple 3 : Email avec CC, BCC et Reply-To

```javascript
const formData = new FormData();
formData.append('to', 'user@example.com,user2@example.com');
formData.append('cc', 'manager@example.com');
formData.append('bcc', 'archive@example.com');
formData.append('replyTo', 'support@example.com');
formData.append('subject', 'Email avec copies');
formData.append('html', '<p>Message important</p>');
formData.append('files', documentFile);

fetch('/api/users/send-mail', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
});
```

### Exemple 4 : Notification aux Admins

```javascript
fetch('/api/users/send-mail', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Confirmation',
        html: '<p>Votre demande a été traitée.</p>',
        notifyAdmins: true,
        adminEmails: ['admin1@example.com', 'admin2@example.com'],
        attachments: [{
            filename: 'rapport.pdf',
            path: 'uploads/reports/rapport-2025.pdf'
        }]
    })
});
```

## 🔧 Format des Attachments

Chaque pièce jointe peut être fournie dans l'un des formats suivants :

### Format 1 : Base64 avec Data URI
```javascript
{
    filename: 'document.pdf',
    content: 'data:application/pdf;base64,JVBERi0xLjQK...',
    contentType: 'application/pdf' // Optionnel
}
```

### Format 2 : Base64 Simple
```javascript
{
    filename: 'document.pdf',
    content: 'JVBERi0xLjQKJeLjz9MKMy...', // Base64 sans préfixe
    contentType: 'application/pdf'
}
```

### Format 3 : Path (Serveur)
```javascript
{
    filename: 'document.pdf',
    path: 'uploads/documents/file.pdf', // Relatif ou absolu
    contentType: 'application/pdf' // Optionnel
}
```

### Format 4 : URL
```javascript
{
    filename: 'document.pdf',
    url: 'https://example.com/files/document.pdf',
    contentType: 'application/pdf' // Optionnel, détecté automatiquement
}
```

### Format 5 : Buffer (Node.js uniquement)
```javascript
{
    filename: 'document.pdf',
    content: Buffer.from(...), // Buffer Node.js
    contentType: 'application/pdf'
}
```

## ⚙️ Paramètres de la Requête

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `to` | string/array | ✅ | Email(s) destinataire(s) |
| `subject` | string | ✅ | Sujet de l'email |
| `templateName` | string | ⚠️* | Nom du template (mode template) |
| `html` | string | ⚠️* | Contenu HTML (mode raw) |
| `text` | string | ⚠️* | Contenu texte (mode raw) |
| `context` | object/string | ❌ | Contexte JSON pour le template |
| `cc` | string/array | ❌ | Email(s) en copie |
| `bcc` | string/array | ❌ | Email(s) en copie cachée |
| `replyTo` | string | ❌ | Email de réponse |
| `attachments` | array | ❌ | Pièces jointes (JSON) |
| `files` | File[] | ❌ | Fichiers uploadés (multipart) |
| `notifyAdmins` | boolean | ❌ | Notifier les admins (défaut: false) |
| `adminEmails` | string/array | ❌ | Emails admin personnalisés |
| `createAudit` | boolean | ❌ | Créer un log d'audit (défaut: true) |

\* **Mode Template** : `templateName` + `subject` requis  
\* **Mode Raw** : `html` OU `text` requis

## 📊 Réponse

### Succès (200)
```json
{
    "message": "Emails envoyés avec succès",
    "results": [
        {
            "scope": "main",
            "status": "success",
            "info": {
                "messageId": "...",
                "accepted": ["user@example.com"],
                "rejected": []
            }
        },
        {
            "scope": "admins",
            "status": "success",
            "info": [...]
        }
    ]
}
```

### Erreur (400/500)
```json
{
    "message": "Échec de l'envoi des emails",
    "code": "MAIL_SEND_ERROR",
    "error": "Description de l'erreur"
}
```

## ⚠️ Notes Importantes

1. **Taille des fichiers** : Maximum 25MB par fichier, 10 fichiers maximum
2. **Types de fichiers** : Vérifiez que le type est autorisé avant l'envoi
3. **Fichiers temporaires** : Les fichiers uploadés sont stockés dans `uploads/email-attachments/` et ne sont pas supprimés automatiquement (à nettoyer périodiquement)
4. **Performance** : Pour de gros fichiers, privilégiez les URLs ou les paths serveur plutôt que le base64
5. **Sécurité** : Validez toujours les fichiers côté client avant l'envoi

## 🧹 Nettoyage des Fichiers Temporaires

Les fichiers uploadés sont stockés dans `uploads/email-attachments/`. Vous pouvez créer un script de nettoyage périodique :

```javascript
// scripts/cleanup-email-attachments.js
const fs = require('fs').promises;
const path = require('path');

async function cleanupOldAttachments() {
    const dir = 'uploads/email-attachments';
    const files = await fs.readdir(dir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > maxAge) {
            await fs.unlink(filePath);
            console.log(`Supprimé: ${file}`);
        }
    }
}
```

