// controllers/payment.controller.js
const { PrismaClient, Prisma } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { createAuditLog } = require("../utils/audit");
const prisma = new PrismaClient();
const Stripe = require("stripe");
const { de } = require("@faker-js/faker");
const fetch = (...args) =>
    import ("node-fetch").then(({ default: f }) => f(...args));



const stripe = process.env.STRIPE_SECRET ? new Stripe(process.env.STRIPE_SECRET) : null;
const STRIPE_PUBLISHABLE = process.env.STRIPE_PUBLISHABLE;

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT || process.env.PAYPAL_ID || "";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "";
const PAYPAL_BASE = process.env.PAYPAL_MODE === "live" ?
    "https://api-m.paypal.com" :
    "https://api-m.sandbox.paypal.com";



function isPlainObject(v) {
    return v && typeof v === "object" && !Array.isArray(v);
}

const ALLOWED_STATUS = new Set([
    "INITIATED",
    "REQUIRES_ACTION",
    "AUTHORIZED",
    "CAPTURED",
    "CANCELED",
    "FAILED",
    "SUCCEEDED",
]);

function normalizeStatus(input, fallback = "INITIATED") {
    const s = String(input || "").toUpperCase();
    return ALLOWED_STATUS.has(s) ? s : fallback;
}

const TYPE_ALIAS = {
    CARD: "CARD",
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    MOBILE_MONEY: "MOBILE_MONEY",
    MOBILEMONEY: "MOBILE_MONEY",
    MOBILE: "MOBILE_MONEY",
    "MOBILE-MONEY": "MOBILE_MONEY",
    BANK_TRANSFER: "BANK_TRANSFER",
    BANKTRANSFER: "BANK_TRANSFER",
    TRANSFER: "BANK_TRANSFER",

    // entrées “brutes” frontend
    card: "CARD",
    stripe: "STRIPE",
    paypal: "PAYPAL",
    "bank-transfer": "BANK_TRANSFER",
    "mobile-money": "MOBILE_MONEY",
};

function normalizePaymentType(input, provider) {
    const raw = (input || "").toString().trim();
    const key =
        TYPE_ALIAS[raw] ||
        TYPE_ALIAS[raw.toUpperCase()] ||
        TYPE_ALIAS[raw.toLowerCase()];

    if (key) return key;

    // fallback cohérent avec le provider
    const prov = (provider || "").toLowerCase();
    if (prov === "stripe" || prov === "STRIPE") return "STRIPE";
    if (prov === "paypal" || prov === "PAYPAL") return "PAYPAL";

    // dernier recours : CARD si on voit un PaymentIntent Stripe
    return "CARD";
}

function normalizeCurrency(cur) {
    const c = String(cur || "").trim().toUpperCase();
    // laisse passer “USD”, “XOF”, etc. (3–5 chars)
    return c || "USD";
}

function deriveProvider(provider, paymentInfo) {
    if (provider) return String(provider).trim().toLowerCase();
    // Stripe PaymentIntent ?
    if (isPlainObject(paymentInfo) && paymentInfo.object === "payment_intent") {
        return "stripe";
    }
    return "unknown";
}

function deriveProviderRef(providerRef, paymentInfo) {
    if (providerRef) return String(providerRef);
    if (isPlainObject(paymentInfo) && paymentInfo.id) return String(paymentInfo.id);
    return null;
}

function deriveAmountMajorUnits(amount, paymentInfo) {
    // Si amount fourni par le frontend => priorité
    const a = Number(amount);
    if (Number.isFinite(a) && a > 0) return a;

    // Sinon si Stripe PaymentIntent donne amount en cents
    const cents = Number(paymentInfo.amount);
    if (Number.isFinite(cents) && cents > 0) return Number((cents / 100).toFixed(2));

    return null; // laisser l’API refuser plus bas
}

function deriveCurrency(currency, paymentInfo, provider) {
    if (currency) return normalizeCurrency(currency);
    // Stripe PI: lowercased currency (ex: "usd")
    if (provider === "stripe" && paymentInfo.currency) {
        return normalizeCurrency(paymentInfo.currency);
    }
    return "USD";
}


// Helpers Prix (env => nombres)
const getPrices = () => {
    const toNum = (v, d = 0) => {
        const n = Number(String(v || "").trim());
        return Number.isFinite(n) ? n : d;
    };
    return {
        demandeur: toNum(process.env.PRIX_DEMANDEUR, 49),
        institut: toNum(process.env.PRIX_INSTITUT, 99),
        universite: toNum(process.env.PRIX_UNIVERSITE, 1000),
        currency: (process.env.PRIX_DEVISE || "USD").toUpperCase(),
    };
};

// Demande: montant à payer par le DEMANDEUR pour valider la demande
const computeDemandePrice = () => {
    // aujourd’hui on applique un prix fixe « demandeur »
    const { demandeur, currency } = getPrices();
    return { amount: demandeur, currency, reason: "DEMANDEUR_FEE" };
};

// Abonnement d'une organisation selon son type
const computeAbonnementPriceForOrgType = (orgType) => {
    const P = getPrices();
    const map = {
        "INSTITUT": P.institut,
        "COLLEGE": P.institut,
        "ENTREPRISE": P.institut,
        "LYCEE": P.institut,
        "BANQUE": P.universite,
        "UNIVERSITE": P.universite,
    };
    const amount = map[orgType.toUpperCase()] || 0;
    return { amount, currency: P.currency };
};


const shapePayment = (payment) => ({
    id: payment.id,
    transactionId: payment.transactionId,
    demandePartageId: payment.demandePartageId,
    abonnementId: payment.abonnementId,
    provider: payment.provider,
    providerRef: payment.providerRef,
    status: payment.status,
    amount: payment.amount.toString(),
    currency: payment.currency,
    paymentType: payment.paymentType,
    paymentInfo: payment.paymentInfo,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    transaction: payment.transaction ? {
        id: payment.transaction.id,
        statut: payment.transaction.statut,
        montant: payment.transaction.montant.toString(),
    } : null,
    demandePartage: payment.demandePartage ? {
        id: payment.demandePartage.id,
        code: payment.demandePartage.code,
        status: payment.demandePartage.status,
    } : null,
    abonnement: payment.abonnement ? {
        id: payment.abonnement.id,
        dateDebut: payment.abonnement.dateDebut,
        dateExpiration: payment.abonnement.dateExpiration,
        montant: payment.abonnement.montant.toString(),
    } : null,
});

// ============ LIST ============
exports.list = async(req, res) => {
    try {
        const { page = 1, limit = 10, status, provider, abonnementId, demandePartageId, transactionId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (provider) where.provider = { contains: provider, mode: "insensitive" };
        if (abonnementId) where.abonnementId = abonnementId;
        if (demandePartageId) where.demandePartageId = demandePartageId;
        if (transactionId) where.transactionId = transactionId;

        const skip = (Number(page) - 1) * Number(limit);
        const [rows, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: { abonnement: true, demandePartage: true, transaction: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.payment.count({ where }),
        ]);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENTS_LISTED",
            resource: "payments",
            details: { status, provider, abonnementId, demandePartageId, transactionId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            payments: rows.map(shapePayment),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
            filters: { status, provider, abonnementId, demandePartageId, transactionId },
        });
    } catch (e) {
        console.error("PAY_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération paiements", code: "GET_PAYMENTS_ERROR" });
    }
};

// ============ GET BY ID ============
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: { abonnement: true, demandePartage: true, transaction: true },
        });

        if (!payment) {
            return res.status(404).json({ message: "Paiement introuvable", code: "PAYMENT_NOT_FOUND" });
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENT_VIEWED",
            resource: "payments",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ payment: shapePayment(payment) });
    } catch (e) {
        console.error("PAY_GET_ERROR:", e);
        res.status(500).json({ message: "Échec récupération paiement", code: "GET_PAYMENT_ERROR" });
    }
};

// ============ CREATE ============
// module.exports.create = async(req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res
//                 .status(400)
//                 .json({ message: "Erreurs de validation", errors: errors.array() });
//         }

//         const {
//             transactionId,
//             demandePartageId,
//             abonnementId,
//             provider,
//             providerRef,
//             status = "INITIATED",
//             amount,
//             currency,
//             paymentType,
//             paymentInfo,
//         } = req.body;

//         // relation obligatoire: au moins l’une des 3
//         if (!transactionId && !demandePartageId && !abonnementId) {
//             return res.status(400).json({
//                 message: "Au moins un des champs transactionId, demandePartageId ou abonnementId est requis",
//                 code: "MISSING_RELATION_ID",
//             });
//         }

//         // validations relationnelles (optionnelles, seulement si fournies)
//         if (transactionId) {
//             const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
//             if (!tx) {
//                 return res
//                     .status(400)
//                     .json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
//             }
//         }
//         if (demandePartageId) {
//             const dem = await prisma.demandePartage.findUnique({ where: { id: demandePartageId } });
//             if (!dem) {
//                 return res
//                     .status(400)
//                     .json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
//             }
//         }
//         if (abonnementId) {
//             const abo = await prisma.abonnement.findUnique({ where: { id: abonnementId } });
//             if (!abo) {
//                 return res
//                     .status(400)
//                     .json({ message: "Abonnement introuvable", code: "ABONNEMENT_NOT_FOUND" });
//             }
//         }

//         // normalisations & dérivations
//         const resolvedProvider = deriveProvider(provider, paymentInfo); // "stripe" | "paypal" | "unknown"
//         const resolvedProviderRef = deriveProviderRef(providerRef, paymentInfo);
//         const resolvedStatus = normalizeStatus(status, "INITIATED");
//         const resolvedAmount = deriveAmountMajorUnits(amount, paymentInfo);
//         const resolvedCurrency = deriveCurrency(currency, paymentInfo, resolvedProvider);
//         const resolvedType = normalizePaymentType(paymentType, resolvedProvider);

//         if (!resolvedAmount) {
//             return res.status(400).json({
//                 message: "Montant invalide ou manquant",
//                 code: "INVALID_AMOUNT",
//             });
//         }

//         // Création du paiement
//         const payment = await prisma.payment.create({
//             data: {
//                 transaction: transactionId ? { connect: { id: transactionId } } : undefined,
//                 demandePartage: demandePartageId ? { connect: { id: demandePartageId } } : undefined,
//                 abonnement: abonnementId ? { connect: { id: abonnementId } } : undefined,

//                 provider: resolvedProvider, // ex: "stripe"
//                 providerRef: resolvedProviderRef, // ex: "pi_***"
//                 status: resolvedStatus, // enum PaymentStatus
//                 amount: new Prisma.Decimal(resolvedAmount),
//                 currency: resolvedCurrency, // ex: "USD"
//                 paymentType: resolvedType, // enum PaymentType
//                 paymentInfo: isPlainObject(paymentInfo) ? paymentInfo : Prisma.JsonNull,
//             },
//             include: { abonnement: true, demandePartage: true, transaction: true },
//         });

//         // (Optionnel) si on veut marquer la demande comme payée
//         if (demandePartageId && resolvedStatus === "SUCCEEDED") {
//             try {
//                 await prisma.demandePartage.update({
//                     where: { id: demandePartageId },
//                     data: { statusPayment: "PAYER" }, // champ existant dans ta création de demande
//                 });
//             } catch (e) {
//                 // silencieux si le champ n'existe pas / pas souhaité
//                 console.warn("UPDATE_DEMANDE_STATUSPAYMENT_FAILED:", e.message || e);
//             }
//         }

//         await createAuditLog({
//             userId: res.locals.user.id,
//             action: "PAYMENT_CREATED",
//             resource: "payments",
//             resourceId: payment.id,
//             details: {
//                 transactionId: transactionId || null,
//                 demandePartageId: demandePartageId || null,
//                 abonnementId: abonnementId || null,
//                 provider: resolvedProvider,
//                 amount: resolvedAmount,
//                 currency: resolvedCurrency,
//                 paymentType: resolvedType,
//                 status: resolvedStatus,
//             },
//             ipAddress: req.ip,
//             userAgent: req.get("User-Agent"),
//         });

//         return res
//             .status(201)
//             .json({ message: "Paiement créé", payment: shapePayment(payment) });
//     } catch (e) {
//         console.error("CREATE_PAYMENT_ERROR:", e);
//         // gestion des contraintes uniques (ex: demandePartageId unique)
//         if (e.code === "P2002") {
//             return res.status(409).json({
//                 message: "Un paiement existe déjà pour cette ressource",
//                 code: "UNIQUE_CONSTRAINT_VIOLATION",
//                 meta: e.meta,
//             });
//         }
//         return res
//             .status(500)
//             .json({ message: "Échec création paiement", code: "CREATE_PAYMENT_ERROR" });
//     }
// };

// ============ CREATE ============
module.exports.create = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const {
            transactionId,
            demandePartageId,
            abonnementId, // ✅ support abonnement
            provider,
            providerRef,
            status = "INITIATED",
            amount, // ✅ major units si fourni (ex: 1000)
            currency,
            paymentType, // ✅ ex: "STRIPE" | "PAYPAL" | "CARD"...
            paymentInfo, // ✅ ex: Stripe PaymentIntent (object: "payment_intent")
        } = req.body;

        // Au moins une relation
        if (!transactionId && !demandePartageId && !abonnementId) {
            return res.status(400).json({
                message: "Au moins un des champs transactionId, demandePartageId ou abonnementId est requis",
                code: "MISSING_RELATION_ID",
            });
        }

        // Validations relationnelles (si fournis)
        if (transactionId) {
            const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
            if (!tx) {
                return res
                    .status(400)
                    .json({ message: "Transaction introuvable", code: "TRANSACTION_NOT_FOUND" });
            }
        }
        if (demandePartageId) {
            const dem = await prisma.demandePartage.findUnique({ where: { id: demandePartageId } });
            if (!dem) {
                return res
                    .status(400)
                    .json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
            }
        }
        if (abonnementId) {
            const abo = await prisma.abonnement.findUnique({ where: { id: abonnementId } });
            if (!abo) {
                return res
                    .status(400)
                    .json({ message: "Abonnement introuvable", code: "ABONNEMENT_NOT_FOUND" });
            }
        }

        // Normalisations & dérivations
        const resolvedProvider = deriveProvider(provider, paymentInfo); // "stripe" | "paypal" | "unknown"
        const resolvedProviderRef = deriveProviderRef(providerRef, paymentInfo); // "pi_..." si Stripe, capture.id si PayPal, etc.
        const resolvedStatus = normalizeStatus(status, "INITIATED"); // vers enum PaymentStatus
        const resolvedAmount = deriveAmountMajorUnits(amount, paymentInfo); // amount || paymentInfo.amount/100
        const resolvedCurrency = deriveCurrency(currency, paymentInfo, resolvedProvider); // "USD" etc.
        const resolvedType = normalizePaymentType(paymentType, resolvedProvider); // map "stripe"->"STRIPE", etc.

        if (!resolvedAmount || !Number.isFinite(Number(resolvedAmount))) {
            return res.status(400).json({
                message: "Montant invalide ou manquant",
                code: "INVALID_AMOUNT",
            });
        }

        // Création du paiement
        const payment = await prisma.payment.create({
            data: {
                transaction: transactionId ? { connect: { id: transactionId } } : undefined,
                demandePartage: demandePartageId ? { connect: { id: demandePartageId } } : undefined,
                abonnement: abonnementId ? { connect: { id: abonnementId } } : undefined,

                provider: resolvedProvider, // "stripe"
                providerRef: resolvedProviderRef || null, // "pi_3SP8lq..."
                status: resolvedStatus, // "SUCCEEDED"
                amount: new Prisma.Decimal(Number(resolvedAmount).toFixed(2)), // 1000.00
                currency: resolvedCurrency, // "USD"
                paymentType: "CARD", // "STRIPE"
                paymentInfo: isPlainObject(paymentInfo) ? paymentInfo : Prisma.JsonNull,
            },
            include: { abonnement: true, demandePartage: true, transaction: true },
        });

        // (Optionnel) si on veut marquer quelque chose côté abonnement après succès
        // if (abonnementId && resolvedStatus === "SUCCEEDED") {
        //   await prisma.abonnement.update({ where: { id: abonnementId }, data: { ... } });
        // }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENT_CREATED",
            resource: "payments",
            resourceId: payment.id,
            details: {
                transactionId: transactionId || null,
                demandePartageId: demandePartageId || null,
                abonnementId: abonnementId || null,
                provider: resolvedProvider,
                providerRef: resolvedProviderRef || null,
                amount: Number(resolvedAmount),
                currency: resolvedCurrency,
                paymentType: resolvedType,
                status: resolvedStatus,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(201).json({ message: "Paiement créé", payment: shapePayment(payment) });
    } catch (e) {
        console.error("CREATE_PAYMENT_ERROR:", e);
        if (e.code === "P2002") {
            // transactionId et demandePartageId sont uniques dans ton schéma;
            // abonnementId ne l'est pas, donc plusieurs paiements par abonnement sont possibles.
            return res.status(409).json({
                message: "Un paiement existe déjà pour cette ressource",
                code: "UNIQUE_CONSTRAINT_VIOLATION",
                meta: e.meta,
            });
        }
        return res
            .status(500)
            .json({ message: "Échec création paiement", code: "CREATE_PAYMENT_ERROR" });
    }
};

// ============ UPDATE ============
exports.update = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params;
        const {
            status,
            providerRef,
            amount,
            paymentInfo,
        } = req.body;

        const patch = {};
        if (status !== undefined) patch.status = status;
        if (providerRef !== undefined) patch.providerRef = providerRef || null;
        if (amount !== undefined) patch.amount = new Prisma.Decimal(amount);
        if (paymentInfo !== undefined) patch.paymentInfo = paymentInfo || Prisma.JsonNull;

        const payment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!payment) {
            return res.status(404).json({ message: "Paiement introuvable", code: "PAYMENT_NOT_FOUND" });
        }

        const updated = await prisma.payment.update({
            where: { id },
            data: patch,
            include: { abonnement: true, demandePartage: true, transaction: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENT_UPDATED",
            resource: "payments",
            resourceId: id,
            details: patch,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Paiement mis à jour", payment: shapePayment(updated) });
    } catch (e) {
        console.error("PAY_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour paiement", code: "UPDATE_PAYMENT_ERROR" });
    }
};

// ============ UPDATE STATUS ============
exports.updateStatus = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Erreurs de validation", errors: errors.array() });
        }

        const { id } = req.params;
        const { status, providerRef } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Le statut est requis", code: "STATUS_REQUIRED" });
        }

        const payment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!payment) {
            return res.status(404).json({ message: "Paiement introuvable", code: "PAYMENT_NOT_FOUND" });
        }

        const updated = await prisma.payment.update({
            where: { id },
            data: {
                status,
                providerRef: providerRef || payment.providerRef,
            },
            include: { abonnement: true, demandePartage: true, transaction: true },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENT_STATUS_UPDATED",
            resource: "payments",
            resourceId: id,
            details: { status, providerRef },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Statut du paiement mis à jour", payment: shapePayment(updated) });
    } catch (e) {
        console.error("PAY_UPDATE_STATUS_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour du statut du paiement", code: "UPDATE_PAYMENT_STATUS_ERROR" });
    }
};

// ============ STATS ============
// controllers/payment.controller.js

// controllers/payment.controller.js
exports.stats = async(req, res) => {
    try {
        const { provider, status, from, to } = req.query;

        // Parse dates propres
        const parseDate = (v) => {
            if (!v) return null;
            const d = new Date(v);
            return isNaN(d.getTime()) ? null : d;
        };
        const fromDate = parseDate(from);
        const toDate = parseDate(to);

        const where = {};
        if (provider) where.provider = { contains: provider, mode: "insensitive" };
        if (status) where.status = status;
        if (fromDate || toDate) {
            where.createdAt = {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
            };
        }

        // 1) Par statut (compte)
        const byStatusRaw = await prisma.payment.groupBy({
            by: ["status"],
            where,
            _count: { _all: true },
            orderBy: { status: "asc" }, // ✅ trier par un champ de `by`
        });

        // 2) Par provider (compte)
        const byProviderCountRaw = await prisma.payment.groupBy({
            by: ["provider"],
            where,
            _count: { _all: true },
            orderBy: { provider: "asc" }, // ✅
        });

        // 3) Montant total par statut (somme)
        const amountByStatusRaw = await prisma.payment.groupBy({
            by: ["status"],
            where,
            _sum: { amount: true },
            orderBy: { status: "asc" }, // ✅
        });

        // (optionnel) Montant par provider pour tes graphes
        const amountByProviderRaw = await prisma.payment.groupBy({
            by: ["provider"],
            where,
            _sum: { amount: true },
            orderBy: { provider: "asc" }, // ✅
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYMENT_STATS_VIEWED",
            resource: "payments",
            details: {
                provider,
                status
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        // Sérialisation null-safe (évite null.toString())
        const byStatus = byStatusRaw.map((it) => ({
            status: it.status,
            count: it._count._all || 0,
        }));

        const byProvider = byProviderCountRaw.map((it) => ({
            provider: it.provider || "UNKNOWN",
            count: it._count._all || 0,
        }));

        const amountByStatus = amountByStatusRaw.map((it) => ({
            status: it.status,
            totalAmount: (it._sum.amount || 0).toString(),
        }));

        const byProviderAmount = amountByProviderRaw.map((it) => ({
            provider: it.provider || "UNKNOWN",
            amount: Number(it._sum.amount || 0), // utile pour tes graphiques
        }));

        return res.status(200).json({
            byStatus,
            byProvider,
            amountByStatus,
            byProviderAmount, // si tu veux l’utiliser côté front (Bar/Pie)
        });
    } catch (e) {
        console.error("PAY_STATS_ERROR:", e);
        return res
            .status(500)
            .json({ message: "Échec récupération statistiques", code: "GET_PAYMENT_STATS_ERROR" });
    }
};



const getFetch = async() => {
    if (typeof fetch === "function") return fetch;
    const mod = await
    import ("node-fetch");
    return mod.default;
};


// Helpers
const ensureDemande = async(demandeId) => {
    const d = await prisma.demandePartage.findUnique({ where: { id: demandeId } });
    if (!d || d.isDeleted) {
        const err = new Error("Demande introuvable");
        err.status = 404;
        err.code = "DEMANDE_NOT_FOUND";
        throw err;
    }
    return d;
};

const markPaid = async(demande, provider, providerId, amount, currency, raw) => {
    // upsert Payment lié à la demande
    const pay = await prisma.payment.upsert({
        where: { demandePartageId: demande.id },
        create: {
            demandePartageId: demande.id,
            provider,
            providerPaymentId: providerId,
            amount,
            currency,
            status: "PAID",
            raw: raw ? JSON.stringify(raw) : null,
        },
        update: {
            provider,
            providerPaymentId: providerId,
            amount,
            currency,
            status: "PAID",
            raw: raw ? JSON.stringify(raw) : null,
        },
    });

    // statut paiement sur la demande
    await prisma.demandePartage.update({
        where: { id: demande.id },
        data: { statusPayment: "PAID" },
    });

    return pay;
};

// GET /api/payments/demande/:id
exports.getForDemande = async(req, res) => {
    try {
        const demandeId = req.params.demandeId;
        const d = await ensureDemande(demandeId);

        const payment = await prisma.payment.findFirst({
            where: { demandePartageId: demandeId },
        });

        res.status(200).json({
            demandeId,
            statusPayment: d.statusPayment || null,
            payment: payment || null,
        });
    } catch (e) {
        console.error("PAY_GET_ERROR:", e);
        res.status(e.status || 500).json({ message: e.message || "Erreur paiement", code: e.code || "PAY_GET_ERROR" });
    }
};

// POST /api/payments/stripe/create-intent
// body: { demandeId, amount, currency }
exports.createStripeIntent = async(req, res) => {
    try {
        if (!stripe || !process.env.STRIPE_SECRET) {
            return res.status(500).json({ message: "Stripe non configuré", code: "STRIPE_NOT_CONFIGURED" });
        }

        const { demandeId, currency } = req.body || {};
        if (!demandeId) return res.status(400).json({ message: "demandeId requis", code: "MISSING_FIELDS" });

        const d = await ensureDemande(demandeId);
        const { amount, currency: curFromEnv } = computeDemandePrice(d);
        const cur = (currency || curFromEnv || "USD").toLowerCase();

        const pi = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: cur,
            metadata: {
                demandeId,
                // userId: String(req.user.id || res.locals.user.id || ""),
            },
            automatic_payment_methods: { enabled: true },
        });

        res.status(201).json({
            clientSecret: pi.client_secret,
            publishableKey: STRIPE_PUBLISHABLE,
            paymentIntentId: pi.id,
            amount,
            currency: cur.toUpperCase(),
        });
    } catch (e) {
        console.error("STRIPE_CREATE_INTENT_ERROR:", e);
        res.status(500).json({ message: "Échec init paiement Stripe", code: "STRIPE_CREATE_INTENT_ERROR" });
    }
};

// POST /api/payments/stripe/confirm
// body: { demandeId, paymentIntentId }
exports.confirmStripe = async(req, res) => {
    try {
        if (!stripe) return res.status(500).json({ message: "Stripe non configuré", code: "STRIPE_NOT_CONFIGURED" });

        const { demandeId, paymentIntentId } = req.body || {};
        if (!demandeId || !paymentIntentId) return res.status(400).json({ message: "demandeId, paymentIntentId requis", code: "MISSING_FIELDS" });

        const d = await ensureDemande(demandeId);
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (pi.status === "succeeded") {
            const amount = Number(pi.amount) / 100;
            const currency = pi.currency.toUpperCase() || "USD";
            const pay = await markPaid(d, "STRIPE", pi.id, amount, currency, pi);
            return res.status(200).json({ message: "Paiement confirmé", payment: pay });
        }

        res.status(200).json({ message: `Statut: ${pi.status}`, status: pi.status });
    } catch (e) {
        console.error("STRIPE_CONFIRM_ERROR:", e);
        res.status(500).json({ message: "Échec confirmation Stripe", code: "STRIPE_CONFIRM_ERROR" });
    }
};

// ---------- PAYPAL ----------

const getPaypalAccessToken = async() => {
    const fetch = await getFetch();

    // Trim au cas où il y aurait des espaces ou guillemets accidentels
    const client = (PAYPAL_CLIENT || "").trim();
    const secret = (PAYPAL_SECRET || "").trim();

    if (!client || !secret) {
        const e = new Error("PAYPAL_CLIENT/PAYPAL_SECRET manquants");
        e.status = 500;
        e.code = "PAYPAL_ENV_MISSING";
        throw e;
    }

    const auth = Buffer.from(`${client}:${secret}`).toString("base64");
    const resp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const text = await resp.text();
    if (!resp.ok) {
        console.error("PAYPAL_OAUTH_ERROR:", {
            status: resp.status,
            statusText: resp.statusText,
            body: text,
            base: PAYPAL_BASE,
            clientStartsWith: client.slice(0, 6) + "...",
        });
        throw new Error("PayPal auth failed");
    }

    try {
        return JSON.parse(text);
    } catch {
        console.error("PAYPAL_OAUTH_PARSE_ERROR:", text);
        throw new Error("PayPal auth parse failed");
    }
};

// POST /api/payments/paypal/create-order
// body: { demandeId, amount, currency }
/* ===================== CREATE ORDER ===================== */
const { paypalClient } = require("../config/paypal.config"); // Chemin à adapter

exports.createPaypalOrder = async(req, res) => {
    try {
        const { demandeurId, currency, amount } = req.body;
        if (!demandeurId) return res.status(400).json({ message: "demandeId requis" });

        const demandeur = await prisma.user.findUnique({
            where: { id: demandeurId },
        });
        if (!demandeur) {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }

        const request = new(require("@paypal/checkout-server-sdk").orders.OrdersCreateRequest)();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                reference_id: demandeurId,
                amount: { currency_code: currency || "USD", value: String(amount) },
                description: `Paiement demandeur ${demandeur.id || demandeurId}`,
            }],
            application_context: {
                user_action: "PAY_NOW",
                shipping_preference: "NO_SHIPPING",
            },
        });

        // Utilisation du client PayPal importé
        const client = paypalClient();
        const order = await client.execute(request);

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYPAL_ORDER_CREATED",
            resource: "payments",
            resourceId: order.result.id,
            details: { demandeId: demandeurId, amount, currency },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(200).json({ orderID: order.result.id });
    } catch (e) {
        console.error("PAYPAL_CREATE_ORDER_ERROR:", e);
        return res.status(500).json({ message: "Échec création ordre PayPal", code: "PAYPAL_CREATE_ORDER_ERROR" });
    }
};


// POST /api/payments/paypal/capture
// body: { demandeId, orderID }
/* ===================== CAPTURE ORDER ===================== */
exports.capturePaypalOrder = async(req, res) => {
    try {
        const { orderID, demandeId } = req.body;
        if (!orderID || !demandeId) return res.status(400).json({ message: "orderID et demandeId requis" });

        const client = paypalClient();
        const request = new(require("@paypal/checkout-server-sdk").orders.OrdersCaptureRequest)(orderID);
        request.requestBody({});

        const capture = await client.execute(request);

        // Vérifie statut
        const status = capture.result.status;
        if (status !== "COMPLETED") {
            return res.status(400).json({ message: "Paiement non complété", details: capture.result });
        }

        // Récup infos utiles
        const purchaseUnit = capture.result.purchase_units[0];
        const paymentAmount = purchaseUnit.payments.captures[0].amount;
        const payer = capture.result.payer;

        // Marque la demande comme payée + trace le payment
        // Table Payment (ou Transaction) selon ton schéma
        await prisma.payment.upsert({
            where: { demandePartageId: demandeId },
            update: {
                provider: "PAYPAL",
                providerPaymentId: orderID,
                status: "PAID",
                amount: paymentAmount.value ? Number(paymentAmount.value) : undefined,
                currency: paymentAmount.currency_code || undefined,
                raw: capture.result,
            },
            create: {
                demandePartageId: demandeId,
                provider: "PAYPAL",
                providerPaymentId: orderID,
                status: "PAID",
                amount: paymentAmount.value ? Number(paymentAmount.value) : 0,
                currency: paymentAmount.currency_code || "USD",
                raw: capture.result,
            },
        });

        await prisma.demandePartage.update({
            where: { id: demandeId },
            data: { statusPayment: "PAID" },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "PAYPAL_ORDER_CAPTURED",
            resource: "payments",
            resourceId: orderID,
            details: { demandeId, capture: capture.result },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(200).json({
            message: "Paiement PayPal complété",
            status: "PAID",
            capture: capture.result,
        });
    } catch (e) {
        console.error("PAYPAL_CAPTURE_ERROR:", e);
        return res.status(500).json({ message: "Échec capture ordre PayPal", code: "PAYPAL_CAPTURE_ORDER_ERROR" });
    }
};

// GET /api/payments/quote?demandeId=xxx
exports.getQuote = async(req, res) => {
    try {
        const { demandeId } = req.params;
        if (!demandeId) return res.status(400).json({ message: "demandeId requis", code: "MISSING_DEMANDE_ID" });

        const d = await prisma.demandePartage.findUnique({
            where: { id: demandeId },
            include: { targetOrg: true }
        });
        if (!d) return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });

        const quote = computeDemandePrice(d);
        return res.status(200).json({
            demandeId,
            ...quote,
            pricingSource: "ENV",
        });
    } catch (e) {
        console.error("PAY_QUOTE_ERROR:", e);
        return res.status(500).json({ message: "Échec devis paiement", code: "PAY_QUOTE_ERROR" });
    }
};


exports.createStripeIntentDemandeur = async(req, res) => {
    try {
        const { demandeurId } = req.body;
        const demandeur = await prisma.user.findUnique({
            where: { id: demandeurId },
        });
        if (!demandeur) {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }
        if (demandeurId) {
            // const demandePrice = computeDemandePrice(demandeur);
            const demandePrice = 49;
            if (demandePrice <= 0) {
                return res.status(400).json({ message: "Aucun frais pour cette demande", code: "NO_DEMANDE_FEE" });
            }
            const intent = await stripe.paymentIntents.create({
                amount: demandePrice * 100,
                currency: "USD",
                automatic_payment_methods: { enabled: true },
                metadata: { demandeurId },
            });
            return res.status(200).json({ publishableKey: intent.client_secret, paymentIntentId: intent.id, price: { amount: 49, currency: "USD" }, clientSecret: intent.client_secret });
        }
    } catch (e) {
        console.error("STRIPE_CREATE_INTENT_DEMANDEUR_ERROR:", e);
        res.status(500).json({ message: "Échec création paiement Stripe", code: "STRIPE_CREATE_INTENT_DEMANDEUR_ERROR" });
    }
};


exports.createStripeIntentInstitut = async(req, res) => {
    try {
        const { institutId } = req.body;
        const organisation = await prisma.organization.findUnique({
            where: { id: institutId },
        });

        if (!organisation) {
            return res.status(404).json({ message: "Organisation introuvable", code: "ORGANISATION_NOT_FOUND" });
        }

        if (institutId) {
            const abonnementPrice = computeAbonnementPriceForOrgType(organisation.type);

            if (abonnementPrice.amount <= 0) {
                return res.status(400).json({ message: "Aucun frais d'abonnement pour ce type d'organisation", code: "NO_SUBSCRIPTION_FEE" });
            }

            const intent = await stripe.paymentIntents.create({
                amount: abonnementPrice.amount * 100,
                currency: abonnementPrice.currency,
                automatic_payment_methods: { enabled: true },
                metadata: { institutId },
            });
            return res.status(200).json({ publishableKey: intent.client_secret, paymentIntentId: intent.id, price: abonnementPrice, clientSecret: intent.client_secret });
        }
        return res.status(200).json({ publishableKey: intent.client_secret, paymentIntentId: intent.id, price: abonnementPrice });
    } catch (e) {
        console.error("STRIPE_CREATE_INTENT_INSTITUT_ERROR:", e);
        res.status(500).json({ message: "Échec création paiement Stripe", code: "STRIPE_CREATE_INTENT_INSTITUT_ERROR" });
    }
};


exports.createPaypalIntentInstitut = async(req, res) => {
    try {
        const { institutId } = req.body;
        const organisation = await prisma.organization.findUnique({
            where: { id: institutId },
        });

        if (!organisation) {
            return res.status(404).json({ message: "Organisation introuvable", code: "ORGANISATION_NOT_FOUND" });
        }

        if (institutId) {
            const abonnementPrice = computeAbonnementPriceForOrgType(organisation.type);

            if (abonnementPrice.amount <= 0) {
                return res.status(400).json({ message: "Aucun frais d'abonnement pour ce type d'organisation", code: "NO_SUBSCRIPTION_FEE" });
            }

            return res.status(200).json({ client: PAYPAL_CLIENT, currency: "USD", intent: "capture", price: abonnementPrice });
        }

    } catch (e) {
        console.error("STRIPE_CREATE_INTENT_INSTITUT_ERROR:", e);
        res.status(500).json({ message: "Échec création paiement Stripe", code: "STRIPE_CREATE_INTENT_INSTITUT_ERROR" });
    }
};



exports.getPaypalConfig = async(req, res) => {
    try {
        if (!PAYPAL_CLIENT) {
            return res.status(400).json({ message: "PAYPAL_CLIENT manquant", code: "PAYPAL_CLIENT_MISSING" });
        }

        return res.status(200).json({ client: PAYPAL_CLIENT, currency: "USD", intent: "capture" });
    } catch (e) {
        console.error("PAYPAL_CONFIG_ERROR:", e);
        return res.status(500).json({ message: "Échec configuration PayPal", code: "PAYPAL_CONFIG_ERROR" });
    }
};


exports.getStripeConfig = async(req, res) => {
    try {
        if (!STRIPE_PUBLISHABLE) {
            return res.status(400).json({ message: "STRIPE_PUBLISHABLE manquant", code: "STRIPE_PUBLISHABLE_MISSING" });
        }
        return res.status(200).json({ publishable_key: STRIPE_PUBLISHABLE });
    } catch (e) {
        console.error("STRIPE_CONFIG_ERROR:", e);
        return res.status(500).json({ message: "Échec configuration Stripe", code: "STRIPE_CONFIG_ERROR" });
    }
};


exports.getAbonnementPriceForOrgType = async(req, res) => {
    try {
        const { idOrg } = req.params;
        if (!idOrg) return res.status(400).json({ message: "idOrg requis", code: "MISSING_ORG_TYPE" });

        const organisation = await prisma.organization.findUnique({
            where: { id: idOrg },
        });
        if (!organisation) {
            return res.status(404).json({ message: "Organisation introuvable", code: "ORGANISATION_NOT_FOUND" });
        }
        const orgType = organisation.type;

        const price = computeAbonnementPriceForOrgType(orgType);
        return res.status(200).json(price);
    } catch (e) {
        console.error("GET_ABOUNEMENT_PRICE_FOR_ORG_TYPE_ERROR:", e);
        return res.status(500).json({ message: "Échec devis prix d'abonnement", code: "GET_ABOUNEMENT_PRICE_FOR_ORG_TYPE_ERROR" });
    }
};

exports.getDemandePrice = async(req, res) => {
    try {
        const demandePrice = computeDemandePrice();
        return res.status(200).json(demandePrice);
    } catch (e) {
        console.error("GET_DEMANDE_PRICE_ERROR:", e);
        return res.status(500).json({ message: "Échec devis prix demande", code: "GET_DEMANDE_PRICE_ERROR" });
    }
};