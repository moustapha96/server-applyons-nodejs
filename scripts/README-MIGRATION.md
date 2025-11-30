# Guide de Migration de Base de Données

Ce guide explique comment exporter les données de votre base de développement et les importer dans votre base de production.

## 📋 Prérequis

1. **Base de données source** (développement) : accessible via `DATABASE_URL` dans votre `.env`
2. **Base de données destination** (production) : URL de connexion à votre base de production
3. **Node.js** et les dépendances installées (`npm install`)

## 🚀 Étapes de Migration

### Étape 1 : Exporter les données de la base source

```bash
# Export avec nom de fichier automatique
npm run db:export

# Ou avec un nom de fichier personnalisé
node scripts/export-database.js exports/mon-export.json
```

Le script va :
- ✅ Exporter toutes les tables dans l'ordre correct (respect des dépendances)
- ✅ Créer un fichier JSON avec toutes les données
- ✅ Afficher des statistiques sur les données exportées

**Fichier généré** : `scripts/exports/export-YYYY-MM-DDTHH-MM-SS.json`

### Étape 2 : Préparer l'import en production

1. **Copier le fichier d'export** sur votre serveur de production
2. **Configurer la variable d'environnement** pour pointer vers la base de production :

```bash
# Sur votre serveur de production
export DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

Ou créer/modifier un fichier `.env.production` :

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

### Étape 3 : Tester l'import (mode dry-run)

**⚠️ IMPORTANT** : Testez d'abord en mode dry-run pour voir ce qui serait importé sans modifier la base :

```bash
node scripts/import-database.js exports/mon-export.json --dry-run
```

Cela affichera :
- 📊 Le nombre d'enregistrements qui seraient importés
- ⚠️ Les éventuels conflits (doublons)
- ❌ Les erreurs potentielles

### Étape 4 : Importer les données en production

Une fois le test validé, lancez l'import réel :

```bash
# Import complet
npm run db:import exports/mon-export.json

# Ou directement
node scripts/import-database.js exports/mon-export.json
```

**Options disponibles** :
- `--dry-run` : Mode test (aucune modification)
- `--skip-audit` : Ignore les logs d'audit lors de l'import

## 📊 Ordre d'Import

Le script importe les données dans l'ordre suivant pour respecter les dépendances :

1. **Permissions** (pas de dépendances)
2. **Organizations** (pas de dépendances)
3. **Users** (dépend de Organization et Permission)
4. **Departments** (dépend de Organization)
5. **Filieres** (dépend de Department)
6. **OrganizationInvites** (dépend de Organization)
7. **DemandePartages** (dépend de User et Organization)
8. **DocumentPartages** (dépend de DemandePartage et Organization)
9. **BlockchainBlocks** (dépend de DocumentPartage)
10. **Abonnements** (dépend de Organization)
11. **Transactions** (dépend de DemandePartage et User)
12. **Payments** (dépend de Transaction, DemandePartage, Abonnement)
13. **ContactMessages** (pas de dépendances)
14. **Configurations** (pas de dépendances)
15. **SiteSettings** (pas de dépendances)
16. **AuditLogs** (dépend de User, optionnel)

## 🔄 Gestion des Conflits

Le script utilise `upsert` pour gérer les conflits :
- ✅ Si un enregistrement existe déjà (même clé unique), il sera **mis à jour**
- ✅ Si un enregistrement n'existe pas, il sera **créé**
- ⚠️ Les enregistrements en conflit sont comptabilisés comme "ignorés"

## ⚠️ Points d'Attention

1. **Mots de passe** : Les `passwordHash` sont exportés tels quels. Les utilisateurs devront utiliser leurs mots de passe existants ou les réinitialiser.

2. **IDs** : Les IDs (CUID) sont préservés lors de l'import pour maintenir les relations.

3. **Dates** : Les dates `createdAt` et `updatedAt` sont préservées depuis l'export.

4. **Relations Many-to-Many** : 
   - Les permissions des utilisateurs sont exportées/importées correctement
   - Les relations sont reconstruites automatiquement

5. **Fichiers uploadés** : 
   - ⚠️ Les fichiers dans `uploads/` ne sont **PAS** exportés
   - Vous devrez copier manuellement le dossier `uploads/` vers la production

6. **Base de production** : 
   - Assurez-vous que le schéma Prisma est à jour (`npx prisma db push`)
   - Vérifiez que toutes les migrations sont appliquées

## 📝 Exemple Complet

```bash
# 1. Sur votre machine de développement
npm run db:export
# → Crée: scripts/exports/export-2025-01-15T10-30-00.json

# 2. Copier le fichier vers la production
scp scripts/exports/export-2025-01-15T10-30-00.json user@production:/path/to/app/

# 3. Sur le serveur de production
cd /path/to/app
export DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/prod_db"

# 4. Tester l'import
node scripts/import-database.js export-2025-01-15T10-30-00.json --dry-run

# 5. Importer réellement
node scripts/import-database.js export-2025-01-15T10-30-00.json
```

## 🆘 Dépannage

### Erreur : "Unique constraint violation"
- Normal si des données existent déjà
- Le script ignore les doublons et continue

### Erreur : "Foreign key constraint"
- Vérifiez que l'ordre d'import est respecté
- Vérifiez que les tables parentes existent

### Erreur : "Connection refused"
- Vérifiez votre `DATABASE_URL`
- Vérifiez que la base de production est accessible

### Import partiel
- Le script continue même en cas d'erreurs
- Consultez les statistiques à la fin pour voir ce qui a été importé

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du script
2. La connexion à la base de données
3. Le format du fichier d'export
4. Les permissions de la base de données

