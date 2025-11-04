# RIAFCO Backoffice Management System

Un système de gestion backoffice complet pour RIAFCO (Réseau International des Associations Francophones de Comptables et d'Organisations).

## 🚀 Fonctionnalités

### Modules Principaux
- **Gestion des Utilisateurs** - CRUD complet avec rôles et permissions
- **Gestion des Activités** - Création et gestion des activités avec upload d'images
- **Gestion des Événements** - Calendrier d'événements avec inscriptions
- **Gestion des Actualités** - Système de news et newsletter
- **Gestion des Ressources** - Bibliothèque de documents et fichiers
- **Gestion des Partenaires** - Fiches des bureaux IFCL
- **Gestion de l'Historique** - Timeline interactive
- **Gestion des Pays Membres** - Carte interactive des pays membres
- **Tableau de Bord** - Statistiques et aperçu global

### Sécurité
- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Gestion des rôles (Admin, Modérateur, Membre, Invité)
- Middleware d'authentification
- Protection CORS

## 🛠️ Technologies

- **Backend**: Node.js + Express.js
- **Base de données**: PostgreSQL + Prisma ORM
- **Authentification**: JWT + bcrypt
- **Upload de fichiers**: Multer + Sharp
- **Email**: Nodemailer

## 📦 Installation

1. **Cloner le projet**
\`\`\`bash
git clone <repository-url>
cd riafco-backoffice
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
npm install
\`\`\`

3. **Configuration de l'environnement**
\`\`\`bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
\`\`\`

4. **Configuration de la base de données**
\`\`\`bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Peupler la base de données
npm run db:seed
\`\`\`

5. **Démarrer le serveur**
\`\`\`bash
# Mode développement
npm run dev

# Mode production
npm start
\`\`\`

## 🗄️ Structure de la Base de Données

### Modèles Principaux
- **User** - Utilisateurs avec rôles et permissions
- **Activity** - Activités de l'organisation
- **Event** - Événements avec inscriptions
- **News** - Actualités et articles
- **Resource** - Ressources et documents
- **Partner** - Partenaires et bureaux IFCL
- **HistoryItem** - Éléments historiques
- **MemberCountry** - Pays membres
- **SiteSettings** - Paramètres généraux

## 🔐 Authentification

### Comptes par défaut
- **Admin**: admin@riafco.org / admin123
- **Modérateur**: moderator@riafco.org / moderator123

### Rôles et Permissions
- **ADMIN** - Accès complet à toutes les fonctionnalités
- **SUPER_ADMIN** - Gestion des contenus Super admin
- **MEMBER** - Accès limité (profil, participation aux discussions)
- **GUEST** - Lecture seule

## 📁 Structure du Projet

\`\`\`
riafco-backoffice/
├── config/
│   └── db.js                 # Configuration Prisma
├── controllers/              # Contrôleurs
├── middleware/              # Middlewares
├── models/                  # Modèles de données
├── routes/                  # Routes API
├── uploads/                 # Fichiers uploadés
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── seed.js             # Données de test
├── server.js               # Point d'entrée
└── package.json
\`\`\`

## 🔧 Scripts Disponibles

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Appliquer le schéma à la DB
- `npm run db:migrate` - Créer une migration
- `npm run db:seed` - Peupler la base de données

## 📝 API Endpoints

### Authentification
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur
- `PATCH /api/users/follow/:id` - Suivre un utilisateur
- `PATCH /api/users/unfollow/:id` - Ne plus suivre

### Posts
- `GET /api/posts` - Liste des posts
- `POST /api/posts` - Créer un post
- `PUT /api/posts/:id` - Modifier un post
- `DELETE /api/posts/:id` - Supprimer un post

### Activités
- `GET /api/activities` - Liste des activités
- `POST /api/activities` - Créer une activité
- `PUT /api/activities/:id` - Modifier une activité
- `DELETE /api/activities/:id` - Supprimer une activité

## 🚀 Déploiement

1. Configurer les variables d'environnement de production
2. Construire l'application
3. Déployer sur votre serveur (Heroku, DigitalOcean, etc.)
4. Configurer la base de données PostgreSQL
5. Exécuter les migrations

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support, contactez l'équipe RIAFCO à contact@riafco.org




    // Envoyer des notifications aux participants si demandé
    // if (notifyParticipants && existingEvent.registrations.length > 0) {
    //   try {
    //     const emailPromises = existingEvent.registrations.map((registration) =>
    //       emailService.sendEmail({
    //         to: registration.email,
    //         subject: `Event Update: ${updatedEvent.title}`,
    //         html: `
    //           <h2>Event Update</h2>
    //           <p>Hello ${registration.name},</p>
    //           <p>The event "${updatedEvent.title}" has been updated.</p>
    //           <p>Please check the latest details and mark your calendar accordingly.</p>
    //           <p>Best regards,<br>The RIAFCO Team</p>
    //         `,
    //         text: `Event Update: ${updatedEvent.title} has been updated. Please check the latest details.`,
    //       }),
    //     );
    //     await Promise.allSettled(emailPromises);
    //   } catch (emailError) {
    //     console.error("Failed to send event update notifications:", emailError);
    //   }
    // }


    
Poussez la base de données

npx prisma db push
npx prisma db push --force-reset
npx prisma generate       



lien de desacbonnement sur la partie web
<a href="${process.env.FRONTEND_URL}/news/${newsletter.id}/unsubscribe?email=${subscriber.email}">Unsubscribe</a>



npx widdershins http://localhost:5000/openapi.json -o .\docs\api.md

npx md-to-pdf .\docs\api.md --dest .\docs\api.pdf



✅ Organizations: {
  'applyons-hq': 'cmg2lp673000t9vbk4tw0tz42',
  'universite-demo': 'cmg2lp67e000u9vbk8mpz4znf',
  'lycee-modele': 'cmg2lp67g000v9vbkkus4r557',
  'college-pilote': 'cmg2lp67i000w9vbky5wag96r',
  'banque-partenaire': 'cmg2lp67j000x9vbkjzwf7vbt',
  'agence-traduction-demo': 'cmg2lp67l000y9vbkfijc681f'
}

👤 admin@applyons.com [ADMIN] OK
👤 superviseur@applyons.com [SUPERVISEUR] OK
👤 institut@applyons.com [INSTITUT] OK
👤 traducteur@applyons.com [TRADUCTEUR] OK
👤 demandeur@applyons.com [DEMANDEUR] OK
🎉 Seed terminé. Mot de passe par défaut: Password123!