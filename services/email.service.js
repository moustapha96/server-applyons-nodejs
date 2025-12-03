// services/email.service.js
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const crypto = require("crypto");

/* ===========================
   Configuration & Helpers
   =========================== */
const DEFAULT_SITE_NAME = "ApplyOns";
const DEFAULT_LOGO_URL = "https://admin.applyons.com/logo.png";
const DEFAULT_FROM_EMAIL = "noreply@applyons.com";
const DEFAULT_FROM_NAME = "ApplyOns Team";

function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function toAbsoluteUrl(p) {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    const base = (process.env.BACKEND_URL || "").replace(/\/+$/, "");
    const clean = String(p).replace(/^\/+/, "");
    return base ? `${base}/${clean}` : `/${clean}`;
}

/**
 * Gabarit HTML commun (header/logo, cadre, footer)
 * @param {Object} params
 * @param {string} params.siteName
 * @param {string} params.logoUrl
 * @param {string} params.title       // <title> du document
 * @param {string} params.heading     // titre visuel H2 dans le header
 * @param {string} params.contentHtml // HTML du contenu (déjà échappé si besoin)
 */
function buildEmailHtml({ siteName, logoUrl, title, heading, contentHtml }) {
    const safeSite = escapeHtml(siteName);
    const safeTitle = escapeHtml(title || heading || siteName || "Message");
    const safeHeading = escapeHtml(heading || "");
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${safeTitle}</title>
      <meta name="color-scheme" content="light only" />
      <style>
        body { margin:0; padding:0; background:#f7f8fb; color:#333; font-family:Arial, sans-serif; line-height:1.6; }
        .container { max-width:600px; margin:0 auto; padding:20px; }
        .card { background:#fff; border:1px solid #eee; border-radius:8px; box-shadow:0 1px 2px rgba(16,24,40,.04); overflow:hidden; }
        .header { text-align:center; padding:24px 20px; border-bottom:1px solid #eee; background:#fff; }
        .logo { max-width:150px; height:auto; display:block; margin:0 auto 8px; }
        h2 { margin:8px 0 0; font-size:20px; }
        .content { padding:20px; }
        .box { margin:16px 0; padding:14px; border-left:4px solid #1e81b0; background:#f1f7fb; border-radius:4px; }
        .footer { text-align:center; color:#777; font-size:12px; padding:16px; border-top:1px solid #eee; background:#fff; }
        a.btn { display:inline-block; background:#1e81b0; color:#fff !important; text-decoration:none; padding:12px 20px; border-radius:6px; font-weight:bold; margin-top:12px; }
        @media (max-width:620px){ .container{ padding:12px; } .content{ padding:16px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="display:none;opacity:0;max-height:0;overflow:hidden;">${safeTitle} - ${safeSite}</div>
        <div class="card">
          <div class="header">
            <img src="${escapeHtml(logoUrl)}" alt="${safeSite}" class="logo" />
            <h2>${safeHeading || safeTitle}</h2>
          </div>
          <div class="content">
            ${contentHtml}
            <p style="margin-top:16px;">Bien cordialement,<br><strong>L’équipe ${safeSite}</strong></p>
          </div>
          <div class="footer">© ${year} ${safeSite}. Tous droits réservés.</div>
        </div>
      </div>
    </body>
    </html>`;
}

/**
 * Construit un texte brut propre avec des lignes
 * @param {string[]} lines
 */
function buildText(lines = []) {
    return lines.filter(Boolean).join("\n\n");
}

/* ===========================
   Template Engine
   =========================== */
class TemplateEngine {
    constructor() {
        this.templatesDir = path.join(__dirname, "../templates/emails");
        this.partialsDir = path.join(__dirname, "../templates/partials");
        this.cache = new Map();
    }



    async setRequestContext(req, currentUserId = null) {
        this.requestIp = req.ip || null;
        this.requestUA = req.get("User-Agent") || null;
        this.currentUserId = currentUserId;
        return this;
    }

    async loadTemplate(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        const templatePath = path.join(this.templatesDir, `${name}.hbs`);
        const partials = await this.loadPartials();

        try {
            const content = await fs.readFile(templatePath, "utf-8");
            const template = handlebars.compile(content, { noEscape: true });
            this.cache.set(name, { template, partials });
            return { template, partials };
        } catch (err) {
            console.error(`Failed to load template ${name}:`, err);
            throw new Error(`Template ${name} not found`);
        }
    }

    async loadPartials() {
        const files = await fs.readdir(this.partialsDir);
        const partials = {};

        for (const file of files) {
            if (file.endsWith(".hbs")) {
                const name = path.basename(file, ".hbs");
                const content = await fs.readFile(path.join(this.partialsDir, file), "utf-8");
                partials[name] = content;
                handlebars.registerPartial(name, content);
            }
        }

        return partials;
    }

    async render(name, context = {}) {
        const { template, partials } = await this.loadTemplate(name);
        return template({
            ...context,
            escapeHtml,
            toAbsoluteUrl,
            siteName: context.siteName || DEFAULT_SITE_NAME,
            logoUrl: context.logoUrl || DEFAULT_LOGO_URL,
            currentYear: new Date().getFullYear(),
        });
    }
}

/* ===========================
   Email Service Class
   =========================== */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        this.templateEngine = new TemplateEngine();
        this.transporter.verify().then(
            () => console.log("✅ SMTP ready"),
            (err) => console.error("❌ SMTP error:", err)
        );
    }

    async getSiteSettings() {
        return {
            siteName: process.env.SITE_NAME || DEFAULT_SITE_NAME,
            siteUrl: process.env.FRONTEND_URL || "https://admin.applyons.com",
            logoUrl: process.env.LOGO_URL || DEFAULT_LOGO_URL,
            fromEmail: process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL,
            fromName: process.env.FROM_NAME || DEFAULT_FROM_NAME,
            contactEmail: process.env.CONTACT_EMAIL || "support@applyons.com",
        };
    }

    async sendEmail({ to, subject, html, text, attachments = [] }) {
        try {
            const settings = await this.getSiteSettings();
            const mailOptions = {
                from: `"${settings.fromName}" <${settings.fromEmail}>`,
                to,
                subject,
                html,
                text,
                attachments,
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log("✉️ Email sent:", result.messageId);
            return result;
        } catch (error) {
            console.error("❌ Email failed:", error);
            throw error;
        }
    }

    async sendEmailCC({ to, cc, bcc, replyTo, subject, html, text, attachments = [] }) {
        try {
            const settings = await this.getSiteSettings();
            const mailOptions = {
                from: `"${settings.fromName}" <${settings.fromEmail}>`,
                to,
                cc,
                bcc,
                replyTo,
                subject,
                html,
                text,
                attachments: Array.isArray(attachments) && attachments.length > 0 ? attachments : [],
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log("✉️ Email sent:", result.messageId, attachments.length > 0 ? `(${attachments.length} attachments)` : '');
            return result;
        } catch (error) {
            console.error("❌ Email failed:", error);
            throw error;
        }
    }


    /* ===========================
       Core Email Methods
       =========================== */
    async buildCommonEmail({ templateName, subject, context = {} }) {
        const settings = await this.getSiteSettings();
        const html = await this.templateEngine.render(templateName, {
            ...context,
            siteName: 'ApplyOns' || settings.siteName,
            logoUrl: 'https://admin.applyons.com/logo.png' || settings.logoUrl,
            siteUrl: 'https://admin.applyons.com' || settings.siteUrl,
        });

        const text = this.buildTextVersion(subject, context);

        return {
            subject: `[${settings.siteName}] ${subject}`,
            html,
            text,
        };
    }

    // à la place de buildTextVersion existante
    buildTextVersion(subject, context) {
        const lines = [
            subject,
            `Bonjour ${context.name || context.firstName || "Utilisateur"},`,
            ...(context.message ? [context.message] : []),
            ...(context.activationUrl ? [`Lien d'activation: ${context.activationUrl}`] : []),
            ...(context.resetUrl ? [`Réinitialisez votre mot de passe: ${context.resetUrl}`] : []),
            ...(context.expiresInHours ? [`Ce lien expire dans ${context.expiresInHours} heure(s).`] : []),
            ...(context.institutName ? [`Institut: ${context.institutName}`] : []),
            `Cordialement,`,
            `L'équipe ${context.siteName || "APPLYONS"}`,
        ];
        return lines.filter(Boolean).join("\n\n");
    }





    /* ===========================
       Business Email Methods
       =========================== */
    // 1. Activation Emails
    async sendAccountActivationEmail(user, activationToken) {
        const settings = await this.getSiteSettings();
        const activationUrl = `${settings.siteUrl}/auth/activate?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(activationToken)}`;

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "account-activation",
            subject: "Activation de votre compte",
            context: {
                name: user.username || user.email.split("@")[0],
                email: user.email,
                activationUrl,
                siteName: settings.siteName,
                logoUrl: settings.logoUrl,
            },
        });

        return this.sendEmail({ to: user.email, subject, html, text });
    }

    // 2. Abonnement Emails
    async sendAbonnementConfirmation(institut, abonnement) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "abonnement-confirmation",
            subject: "Confirmation de votre abonnement",
            context: {
                institutName: institut.name,
                montant: abonnement.montant,
                dateDebut: abonnement.dateDebut.toLocaleDateString("fr-FR"),
                dateExpiration: abonnement.dateExpiration.toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: institut.email,
            subject,
            html,
            text,
        });
    }

    // 3. Demande Partage Emails
    async sendDemandePartageNotification(institut, demandePartage) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "demande-partage-notification",
            subject: "Nouvelle demande de partage de documents",
            context: {
                institutName: institut.name,
                demandeCode: demandePartage.code,
                demandeurName: demandePartage.demandeur.name || "Demandeur inconnu",
                documents: demandePartage.documentPartages || [],
            },
        });

        return this.sendEmail({
            to: institut.email,
            subject,
            html,
            text,
        });
    }

    async sendConfirmationDemandePartageToDemandeur(demandePartage, demandeur, institut) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "confirmation-demande-partage-demandeur",
            subject: "Confirmation de votre demande de partage",
            context: {
                demandeurName: demandeur.name,
                institutName: institut.name,
                demandeCode: demandePartage.code,
                dateDemande: demandePartage.createdAt.toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    async sendConfirmationDemandePartageToInstitut(demandePartage, demandeur, institut) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "confirmation-demande-partage-institut",
            subject: "Nouvelle demande de partage reçue",
            context: {
                institutName: institut.name,
                demandeurName: demandeur.name,
                demandeCode: demandePartage.code,
                dateDemande: demandePartage.createdAt.toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: institut.email,
            subject,
            html,
            text,
        });
    }

    // 4. Document Emails
    async sendDocumentPartageNotification(institut, documentPartage) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "document-partage-notification",
            subject: "Nouveau document partagé",
            context: {
                institutName: institut.name,
                documentName: documentPartage.name || "Document sans nom",
                documentCode: documentPartage.codeAdn,
                demandeCode: documentPartage.demandePartage.code,
            },
        });

        return this.sendEmail({
            to: institut.email,
            subject,
            html,
            text,
        });
    }

    async sendDocumentVerificationNotification(documentPartage) {
        const demandeur = documentPartage.demandePartage.demandeur;
        const institut = documentPartage.institut;

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "document-verification-notification",
            subject: "Document vérifié avec succès",
            context: {
                demandeurName: demandeur.name || "Demandeur inconnu",
                institutName: institut.name || "Institut inconnu",
                documentName: documentPartage.name || "Document sans nom",
                documentCode: documentPartage.codeAdn,
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    // services/email.service.js (ou équivalent)
    async sendDocumentAddedNotificationToDemandeur(
        documentPartage,
        organisation,
        demandePartage,
        demandeur
    ) {
        // Petits gardes-fous
        const safe = (v, d = null) => (v === undefined || v === null || v === "" ? d : v);

        const dateAjout =
            documentPartage.createdAt instanceof Date ?
            documentPartage.createdAt.toLocaleString("fr-FR") :
            new Date().toLocaleString("fr-FR");

        const context = {
            // — Demandeur
            demandeurName: safe(demandeur.firstName + '' + demandeur.lastName, "Cher(ère) demandeur(se)"),
            // — Document
            codeDocument: safe(documentPartage.code),
            dateAjout,
            // — Organisme
            orgName: safe(organisation.name || organisation.label, "Organisme"),
            orgEmail: safe(organisation.email, null),
            orgPhone: safe(organisation.phone, null),
            // — Demande
            demandeCode: safe(demandePartage.code, null),
            // Lien vers la demande si tu as un front
            viewUrl: `${"https://admin.applyons.com"}/demandeur/mes-demandes/${demandePartage.id}/details`,
        };

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "document-added-to-demandeur",
            subject: "Nouveau document ajouté à votre demande",
            context,
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }


    async sendDocumentAddedNotificationToInstitut(documentPartage, institut, demandePartage) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "document-added-to-institut",
            subject: "Nouveau document ajouté à une demande",
            context: {
                institutName: institut.name,
                documentName: documentPartage.name || "Document sans nom",
                documentCode: documentPartage.codeAdn,
                demandeCode: demandePartage.code,
                dateAjout: documentPartage.createdAt.toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: institut.email,
            subject,
            html,
            text,
        });
    }

    // 5. Payment Emails
    async sendPaymentSuccessEmail(demandeur, transaction) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "payment-success",
            subject: "Confirmation de votre paiement",
            context: {
                demandeurName: demandeur.name,
                montant: transaction.montant,
                dateTransaction: transaction.dateTransaction.toLocaleString("fr-FR"),
                typePaiement: transaction.typePaiement,
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    async sendPaymentFailureEmail(demandeur, errorMessage) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "payment-failure",
            subject: "Échec de votre paiement",
            context: {
                demandeurName: demandeur.name,
                errorMessage,
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    // 6. Invitation Emails
    async sendInvitationToInstitut(institutInvite, mailInstitut, nameInstitut, demande, institutDemandeur = null) {
        const token = crypto.randomBytes(32).toString("hex");
        const invitationUrl = `${process.env.FRONTEND_URL}/invitation-institut?token=${token}`;

        // Save token to DB
        await prisma.institutInvite.update({
            where: { id: institutInvite.id },
            data: { tokenInvitation: token },
        });

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "invitation-institut",
            subject: "Invitation à authentifier une demande",
            context: {
                nameInstitut,
                demandeurName: demande.demandeur.name,
                demandeurEmail: demande.demandeur.email,
                dateDemande: demande.createdAt.toLocaleDateString("fr-FR"),
                invitationUrl,
                institutDemandeur: institutDemandeur ? {
                    name: institutDemandeur.name,
                    phone: institutDemandeur.phone,
                    adresse: institutDemandeur.adress,
                } : null,
            },
        });

        return this.sendEmail({
            to: mailInstitut,
            subject,
            html,
            text,
        });
    }

    async sendInvitationForRegistration(institutInvite, demandePartage, demandeur, institut) {
        const token = crypto.randomBytes(32).toString("hex");
        const invitationUrl = `${process.env.FRONTEND_URL}/invitation-institut?token=${token}`;

        // Save token to DB
        await prisma.institutInvite.update({
            where: { id: institutInvite.id },
            data: { tokenInvitation: token },
        });

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "invitation-registration",
            subject: "Invitation à vous inscrire et authentifier une demande",
            context: {
                institutName: institutInvite.name,
                demandeurName: demandeur.name,
                institutNameDest: institut.name,
                invitationUrl,
            },
        });

        return this.sendEmail({
            to: institutInvite.email,
            subject,
            html,
            text,
        });
    }

    // 7. Admin Emails
    async sendAdminAccountEmail(user, password) {
        const token = crypto.randomBytes(32).toString("hex");
        const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${token}`;
        const loginUrl = `${process.env.FRONTEND_URL}/auth/sign-in`;

        // Save token to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenActiveted: token,
                expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
            },
        });

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "new-admin-account",
            subject: "Activation de votre compte administrateur",
            context: {
                userName: user.username,
                email: user.email,
                password,
                loginUrl,
                activationUrl,
            },
        });

        return this.sendEmail({
            to: user.email,
            subject,
            html,
            text,
        });
    }

    // 8. Contact Emails
    async sendContactToAdmin(contact) {
        const settings = await this.getSiteSettings();

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "contact-to-admin",
            subject: `Nouveau message de contact: ${contact.subject}`,
            context: {
                contactName: contact.name,
                contactEmail: contact.email,
                contactPhone: contact.phone,
                contactMessage: contact.message,
                contactSubject: contact.subject,
            },
        });

        return this.sendEmail({
            to: settings.contactEmail,
            subject,
            html,
            text,
        });
    }

    async sendContactConfirmation(contact) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "contact-confirmation",
            subject: "Confirmation de réception de votre message",
            context: {
                contactName: contact.name,
                contactSubject: contact.subject,
            },
        });

        return this.sendEmail({
            to: contact.email,
            subject,
            html,
            text,
        });
    }

    // 9. Document Translation Emails

    async sendDocumentTranslationNotification(documentPartage, demande, institutTraducteur, institutSource, demandeur) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "document-translation-notification",
            subject: `Nouveau document à traduire - Référence : (${demande.code})`,
            context: {
                institutTraducteurName: institutTraducteur.name,
                institutSourceName: institutSource.name,
                demandeurName: demandeur.firstName + ' ' + demandeur.lastName,
                documentType: documentPartage.type,
                documentMention: documentPartage.mention,
                documentDateObtention: documentPartage.dateObtention,
                codeDemande: demande.code,
                dateDemande: demande.createdAt.toLocaleDateString("fr-FR"),
            },
        });
        return this.sendEmail({
            to: institutTraducteur.email,
            subject,
            html,
            text,
        });
    }


    async sendTranslatedDocumentNotification(documentPartage, institut, demandeur, demande = null) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "translated-document-notification",
            subject: "Votre document a été traduit",
            context: {
                demandeurName: demandeur.firstName + ' ' + demandeur.lastName,
                institutName: institut.name,
                documentType: demande.type,
                documentMention: demande.mention,
                documentDateObtention: demande.dateObtention,
                codeDemande: demande.code,
                dateDemande: demande.dateDemande,
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    // 10. Demande Result Emails
    async sendDemandeResultToDemandeur(demandeur, statutDemande, detailsDemande, dateDemande) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "demande-result",
            subject: "Résultat de votre demande",
            context: {
                demandeurName: demandeur.name,
                statutDemande,
                detailsDemande,
                dateDemande: new Date(dateDemande).toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    async sendMassAuthenticationResult(demandeur, typeDocument, mention, date) {
        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "mass-authentication-result",
            subject: "Résultat de votre authentification massive",
            context: {
                demandeurName: demandeur.name,
                typeDocument,
                mention,
                date: new Date(date).toLocaleDateString("fr-FR"),
            },
        });

        return this.sendEmail({
            to: demandeur.email,
            subject,
            html,
            text,
        });
    }

    async sendOrganizationNewAccountNotification({ organization, user }) {
        const context = {
            orgName: organization.name,
            orgEmail: organization.email || null,
            orgPhone: organization.phone || null,
            orgType: organization.type,
            userEmail: user.email,
            userFullname: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
            createdAt: new Date().toLocaleDateString("fr-FR"),
            dashboardUrl: process.env.FRONTEND_URL ?
                `${process.env.FRONTEND_URL}/organizations/${organization.id}/dashboard` : null,
        };

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "organization-new-account",
            subject: "Votre organisation a été créée",
            context,
        });

        if (!organization.email) return { skipped: true, reason: "ORG_EMAIL_MISSING" };
        return this.sendEmail({
            to: organization.email,
            subject,
            html,
            text,
        });
    }

    /** Mail à l’utilisateur : lien d’activation / définition du mot de passe */
    async sendUserActivationEmail({ user, organization, activationUrl, temporaryPassword }) {
        const context = {
            userName: [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                (user.email ? user.email.split("@")[0] : "Cher(ère) utilisateur(trice)"),
            orgName: organization.name,
            activationUrl,
            temporaryPassword: temporaryPassword || null, // si tu veux l'afficher dans le mail
            helpEmail: process.env.SUPPORT_EMAIL || null,
            appName: process.env.APP_NAME || "Applyons",
        };

        const { subject, html, text } = await this.buildCommonEmail({
            templateName: "user-activation",
            subject: "Activez votre compte",
            context,
        });

        return this.sendEmail({
            to: user.email,
            subject,
            html,
            text,
        });
    }



    /**
     * Envoie un e-mail à un utilisateur (ou une adresse) en s'appuyant sur un template .hbs
     *
     * @param {string|object} userOrEmail - Adresse e-mail directe OU objet user { id, email, firstName, lastName, ... }
     * @param {object} options
     * @param {string} options.templateName - Nom du template (ex: "contact-confirmation")
     * @param {string} options.subject      - Sujet (sans le préfixe [siteName] ; il sera ajouté par buildCommonEmail)
     * @param {object} [options.context]    - Contexte injecté dans le template
     * @param {string|string[]} [options.cc]
     * @param {string|string[]} [options.bcc]
     * @param {string} [options.replyTo]
     * @param {Array<{filename:string, content:Buffer|string, contentType?:string, path?:string}>} [options.attachments]
     * @param {boolean} [options.createAudit=true] - Créer une trace d'audit
     * @returns {Promise<{messageId:string, accepted:string[], rejected:string[]}>}
     */
    async sendMailToUser(userOrEmail, {
        templateName = "contact-confirmation",
        subject,
        context = {},
        cc,
        bcc,
        replyTo,
        attachments,
        createAudit = true,
    } = {}) {
        if (!templateName) throw new Error("templateName requis");
        if (!subject) throw new Error("subject requis");

        // 1) Résoudre l'adresse e-mail et enrichir le contexte avec le user si présent
        let toEmail = null;
        let userCtx = {};
        if (typeof userOrEmail === "string") {
            toEmail = userOrEmail;
        } else if (userOrEmail && typeof userOrEmail === "object") {
            toEmail = userOrEmail.email || userOrEmail.contactEmail || null;
            userCtx = {
                userId: userOrEmail.id,
                firstName: userOrEmail.firstName,
                lastName: userOrEmail.lastName,
                fullName: [userOrEmail.firstName, userOrEmail.lastName].filter(Boolean).join(" "),
                role: userOrEmail.role,
            };
        }
        if (!toEmail) throw new Error("Aucune adresse e-mail valide");

        // 2) Récupérer les settings du site (adapté à ton modèle SiteSettings)
        const settings = await this.getSiteSettings(); // doit renvoyer { siteName, logo, urlSite, ... }
        // Normaliser pour les templates/partials qui attendent logoUrl & siteUrl
        const templateSafeSettings = {
            siteName: settings.siteName || "APPLYONS",
            logoUrl: "https://admin.applyons.com/logo.png" || settings.logo || settings.logoUrl || null,
            siteUrl: settings.urlSite || settings.siteUrl || null,
        };

        // 3) Construire le contenu via le moteur de templates (préfixe sujet auto: "[siteName] ...")
        const { subject: finalSubject, html, text } = await this.buildCommonEmail({
            templateName,
            subject,
            context: {...templateSafeSettings, ...userCtx, ...context },
        });

        // 4) Émettre l’e-mail
        const result = await this.sendEmail({
            to: toEmail,
            subject: finalSubject,
            html,
            text,
            ...(cc ? { cc } : {}),
            ...(bcc ? { bcc } : {}),
            ...(replyTo ? { replyTo } : {}),
            ...(attachments ? { attachments } : {}),
        });

        // 5) Audit optionnel
        try {
            if (createAudit && typeof createAuditLog === "function") {
                await createAuditLog({
                    userId: (userCtx.userId || null) || (this.currentUserId || null),
                    action: "EMAIL_SENT",
                    resource: "emails",
                    details: {
                        to: toEmail,
                        cc,
                        bcc,
                        replyTo,
                        templateName,
                        subject: finalSubject,
                    },
                    ipAddress: this.requestIp || null,
                    userAgent: this.requestUA || null,
                });
            }
        } catch (e) {
            // on ne fait pas échouer l’envoi si l’audit plante
            console.warn("EMAIL_AUDIT_WARN:", e.message || e);
        }

        return result;
    }



    async sendPasswordResetEmail(user, resetToken) {
        const settings = await this.getSiteSettings(); // doit exister sur l'instance
        const siteName = "ApplyOns" || settings.siteName

        const frontendBase = "https://admin.applyons.com" || settings.frontendUrl;
        const resetUrl = `${frontendBase}/auth/new-password?token=${encodeURIComponent(resetToken)}`;

        const subject = "Réinitialisation de votre mot de passe";

        const hours = Number(1);

        const { subject: finalSubject, html, text } = await this.buildCommonEmail({
            templateName: "password-reset", // assure-toi que templates/password-reset.hbs existe
            subject: subject,

            context: {
                siteName,
                firstName: (user.firstName || user.name || "").trim(),
                resetUrl,
                expiresInHours: hours,
                isPluralHours: hours !== 1,
            },
        });

        return this.sendEmail({
            to: user.email,
            subject: `[${siteName}] ${subject}`,
            html,
            text,
        });
    }



    // 11. Simple Mail
    async sendSimpleMail({ to, subject, message }) {
        const settings = await this.getSiteSettings();

        const { subject: finalSubject, html, text } = await this.buildCommonEmail({
            templateName: "simple-mail",
            subject: finalSubject,
            context: {
                message: escapeHtml(message).replace(/\n/g, "<br>"),
                siteName: settings.siteName,
            },
        });

        return this.sendEmail({
            to,
            subject: `[${settings.siteName}] ${subject}`,
            html,
            text,
        });
    }

    // email.service.js
    async sendInviteUniversity({ to, subject, context }) {
        const settings = await this.getSiteSettings();
        const { html, text } = await this.buildCommonEmail({
            templateName: "invite-university",
            subject: subject || "Invitation à ajouter des documents",
            context: {
                siteName: settings.siteName,
                ...context, // orgName, demandeurName, demandeCode, targetOrgName, addDocUrl, expiresInDays
            },
        });
        return this.sendEmail({
            to,
            subject: `[${settings.siteName}] ${subject || "Invitation à ajouter des documents"}`,
            html,
            text,
        });
    }

    async sendOrgDemandeNotification({ to, context }) {
        const settings = await this.getSiteSettings();
        const subject = "Information: ajout de documents pour une demande";
        const { html, text } = await this.buildCommonEmail({
            templateName: "org-demande-notify",
            subject,
            context: { siteName: settings.siteName, ...context },
        });
        return this.sendEmail({ to, subject: `[${settings.siteName}] ${subject}`, html, text });
    }



    /**
     * Envoi d'un email de notification générique.
     * @param {string|string[]} to - Email(s) du/des destinataire(s).
     * @param {string} subject - Sujet de l'email.
     * @param {Object} context - Contexte pour le template.
     * @param {string} templateName - Nom du template (par défaut: "generic-notification").
    
    * to: emailData.to,
                    cc: emailData.cc,
                    bcc: emailData.bcc,
                    replyTo: emailData.replyTo,
                    subject: emailData.subject,
                    context,
                    templateName,
                    attachments: emailData.attachments, 
    */
    async sendNotificationEmail({ to, cc = null, bcc = null, replyTo = null, subject, context = {}, templateName = "generic-notification", attachments = [] }) {
        const settings = await this.getSiteSettings();
        const siteName = "ApplyOns" || settings.siteName;

        const { subject: finalSubject, html, text } = await this.buildCommonEmail({
            templateName,
            subject: `[${siteName}] ${subject}`,
            context: {
                ...context,
                siteName,
            },
        });

        return this.sendEmailCC({
            to,
            cc,
            bcc,
            replyTo,
            subject: finalSubject,
            html,
            text,
            attachments: Array.isArray(attachments) && attachments.length > 0 ? attachments : [],
        });
    }

    /**
     * Envoi d'un email avec pièce jointe.
     * @param {string} to - Email du destinataire.
     * @param {string} subject - Sujet de l'email.
     * @param {string} message - Message principal.
     * @param {Array} attachments - Liste des pièces jointes ([{ filename, content, contentType }]).
     */
    async sendEmailWithAttachments({ to, cc = null, bcc = null, replyTo = null, subject, message, isHtml = false, attachments = [] }) {
        const settings = await this.getSiteSettings();
        const siteName = "ApplyOns" || settings.siteName;

        // Si isHtml est true, utiliser directement le message comme HTML
        const html = isHtml ? message : escapeHtml(message).replace(/\n/g, "<br>");
        const text = isHtml ? message.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : message;

        const { subject: finalSubject } = await this.buildCommonEmail({
            templateName: "email-with-attachments",
            subject: `${subject}`,
            context: {
                message: html,
                siteName,
            },
        });

        return this.sendEmailCC({
            to,
            cc,
            bcc,
            replyTo,
            subject: finalSubject,
            html,
            text,
            attachments: Array.isArray(attachments) && attachments.length > 0 ? attachments : [],
        });
    }

    /**
     * Réponse libre : prend (to, subject, message) et optionnellement name
     */
    async sendResponseEmail({ to, subject, message, name = "Madame/Monsieur" }) {
        const siteSettings = await prisma.siteSettings.findFirst();
        const siteName = 'ApplyOns' || siteSettings.siteName;
        const logoUrl = "https://admin.applyons.com/logo.png" || toAbsoluteUrl(siteSettings.logo) || "http://localhost:3000/logo.png";

        const safeSubject = escapeHtml(subject || "Votre demande");
        const safeName = escapeHtml(name);
        const safeMessage = escapeHtml(message || "").replace(/\n/g, "<br>");

        const html = buildEmailHtml({
            siteName,
            logoUrl,
            title: safeSubject,
            heading: "Réponse à votre demande",
            contentHtml: `
        <p>Bonjour ${safeName},</p>
        <p>Nous avons bien pris en compte votre demande concernant&nbsp;: <strong>${safeSubject}</strong>.</p>
        <p>Voici notre réponse :</p>
        <div class="box">${safeMessage}</div>
        <p>Si vous avez d'autres questions, n'hésitez pas à nous recontacter.</p>
      `,
        });

        const text = buildText([
            `Réponse - ${subject || "Votre demande"}`,
            `Bonjour ${name},`,
            `Sujet : ${subject || "Votre demande"}`,
            `Réponse :\n${message || ""}`,
            `L'équipe ${siteName}`,
        ]);

        return this.sendEmail({ to, subject: subject || "Réponse", html, text });
    }


}

module.exports = new EmailService();