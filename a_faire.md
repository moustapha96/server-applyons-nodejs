Parfait — j’ai bien pris connaissance de ton schéma Prisma “applyons”. Il est propre et assez complet pour bâtir les services et le frontend. Voici un **audit rapide**, puis une **proposition d’API** (backend) + **stubs côté frontend** que tu pourras brancher tout de suite.

---

# ✅ Audit rapide du schéma

* **Clés/relations**: tout est cohérent (IDs en `String @default(cuid())`). Tu éviteras l’erreur “uuid vs text” vue précédemment.
* **Index utiles**: présents sur `User.role`, `User.organizationId`, `DemandePartage.(targetOrgId, assignedOrgId, dateDemande, code)`, `Abonnement.dateExpiration`, etc. 👍
* **Unicités**:

  * `Transaction.demandePartageId` est `@unique` ⇒ 1 transaction par demande. OK si c’est la règle métier.
  * `Payment.transactionId` et `Payment.demandePartageId` sont `@unique` ⇒ un paiement rattaché à *soit* une transaction *soit* une demande. Ça cadre avec des flux distincts (frais dossier vs abonnement).
* **Permissions**: modèle souple par `Permission[]` (sans enum de rôles). On pourra “mapper” un profil (UserProfileType) à un set de permissions au seed.
* **Domaines éducation**: `Department` & `Filiere` avec `@@unique([organizationId, name])` ⇒ parfait pour éviter doublons.
* **Partage de documents**: `DemandePartage` + `DocumentPartage` bien séparés, avec “ownerOrg” et organisations cible/assignée (relations nommées). 👍

> Point d’attention: si tu veux autoriser **plusieurs transactions** (paiements partiels), enlève `@unique` sur `Transaction.demandePartageId` et adapte les services.

---

# 🔌 Design API (backend Express + Prisma)

## Conventions

* **Pagination**: `?page=1&limit=20` ⇒ `skip=(page-1)*limit`, `take=limit`.
* **Filtrage**: via query params (ex: `status`, `orgId`, `search`).
* **Tri**: `?sort=createdAt&order=desc`.
* **Sécurité**: middleware `requireAuth`, `requirePermissions(...keys)`.
* **Sélecteurs**: utiliser `select`/`include` pour limiter la charge.

## Endpoints essentiels (extraits)

### Auth & Users

* `POST /api/auth/register` (profil DEMANDEUR par défaut)
* `POST /api/auth/login`
* `GET /api/users` (admin/superviseur) — filtres: `role`, `orgId`, `search`
* `GET /api/users/:id`
* `PATCH /api/users/:id`
* `PATCH /api/users/:id/permissions` (set/connect/disconnect)
* `PATCH /api/users/:id/organization` (assignation org)
* `PATCH /api/users/:id/status` (enabled/disabled)

**Service (exemple)**


### Organizations / Departments / Filieres

* `GET /api/organizations` (filters: `type`, `search`)

* `POST /api/organizations`

* `GET /api/organizations/:id`

* `PATCH /api/organizations/:id`

* `GET /api/organizations/:orgId/departments`

* `POST /api/organizations/:orgId/departments`

* `PATCH /api/departments/:id`

* `DELETE /api/departments/:id`

* `GET /api/departments/:deptId/filieres`

* `POST /api/departments/:deptId/filieres`

* `PATCH /api/filieres/:id`

* `DELETE /api/filieres/:id`

### Demandes & Documents

* `GET /api/demandes` filtres: `targetOrgId`, `assignedOrgId`, `status`, `code`, `dateFrom`, `dateTo`, `search`
* `POST /api/demandes` (création côté DEMANDEUR ou agent)
* `GET /api/demandes/:id` (include documents, transaction, payment)
* `PATCH /api/demandes/:id` (status/assignment/metadata)
* `POST /api/demandes/:id/documents` (upload/enregistrement URLs)
* `PATCH /api/documents/:id` (marquer `estTraduit`, `urlTraduit`, clés de chiffrement, etc.)


### Transactions & Payments

* `POST /api/demandes/:id/transaction` (init)
* `PATCH /api/transactions/:id/status` (`PENDING`→`SUCCESS|FAILED|CANCELED`)
* `POST /api/transactions/:id/payment` (enregistre retour provider)
* `GET /api/payments` (filtres: `status`, `provider`, `date range`)
* `PATCH /api/payments/:id` (mise à jour status/meta si webhook)

### Abonnements

* `GET /api/abonnements?organizationId=...`
* `POST /api/abonnements`
* `PATCH /api/abonnements/:id`
* `GET /api/abonnements/actifs?before=YYYY-MM-DD` (surveillance d’expiration)

### Permissions

* `GET /api/permissions`
* `POST /api/permissions` (seed/ajout)
* `PATCH /api/permissions/:id` (renommer/description)

### Invitations d’organisation

* `POST /api/org-invites` (création, génère `token`)
* `POST /api/org-invites/accept` (avec `token`)
* `GET /api/org-invites?status=...`

### Configuration / Contact

* `GET /api/config`
* `PATCH /api/config/:key`
* `POST /api/contact-messages`

---

# 🧪 Middleware rapide

```js
// middlewares/authz.js
const requirePermissions = (...keys) => (req, res, next) => {
  const userPerms = (req.user?.permissions || []).map(p => p.key);
  const ok = keys.every(k => userPerms.includes(k));
  if (!ok) return res.status(403).json({ error: 'Forbidden' });
  next();
};
```

---

# 🧰 Seed minimal (permissions + super admin)

```js
// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const PERMS = [
  { key:'users.read', name:'Lire utilisateurs' },
  { key:'users.write', name:'Éditer utilisateurs' },
  { key:'org.read', name:'Lire organisations' },
  { key:'org.write', name:'Éditer organisations' },
  { key:'departements.manage', name:'Gérer départements/filières' },
  { key:'demandes.manage', name:'Gérer demandes' },
  { key:'documents.manage', name:'Gérer documents' },
  { key:'payments.manage', name:'Gérer paiements' },
  { key:'abonnements.manage', name:'Gérer abonnements' },
  { key:'config.manage', name:'Gérer configuration' },
];

async function main() {
  await prisma.permission.createMany({
    data: PERMS, skipDuplicates: true
  });

  const org = await prisma.organization.upsert({
    where: { slug: 'applyons' },
    update: {},
    create: { name:'Applyons', slug:'applyons', type:'ENTREPRISE', country:'SN' },
  });

  const pwd = await bcrypt.hash('Admin@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email:'super.admin@applyons.test' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'super.admin@applyons.test',
      passwordHash: pwd,
      role: 'SUPERVISEUR',
      organizationId: org.id,
    }
  });

  // connect all permissions to super admin
  const perms = await prisma.permission.findMany({ select:{ id:true }});
  await prisma.user.update({
    where: { id: superAdmin.id },
    data: { permissions: { set: [], connect: perms.map(p=>({ id:p.id })) } }
  });

  console.log('Seed OK');
}
main().finally(()=>prisma.$disconnect());
```



---

# 🧩 Services Frontend (React/Vite) — stubs

Assumons un `HttpClient` déjà configuré (headers JWT, baseURL).

```js
// src/services/userService.js
import { HttpClient } from '../helpers';
const base = '/api/users';

export const getUsers = (params) => HttpClient.get(base, { params }).then(r=>r.data);
export const getUser  = (id) => HttpClient.get(`${base}/${id}`).then(r=>r.data);
export const updateUser = (id, payload) => HttpClient.patch(`${base}/${id}`, payload).then(r=>r.data);
export const setUserPermissions = (id, keys) => HttpClient.patch(`${base}/${id}/permissions`, { keys }).then(r=>r.data);
export const setUserOrganization = (id, organizationId) => HttpClient.patch(`${base}/${id}/organization`, { organizationId }).then(r=>r.data);
export const setUserStatus = (id, enabled) => HttpClient.patch(`${base}/${id}/status`, { enabled }).then(r=>r.data);
```

```js
// src/services/orgService.js
import { HttpClient } from '../helpers';
export const listOrgs = (params) => HttpClient.get('/api/organizations', { params }).then(r=>r.data);
export const getOrg   = (id) => HttpClient.get(`/api/organizations/${id}`).then(r=>r.data);
export const createOrg = (payload) => HttpClient.post('/api/organizations', payload).then(r=>r.data);
export const updateOrg = (id, payload) => HttpClient.patch(`/api/organizations/${id}`, payload).then(r=>r.data);

export const listDepartments = (orgId) => HttpClient.get(`/api/organizations/${orgId}/departments`).then(r=>r.data);
export const createDepartment = (orgId, payload) => HttpClient.post(`/api/organizations/${orgId}/departments`, payload).then(r=>r.data);
export const updateDepartment = (id, payload) => HttpClient.patch(`/api/departments/${id}`, payload).then(r=>r.data);
export const deleteDepartment = (id) => HttpClient.delete(`/api/departments/${id}`).then(r=>r.data);

export const listFilieres = (deptId) => HttpClient.get(`/api/departments/${deptId}/filieres`).then(r=>r.data);
export const createFiliere = (deptId, payload) => HttpClient.post(`/api/departments/${deptId}/filieres`, payload).then(r=>r.data);
export const updateFiliere = (id, payload) => HttpClient.patch(`/api/filieres/${id}`, payload).then(r=>r.data);
export const deleteFiliere = (id) => HttpClient.delete(`/api/filieres/${id}`).then(r=>r.data);
```

```js
// src/services/demandeService.js
import { HttpClient } from '../helpers';
const base = '/api/demandes';

export const getDemandes = (params) => HttpClient.get(base, { params }).then(r=>r.data);
export const getDemande = (id) => HttpClient.get(`${base}/${id}`).then(r=>r.data);
export const createDemande = (payload) => HttpClient.post(base, payload).then(r=>r.data);
export const updateDemande = (id, payload) => HttpClient.patch(`${base}/${id}`, payload).then(r=>r.data);

export const addDocument = (demandeId, doc) => HttpClient.post(`${base}/${demandeId}/documents`, doc).then(r=>r.data);
export const updateDocument = (docId, payload) => HttpClient.patch(`/api/documents/${docId}`, payload).then(r=>r.data);
```

```js
// src/services/paymentService.js
import { HttpClient } from '../helpers';
export const initTransaction = (demandeId, payload) => HttpClient.post(`/api/demandes/${demandeId}/transaction`, payload).then(r=>r.data);
export const updateTransactionStatus = (id, statut) => HttpClient.patch(`/api/transactions/${id}/status`, { statut }).then(r=>r.data);
export const attachPayment = (transactionId, payload) => HttpClient.post(`/api/transactions/${transactionId}/payment`, payload).then(r=>r.data);
export const listPayments = (params) => HttpClient.get('/api/payments', { params }).then(r=>r.data);
```

```js
// src/services/abonnementService.js
import { HttpClient } from '../helpers';
export const listAbonnements = (params) => HttpClient.get('/api/abonnements', { params }).then(r=>r.data);
export const createAbonnement = (payload) => HttpClient.post('/api/abonnements', payload).then(r=>r.data);
export const updateAbonnement = (id, payload) => HttpClient.patch(`/api/abonnements/${id}`, payload).then(r=>r.data);
```

```js
// src/services/configService.js
import { HttpClient } from '../helpers';
export const getConfigurations = () => HttpClient.get('/api/config').then(r=>r.data);
export const updateConfiguration = (key, value) => HttpClient.patch(`/api/config/${key}`, { value }).then(r=>r.data);
```

---

# ▶️ Suite proposée

1. Je te fournis au prochain message les **routes Express** prêtes à coller (users, departments/filieres, demandes), avec middlewares et validations (Zod/Joi si tu veux).
2. On branche ensuite tes pages React (tables Ant Design) sur ces services, avec **pagination serveur**, filtres, tri, et **tags de statut** (demandes/transactions).

Si tu veux, je commence par **Users** + **Departments/Filieres** (routes + contrôleurs) en version TypeScript ou JS — tu préfères lequel ?
