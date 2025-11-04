const { PrismaClient } = require("@prisma/client");
const { createAuditLog } = require("../utils/audit");
const cryptoService = require("../services/crypto.service");
const prisma = new PrismaClient();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { buildCodeBase } = require("../utils/demandeCode");
const emailService = require("../services/email.service");

const SORTABLE = new Set(["dateDemande", "createdAt", "updatedAt", "code"]);
const MAX_LIMIT = 100;

const sanitizePagination = (q) => {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit || 10)));
    const skip = (page - 1) * limit;
    const sortBy = SORTABLE.has(String(q.sortBy)) ? String(q.sortBy) : "dateDemande";
    const sortOrder = String(q.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
    return { page, limit, skip, sortBy, sortOrder };
};

const toDateOrNull = (v) => {
    if (v === null || v === undefined || v === "") return null;
    if (v instanceof Date) return isNaN(v) ? null : v;
    const d = new Date(v);
    return isNaN(d) ? null : d;
};

const safeJson = (v) => {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "object") return v;
    try {
        return JSON.parse(v);
    } catch {
        return null;
    }
};

const serializeDemandeOld = (d) => ({
    id: d.id,
    code: d.code,
    dateDemande: d.dateDemande,
    isDeleted: d.isDeleted,
    status: d.status || null,
    user: d.user ? { id: d.user.id, email: d.user.email, username: d.user.username } : null,
    targetOrg: d.targetOrg ? { id: d.targetOrg.id, name: d.targetOrg.name, slug: d.targetOrg.slug, type: d.targetOrg.type } : null,
    assignedOrg: d.assignedOrg ? { id: d.assignedOrg.id, name: d.assignedOrg.name, slug: d.assignedOrg.slug } : null,
    transaction: d.transaction ? { id: d.transaction.id, statut: d.transaction.statut, montant: d.transaction.montant } : null,

    documentsCount: d._count.documents || 0,

    meta: {
        serie: d.serie,
        niveau: d.niveau,
        mention: d.mention,
        annee: d.annee,
        countryOfSchool: d.countryOfSchool,
        secondarySchoolName: d.secondarySchoolName,
        graduationDate: d.graduationDate,
    },

});

const serializeDemande = (d) => ({
    id: d.id,
    code: d.code,
    dateDemande: d.dateDemande,
    isDeleted: d.isDeleted,
    periode: d.periode,
    year: d.year,
    status: d.status,
    observation: d.observation,
    statusPayment: d.statusPayment,

    // Identité personnelle
    personalInfo: {
        dob: d.dob,
        citizenship: d.citizenship,
        passport: d.passport,
    },

    // Anglais / Tests
    englishInfo: {
        isEnglishFirstLanguage: d.isEnglishFirstLanguage,
        englishProficiencyTests: d.englishProficiencyTests,
        testScores: d.testScores,
    },

    // Scolarité / Notes
    academicInfo: {
        serie: d.serie,
        niveau: d.niveau,
        mention: d.mention,
        annee: d.annee,
        countryOfSchool: d.countryOfSchool,
        secondarySchoolName: d.secondarySchoolName,
        graduationDate: d.graduationDate,
        gradingScale: d.gradingScale,
        gpa: d.gpa,
        examsTaken: d.examsTaken,
        intendedMajor: d.intendedMajor,
    },

    // Activités / Distinctions
    activitiesInfo: {
        extracurricularActivities: d.extracurricularActivities,
        honorsOrAwards: d.honorsOrAwards,
    },

    // Famille
    familyInfo: {
        parentGuardianName: d.parentGuardianName,
        occupation: d.occupation,
        educationLevel: d.educationLevel,
    },

    // Financier
    financialInfo: {
        willApplyForFinancialAid: d.willApplyForFinancialAid,
        hasExternalSponsorship: d.hasExternalSponsorship,
    },

    // Visa
    visaInfo: {
        visaType: d.visaType,
        hasPreviouslyStudiedInUS: d.hasPreviouslyStudiedInUS,
    },

    // Essays
    essaysInfo: {
        personalStatement: d.personalStatement,
        optionalEssay: d.optionalEssay,
    },

    // Candidature
    applicationInfo: {
        applicationRound: d.applicationRound,
        howDidYouHearAboutUs: d.howDidYouHearAboutUs,
    },

    // Relations
    user: d.user && {
        id: d.user.id,
        firstName: d.user.firstName,
        lastName: d.user.lastName,
        email: d.user.email,
        phone: d.user.phone,
        role: d.user.role,
        organization: d.user.organization ? {
            id: d.user.organization.id,
            name: d.user.organization.name,
            slug: d.user.organization.slug,
            type: d.user.organization.type,
        } : null,
    },

    targetOrg: d.targetOrg ? {
        id: d.targetOrg.id,
        name: d.targetOrg.name,
        slug: d.targetOrg.slug,
        type: d.targetOrg.type,
    } : null,

    assignedOrg: d.assignedOrg ? {
        id: d.assignedOrg.id,
        name: d.assignedOrg.name,
        slug: d.assignedOrg.slug,
    } : null,

    // Documents et transaction
    documentsCount: d._count.documents || 0,
    _count: d._count,

    transaction: d.transaction ? {
        id: d.transaction.id,
        statut: d.transaction.statut,
        montant: d.transaction.montant,
    } : null,

    // Paiement
    payment: d.payment || null,

    documents: true ?
        (d.documents || []).map((doc) => ({
            id: doc.id,
            demandePartageId: doc.demandePartageId,
            ownerOrgId: doc.ownerOrgId,
            urlOriginal: doc.urlOriginal,
            type: doc.type,
            mention: doc.mention,
            dateObtention: doc.dateObtention,
            urlChiffre: doc.urlChiffre,
            urlTraduit: doc.urlTraduit,
            encryptionKey: doc.encryptionKey,
            encryptionKeyTraduit: doc.encryptionKeyTraduit,
            estTraduit: doc.estTraduit,
            aDocument: doc.aDocument,
            encryptionIV: doc.encryptionIV,
            blockchainHash: doc.blockchainHash,
            encryptedBy: doc.encryptedBy,
            encryptedAt: doc.encryptedAt,
            urlChiffreTraduit: doc.urlChiffreTraduit,
            encryptionIVTraduit: doc.encryptionIVTraduit,
            blockchainHashTraduit: doc.blockchainHashTraduit,
            encryptedByTraduit: doc.encryptedByTraduit,
            encryptedAtTraduit: doc.encryptedAtTraduit,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt,
            ownerOrg: doc.ownerOrg ? {
                id: doc.ownerOrg.id,
                name: doc.ownerOrg.name,
                slug: doc.ownerOrg.slug,
                type: doc.ownerOrg.type,
            } : null,
            blockchainBlocks: doc.blockchainBlocks || [],
        })) : undefined,
});

const genCode = () => crypto.randomBytes(9).toString("base64url").slice(0, 12).toUpperCase();

// ============ LIST ============
module.exports.list = async(req, res) => {
    try {
        const { search, userId, targetOrgId, assignedOrgId, from, to, status } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);
        const where = { isDeleted: false };
        if (userId) where.userId = userId;
        if (targetOrgId) where.targetOrgId = targetOrgId;
        if (assignedOrgId) where.assignedOrgId = assignedOrgId;
        if (status) where.status = status;
        if (from || to) where.dateDemande = {...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
        if (search) {
            where.OR = [
                { code: { contains: search, mode: "insensitive" } },
                { annee: { contains: search, mode: "insensitive" } },
                { niveau: { contains: search, mode: "insensitive" } },
                { user: { is: { email: { contains: search, mode: "insensitive" } } } },
                { targetOrg: { is: { name: { contains: search, mode: "insensitive" } } } },
            ];
        }
        const [rows, total] = await Promise.all([
            prisma.demandePartage.findMany({
                where,
                include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.demandePartage.count({ where }),
        ]);
        res.status(200).json({
            demandes: rows.map(serializeDemande),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, userId: userId || null, targetOrgId: targetOrgId || null, assignedOrgId: assignedOrgId || null, from: from || null, to: to || null, status: status || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("DEMANDE_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération demandes", code: "GET_DEMANDES_ERROR" });
    }
};

// ============ CREATE ============
module.exports.create = async(req, res) => {
    try {
        const {
            targetOrgId,
            assignedOrgId,
            userId,
            serie,
            niveau,
            mention,
            annee,
            countryOfSchool,
            secondarySchoolName,
            graduationDate,
            periode,
            year,
            status,
            statusPayment = "PAYER",
            dob,
            citizenship,
            passport,
            isEnglishFirstLanguage,
            englishProficiencyTests,
            testScores,
            gradingScale,
            gpa,
            examsTaken,
            intendedMajor,
            extracurricularActivities,
            honorsOrAwards,
            parentGuardianName,
            occupation,
            educationLevel,
            willApplyForFinancialAid,
            hasExternalSponsorship,
            visaType,
            hasPreviouslyStudiedInUS,
            personalStatement,
            optionalEssay,
            applicationRound,
            howDidYouHearAboutUs,
            invitedOrganizations,
            notifyOrgIds
        } = req.body;

        const target = await prisma.organization.findUnique({ where: { id: targetOrgId }, select: { id: true, deletedAt: true } });
        if (!target || target.deletedAt) return res.status(400).json({ message: "Organisation cible invalide", code: "ORG_INVALID" });

        if (assignedOrgId) {
            const assigned = await prisma.organization.findUnique({ where: { id: assignedOrgId }, select: { id: true, deletedAt: true } });
            if (!assigned || assigned.deletedAt) return res.status(400).json({ message: "Organisation assignée invalide", code: "ASSIGNED_ORG_INVALID" });
        }

        let code = await buildCodeBase();

        const created = await prisma.demandePartage.create({
            data: {
                code,
                user: { connect: { id: userId || res.locals.user.id } },
                targetOrg: { connect: { id: targetOrgId } },
                ...(assignedOrgId ? { assignedOrg: { connect: { id: assignedOrgId } } } : {}),
                serie: serie || null,
                niveau: niveau || null,
                mention: mention || null,
                annee: annee || null,
                countryOfSchool: countryOfSchool || null,
                secondarySchoolName: secondarySchoolName || null,
                graduationDate: toDateOrNull(graduationDate),
                periode: periode || null,
                year: year || null,
                status: status || "PENDING",
                observation: null,
                statusPayment: statusPayment || null,
                dob: toDateOrNull(dob),
                citizenship: citizenship || null,
                passport: passport || null,
                isEnglishFirstLanguage: typeof isEnglishFirstLanguage === "boolean" ? isEnglishFirstLanguage : null,
                englishProficiencyTests: safeJson(englishProficiencyTests) || null,
                testScores: testScores || null,
                gradingScale: gradingScale || null,
                gpa: gpa || null,
                examsTaken: safeJson(examsTaken) || null,
                intendedMajor: intendedMajor || null,
                extracurricularActivities: extracurricularActivities || null,
                honorsOrAwards: honorsOrAwards || null,
                parentGuardianName: parentGuardianName || null,
                occupation: occupation || null,
                educationLevel: educationLevel || null,
                willApplyForFinancialAid: typeof willApplyForFinancialAid === "boolean" ? willApplyForFinancialAid : null,
                hasExternalSponsorship: typeof hasExternalSponsorship === "boolean" ? hasExternalSponsorship : null,
                visaType: visaType || null,
                hasPreviouslyStudiedInUS: typeof hasPreviouslyStudiedInUS === "boolean" ? hasPreviouslyStudiedInUS : null,
                personalStatement: personalStatement || null,
                optionalEssay: optionalEssay || null,
                applicationRound: applicationRound || null,
                howDidYouHearAboutUs: howDidYouHearAboutUs || null,
            },
            include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
        });


        const rawInvites = Array.isArray(invitedOrganizations) ? invitedOrganizations : [];
        const validInvites = rawInvites
            .map(x => ({
                name: String(x.name).trim(),
                email: String(x.email).trim().toLowerCase(),
                phone: x.phone ? String(x.phone).trim() : null,
                address: x.address ? String(x.address).trim() : null,
                roleKey: x.roleKey ? String(x.roleKey).trim() : null,
            }));

        // Créer et emailer
        for (const inv of validInvites) {
            const token = crypto.randomBytes(24).toString("hex");
            const exp = new Date(Date.now() + 7 * 24 * 3600 * 1000);

            await prisma.organizationInvite.create({
                data: {
                    inviterOrgId: targetOrgId, // <- ou assignedOrgId si tu préfères
                    inviteeOrgId: null,
                    inviteeName: inv.name,
                    inviteeEmail: inv.email,
                    inviteePhone: inv.phone,
                    inviteeAddress: inv.address,
                    token,
                    status: "PENDING",
                    roleKey: inv.roleKey || "DOC_CONTRIBUTOR",
                    expiresAt: exp,
                },
            });

            // Email à l'université invitée
            try {
                const frontendBase = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
                const addDocUrl = `${frontendBase}/org/invitations/accept?token=${encodeURIComponent(token)}&code=${encodeURIComponent(created.code)}`;

                await emailService.sendInviteUniversity({
                    to: inv.email,
                    subject: "Invitation à ajouter des documents pour une demande",
                    context: {
                        orgName: inv.name,
                        demandeurName: created.user.firstName || created.user.name || "Demandeur",
                        siteName: (await emailService.getSiteSettings()).siteName || "APPLYONS",
                        demandeCode: created.code,
                        targetOrgName: target.name || "",
                        addDocUrl,
                        expiresInDays: 7,
                    },
                });
            } catch (e) {
                console.warn("INVITE_EMAIL_ERROR:", inv.email, e.message || e);
            }
        }




        {
            const ids = Array.isArray(notifyOrgIds) ? notifyOrgIds : [];
            if (ids.length) {
                const orgsToNotify = await prisma.organization.findMany({
                    where: { id: { in: ids } },
                    select: { id: true, type: true, name: true, email: true },
                });

                // filtre: pas la cible, pas les traducteurs
                const filtered = orgsToNotify.filter(o => o.id !== targetOrgId && o.type !== "TRADUCTEUR");

                const frontendBase = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
                const infoUrl = `${frontendBase}/org/documents?code=${encodeURIComponent(created.code)}`; // optionnel

                for (const org of filtered) {
                    const to = (org.email || "").trim();

                    try {
                        await emailService.sendOrgDemandeNotification({
                            to,
                            context: {
                                orgName: org.name,
                                demandeurName: created.user.firstName || created.user.name || "Demandeur",
                                siteName: (await emailService.getSiteSettings()).siteName || "APPLYONS",
                                demandeCode: created.code,
                                targetOrgName: created.targetOrg.name || "",
                                infoUrl,
                            },
                        });
                    } catch (e) {
                        console.warn("NOTIFY_ORG_EMAIL_ERROR:", org.id, to, e.message || e);
                    }
                }
            }
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_CREATED",
            resource: "demandes",
            resourceId: created.id,
            details: req.body,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({ message: "Demande créée", demande: serializeDemande(created) });
    } catch (e) {
        console.error("DEMANDE_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création demande", code: "CREATE_DEMANDE_ERROR" });
    }
};

// ============ GET BY ID ============
module.exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        let d = await prisma.demandePartage.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        role: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                type: true,
                                phone: true,
                                address: true,
                                website: true,
                                country: true,
                            }
                        },
                    },
                },
                targetOrg: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
                        phone: true,
                        address: true,
                        website: true,
                        country: true,
                    }
                },
                assignedOrg: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
                        phone: true,
                        address: true,
                        website: true,
                        country: true,
                    }
                },
                transaction: true,
                payment: true,
                documents: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        ownerOrg: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                type: true,
                                phone: true,
                                address: true,
                                website: true,
                                country: true,
                            }
                        },
                        blockchainBlocks: true,
                    },
                },
                _count: { select: { documents: true } },
            },
        });

        if (!d) {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }

        let payment = null;
        try {
            if (d.payment === undefined) {
                payment = await prisma.payment.findFirst({ where: { demandePartageId: d.id } });
            } else {
                payment = d.payment;
            }
        } catch {
            payment = null;
        }

        const fullDemande = {
            ...d,
            payment,
        };

        return res.status(200).json({
            demande: fullDemande,
        });
    } catch (e) {
        console.error("DEMANDE_GET_ERROR:", e);
        return res.status(500).json({ message: "Échec récupération demande", code: "GET_DEMANDE_ERROR" });
    }
};

// ============ UPDATE ============
module.exports.update = async(req, res) => {
    try {
        const { id } = req.params;
        const {
            assignedOrgId,
            serie,
            niveau,
            mention,
            annee,
            countryOfSchool,
            secondarySchoolName,
            graduationDate,
            periode,
            year,
            status,
            observation,
            statusPayment,
            dob,
            citizenship,
            passport,
            isEnglishFirstLanguage,
            englishProficiencyTests,
            testScores,
            gradingScale,
            gpa,
            examsTaken,
            intendedMajor,
            extracurricularActivities,
            honorsOrAwards,
            parentGuardianName,
            occupation,
            educationLevel,
            willApplyForFinancialAid,
            hasExternalSponsorship,
            visaType,
            hasPreviouslyStudiedInUS,
            personalStatement,
            optionalEssay,
            applicationRound,
            howDidYouHearAboutUs,
        } = req.body;

        if (typeof assignedOrgId !== "undefined" && assignedOrgId) {
            const assigned = await prisma.organization.findUnique({ where: { id: assignedOrgId }, select: { id: true, deletedAt: true } });
            if (!assigned || assigned.deletedAt) {
                return res.status(400).json({ message: "Organisation assignée invalide", code: "ASSIGNED_ORG_INVALID" });
            }
        }

        const patch = {
            assignedOrgId: assignedOrgId === undefined ? undefined : (assignedOrgId || null),
            serie: serie === undefined ? undefined : (serie || null),
            niveau: niveau === undefined ? undefined : (niveau || null),
            mention: mention === undefined ? undefined : (mention || null),
            annee: annee === undefined ? undefined : (annee || null),
            countryOfSchool: countryOfSchool === undefined ? undefined : (countryOfSchool || null),
            secondarySchoolName: secondarySchoolName === undefined ? undefined : (secondarySchoolName || null),
            graduationDate: toDateOrNull(graduationDate),
            periode: periode === undefined ? undefined : (periode || null),
            year: year === undefined ? undefined : (year || null),
            status: status === undefined ? undefined : status,
            observation: observation === undefined ? undefined : (observation || null),
            statusPayment: statusPayment === undefined ? undefined : (statusPayment || null),
            dob: toDateOrNull(dob),
            citizenship: citizenship === undefined ? undefined : (citizenship || null),
            passport: passport === undefined ? undefined : (passport || null),
            isEnglishFirstLanguage: isEnglishFirstLanguage === undefined ? undefined : !!isEnglishFirstLanguage,
            englishProficiencyTests: englishProficiencyTests === undefined ? undefined : safeJson(englishProficiencyTests),
            testScores: testScores === undefined ? undefined : (testScores || null),
            gradingScale: gradingScale === undefined ? undefined : (gradingScale || null),
            gpa: gpa === undefined ? undefined : (gpa || null),
            examsTaken: examsTaken === undefined ? undefined : safeJson(examsTaken),
            intendedMajor: intendedMajor === undefined ? undefined : (intendedMajor || null),
            extracurricularActivities: extracurricularActivities === undefined ? undefined : (extracurricularActivities || null),
            honorsOrAwards: honorsOrAwards === undefined ? undefined : (honorsOrAwards || null),
            parentGuardianName: parentGuardianName === undefined ? undefined : (parentGuardianName || null),
            occupation: occupation === undefined ? undefined : (occupation || null),
            educationLevel: educationLevel === undefined ? undefined : (educationLevel || null),
            willApplyForFinancialAid: willApplyForFinancialAid === undefined ? undefined : !!willApplyForFinancialAid,
            hasExternalSponsorship: hasExternalSponsorship === undefined ? undefined : !!hasExternalSponsorship,
            visaType: visaType === undefined ? undefined : (visaType || null),
            hasPreviouslyStudiedInUS: hasPreviouslyStudiedInUS === undefined ? undefined : !!hasPreviouslyStudiedInUS,
            personalStatement: personalStatement === undefined ? undefined : (personalStatement || null),
            optionalEssay: optionalEssay === undefined ? undefined : (optionalEssay || null),
            applicationRound: applicationRound === undefined ? undefined : (applicationRound || null),
            howDidYouHearAboutUs: howDidYouHearAboutUs === undefined ? undefined : (howDidYouHearAboutUs || null),
        };

        const updated = await prisma.demandePartage.update({
            where: { id },
            data: patch,
            include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
        });

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_UPDATED",
            resource: "demandes",
            resourceId: id,
            details: req.body,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({ message: "Demande mise à jour", demande: serializeDemande(updated) });
    } catch (e) {
        console.error("DEMANDE_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour demande", code: "UPDATE_DEMANDE_ERROR" });
    }
};

// ============ CHANGE STATUS ============
module.exports.changeStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.demandePartage.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                targetOrg: true,
                assignedOrg: true,
                transaction: true,
                _count: { select: { documents: true } },
            },
        });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_STATUS_UPDATED",
            resource: "demandes",
            resourceId: id,
            details: { status },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Statut mis à jour", demande: serializeDemande(updated) });
    } catch (e) {
        console.error("DEMANDE_STATUS_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour statut", code: "UPDATE_STATUS_ERROR" });
    }
};

// ============ ASSIGN / UNASSIGN ORG ============
module.exports.assignOrg = async(req, res) => {
    try {
        const { id } = req.params;
        const { assignedOrgId } = req.body;
        if (assignedOrgId) {
            const assigned = await prisma.organization.findUnique({
                where: { id: assignedOrgId },
                select: { id: true, deletedAt: true },
            });
            if (!assigned || assigned.deletedAt) {
                return res.status(400).json({ message: "Organisation assignée invalide", code: "ASSIGNED_ORG_INVALID" });
            }
        }
        const updated = await prisma.demandePartage.update({
            where: { id },
            data: { assignedOrgId: assignedOrgId || null },
            include: {
                user: true,
                targetOrg: true,
                assignedOrg: true,
                transaction: true,
                _count: { select: { documents: true } },
            },
        });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_ORG_ASSIGNED",
            resource: "demandes",
            resourceId: id,
            details: { assignedOrgId },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Assignation mise à jour", demande: serializeDemande(updated) });
    } catch (e) {
        console.error("DEMANDE_ASSIGN_ERROR:", e);
        res.status(500).json({ message: "Échec assignation", code: "ASSIGN_ERROR" });
    }
};

// ============ SOFT / RESTORE / HARD DELETE ============
module.exports.softDelete = async(req, res) => {
    try {
        const { id } = req.params;
        await prisma.demandePartage.update({ where: { id }, data: { isDeleted: true } });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_SOFT_DELETED",
            resource: "demandes",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Demande archivée" });
    } catch (e) {
        console.error("DEMANDE_SOFT_DELETE_ERROR:", e);
        res.status(500).json({ message: "Échec suppression demande", code: "DELETE_DEMANDE_ERROR" });
    }
};

module.exports.restore = async(req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.demandePartage.update({ where: { id }, data: { isDeleted: false } });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_RESTORED",
            resource: "demandes",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Demande restaurée" });
    } catch (e) {
        console.error("DEMANDE_RESTORE_ERROR:", e);
        res.status(500).json({ message: "Échec restauration demande", code: "RESTORE_DEMANDE_ERROR" });
    }
};

module.exports.hardDelete = async(req, res) => {
    try {
        const { id } = req.params;
        await prisma.demandePartage.delete({ where: { id } });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_HARD_DELETED",
            resource: "demandes",
            resourceId: id,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Demande supprimée définitivement" });
    } catch (e) {
        console.error("DEMANDE_HARD_DELETE_ERROR:", e);
        if (e.code === "P2025") {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }
        res.status(500).json({ message: "Échec suppression définitive", code: "HARD_DELETE_ERROR" });
    }
};

// ============ DOCUMENTS ============
module.exports.listDocuments = async(req, res) => {
    try {
        const { id } = req.params; // <- id de DemandePartage
        if (!id) {
            return res.status(400).json({ message: "demandePartageId requis", code: "MISSING_DEMANDE_ID" });
        }

        const {
            page,
            limit,
            estTraduit, // "true" | "false" (optionnel)
            onlyEncrypted, // "true" pour ne récupérer que les docs chiffrés (optionnel)
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Champs autorisés pour le tri (présents dans DocumentPartage)
        const SORTABLE = new Set(["createdAt", "updatedAt", "encryptedAt", "id"]);
        const safeSortBy = SORTABLE.has(sortBy) ? sortBy : "createdAt";
        const safeSortOrder = String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc";

        // Filtre de base
        const where = {
            demandePartageId: id,
            deletedAt: null,
            ...(typeof estTraduit !== "undefined" ? { estTraduit: String(estTraduit).toLowerCase() === "true" } : {}),
            ...(String(onlyEncrypted).toLowerCase() === "true" ? { urlChiffre: { not: null } } : {}),
        };

        const usePagination = page && limit;
        const take = usePagination ? Math.min(parseInt(limit, 10) || 10, 100) : undefined;
        const currentPage = usePagination ? Math.max(parseInt(page, 10) || 1, 1) : undefined;
        const skip = usePagination ? (currentPage - 1) * (take || 0) : undefined;

        const orderBy = [{
            [safeSortBy]: safeSortOrder
        }];

        const [items, total] = await Promise.all([
            prisma.documentPartage.findMany({
                where,
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    demandePartageId: true,
                    ownerOrgId: true,
                    urlOriginal: true,
                    urlChiffre: true,
                    urlTraduit: true,
                    estTraduit: true,
                    aDocument: true,
                    blockchainHash: true,
                    encryptedBy: true,
                    encryptedAt: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                    ownerOrg: { select: { id: true, name: true, slug: true, type: true } },
                    // blockchainBlocks: true, // décommente si besoin
                },
            }),
            usePagination ? prisma.documentPartage.count({ where }) : Promise.resolve(undefined),
        ]);

        if (usePagination) {
            return res.status(200).json({
                documents: items,
                pagination: {
                    page: currentPage,
                    limit: take,
                    total,
                    pages: Math.ceil(total / (take || 1)),
                },
            });
        }

        // Compat: même forme que ta version initiale
        return res.status(200).json({ documents: items });
    } catch (e) {
        console.error("DEMANDE_LIST_DOCS_ERROR:", e);
        return res.status(500).json({ message: "Échec récupération documents", code: "GET_DOCS_ERROR" });
    }
};


// ============ ADD DOCUMENT WITH AUTOMATIC ENCRYPTION ============
module.exports.addDocument = async(req, res) => {
    try {
        const { id } = req.params;
        const { ownerOrgId, urlOriginal } = req.body;
        if (!ownerOrgId) {
            return res.status(400).json({ message: "ownerOrgId requis", code: "OWNER_REQUIRED" });
        }

        const created = await prisma.documentPartage.create({
            data: {
                demandePartageId: id,
                ownerOrgId,
                urlOriginal: urlOriginal || null,
                aDocument: true,
            },
        });

        if (urlOriginal) {
            try {
                const tempDir = path.join(__dirname, '../../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                const originalPath = path.join(tempDir, `original_${created.id}${path.extname(urlOriginal)}`);
                await downloadFile(urlOriginal, originalPath);
                const key = cryptoService.generateKey();
                const iv = cryptoService.generateIV();
                const { encryptedPath, hash } = await cryptoService.encryptFile(originalPath, key, iv);
                const encryptedUrl = await uploadFile(encryptedPath);
                await prisma.documentPartage.update({
                    where: { id: created.id },
                    data: {
                        urlChiffre: encryptedUrl,
                        encryptionKey: key,
                        encryptionIV: iv,
                        blockchainHash: hash,
                        encryptedBy: res.locals.user.id,
                        encryptedAt: new Date()
                    }
                });
                fs.unlinkSync(originalPath);
                fs.unlinkSync(encryptedPath);
                await createAuditLog({
                    userId: res.locals.user.id,
                    action: "DOCUMENT_ENCRYPTED_ON_CREATE",
                    resource: "documents",
                    resourceId: created.id,
                    details: { hash, encryptedUrl },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            } catch (encryptionError) {
                console.error("Erreur chiffrement automatique:", encryptionError);
                await createAuditLog({
                    userId: res.locals.user.id,
                    action: "DOCUMENT_CREATED_WITH_ENCRYPTION_ERROR",
                    resource: "documents",
                    resourceId: created.id,
                    details: { error: encryptionError.message },
                    ipAddress: req.ip,
                    userAgent: req.get("User-Agent"),
                });
            }
        }

        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_DOCUMENT_ADDED",
            resource: "demandes",
            resourceId: id,
            details: { documentId: created.id },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(201).json({
            message: "Document enregistré et chiffré",
            document: {
                ...created,
                urlChiffre: created.urlChiffre || null,
                encryptionKey: created.encryptionKey ? "*** (chiffré)" : null,
                blockchainHash: created.blockchainHash || null
            }
        });
    } catch (e) {
        console.error("DEMANDE_ADD_DOC_ERROR:", e);
        res.status(500).json({ message: "Échec ajout document", code: "ADD_DOC_ERROR" });
    }
};

// ============ GET DOCUMENT CONTENT ============
module.exports.getDocumentContent = async(req, res) => {
    try {
        const { documentId } = req.params;
        const { type = 'original' } = req.query;
        const document = await prisma.documentPartage.findUnique({
            where: { id: documentId },
            select: {
                id: true,
                urlOriginal: true,
                urlTraduit: true,
                urlChiffre: true,
                encryptionKey: true,
                encryptionIV: true,
                estTraduit: true,
                aDocument: true,
                blockchainHash: true
            }
        });

        if (!document) {
            return res.status(404).json({ message: "Document introuvable", code: "DOCUMENT_NOT_FOUND" });
        }

        let fileUrl;
        let isEncrypted = false;

        if (type === 'traduit' && document.estTraduit && document.urlTraduit) {
            fileUrl = document.urlTraduit;
        } else if (document.urlOriginal) {
            fileUrl = document.urlOriginal;
        } else if (document.urlChiffre) {
            fileUrl = document.urlChiffre;
            isEncrypted = true;
        } else {
            return res.status(404).json({ message: "Aucun fichier disponible pour ce document", code: "NO_FILE_AVAILABLE" });
        }

        if (isEncrypted && document.encryptionKey && document.encryptionIV) {
            try {
                const tempDir = path.join(__dirname, '../../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                const encryptedPath = path.join(tempDir, `encrypted_${document.id}.pdf`);
                await downloadFile(fileUrl, encryptedPath);
                const decryptedPath = path.join(tempDir, `decrypted_${document.id}.pdf`);
                await cryptoService.decryptFile(encryptedPath, document.encryptionKey, document.encryptionIV, decryptedPath);
                const fileData = fs.readFileSync(decryptedPath);
                const currentHash = cryptoService.calculateHash(fileData);
                if (document.blockchainHash && currentHash !== document.blockchainHash) {
                    fs.unlinkSync(encryptedPath);
                    fs.unlinkSync(decryptedPath);
                    return res.status(403).json({
                        message: "Violation d'intégrité détectée - le document a peut-être été altéré",
                        code: "INTEGRITY_VIOLATION"
                    });
                }
                res.setHeader('Content-disposition', `inline; filename="document_${document.id}.pdf"`);
                res.setHeader('Content-type', 'application/pdf');
                fs.createReadStream(decryptedPath).pipe(res);
                res.on('finish', () => {
                    fs.unlinkSync(encryptedPath);
                    fs.unlinkSync(decryptedPath);
                });
            } catch (decryptError) {
                console.error("Erreur déchiffrement:", decryptError);
                return res.status(500).json({
                    message: "Échec déchiffrement du document",
                    code: "DECRYPT_ERROR"
                });
            }
        } else {
            const fileStream = await getFileStreamFromStorage(fileUrl);
            res.setHeader('Content-disposition', `inline; filename="document_${document.id}.pdf"`);
            res.setHeader('Content-type', 'application/pdf');
            fileStream.pipe(res);
        }
    } catch (e) {
        console.error("DOCUMENT_CONTENT_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération contenu document",
            code: "DOCUMENT_CONTENT_ERROR"
        });
    }
};

// ============ GET DOCUMENT INFO FOR FRONTEND ============
module.exports.getDocumentInfo = async(req, res) => {
    try {
        const { documentId } = req.params;
        const document = await prisma.documentPartage.findUnique({
            where: { id: documentId },
            select: {
                id: true,
                estTraduit: true,
                aDocument: true,
                createdAt: true,
                urlOriginal: true,
                urlTraduit: true,
                urlChiffre: true,
                blockchainHash: true,
                encryptedAt: true,
                ownerOrg: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!document) {
            return res.status(404).json({ message: "Document introuvable", code: "DOCUMENT_NOT_FOUND" });
        }

        res.status(200).json({
            document: {
                id: document.id,
                codeAdn: document.codeAdn,
                estTraduit: document.estTraduit,
                aDocument: document.aDocument,
                createdAt: document.createdAt,
                hasOriginal: !!document.urlOriginal,
                hasTraduit: document.estTraduit && !!document.urlTraduit,
                hasEncrypted: !!document.urlChiffre,
                isEncrypted: !!document.urlChiffre,
                blockchainHash: document.blockchainHash,
                encryptedAt: document.encryptedAt,
                ownerOrg: document.ownerOrg,
                contentUrls: {
                    original: `/api/demandes/documents/${document.id}/content?type=original`,
                    traduit: document.estTraduit ? `/api/demandes/documents/${document.id}/content?type=traduit` : null
                }
            }
        });
    } catch (e) {
        console.error("DOCUMENT_INFO_ERROR:", e);
        res.status(500).json({
            message: "Échec récupération informations document",
            code: "DOCUMENT_INFO_ERROR"
        });
    }
};

// ============ PAYMENTS ============
module.exports.createPayment = async(req, res) => {
    try {
        const { id } = req.params;
        const { provider, amount, currency, paymentType } = req.body;
        const demande = await prisma.demandePartage.findUnique({ where: { id } });
        if (!demande) {
            return res.status(404).json({ message: "Demande introuvable", code: "DEMANDE_NOT_FOUND" });
        }
        const payment = await prisma.payment.create({
            data: {
                demandePartage: { connect: { id } },
                provider,
                amount: new prisma.Decimal(amount),
                currency,
                paymentType,
                status: "INITIATED",
            },
        });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_PAYMENT_CREATED",
            resource: "demandes",
            resourceId: id,
            details: { paymentId: payment.id },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(201).json({ message: "Paiement créé", payment });
    } catch (e) {
        console.error("PAYMENT_CREATE_ERROR:", e);
        res.status(500).json({ message: "Échec création paiement", code: "CREATE_PAYMENT_ERROR" });
    }
};

module.exports.updatePaymentStatus = async(req, res) => {
    try {
        const { demandeId } = req.params;
        const { status, providerRef, paymentInfo } = req.body;
        const payment = await prisma.payment.update({
            where: { demandePartageId: demandeId },
            data: {
                status,
                providerRef: providerRef || null,
                paymentInfo: paymentInfo || undefined,
            },
        });
        await createAuditLog({
            userId: res.locals.user.id,
            action: "DEMANDE_PAYMENT_UPDATED",
            resource: "demandes",
            resourceId: demandeId,
            details: { status, providerRef },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });
        res.status(200).json({ message: "Statut paiement mis à jour", payment });
    } catch (e) {
        console.error("PAYMENT_UPDATE_ERROR:", e);
        res.status(500).json({ message: "Échec mise à jour paiement", code: "UPDATE_PAYMENT_ERROR" });
    }
};

// ============ STATS ============
module.exports.stats = async(req, res) => {
        try {
            const { orgId, assignedOrgId, months = 12 } = req.query;
            const monthly = await prisma.$queryRaw `
            SELECT date_trunc('month', "dateDemande") AS month, COUNT(*)::int AS total
            FROM "DemandePartage"
            WHERE "isDeleted" = false
            ${orgId ? prisma.sql`AND "targetOrgId" = ${orgId}` : prisma.empty}
            ${assignedOrgId ? prisma.sql`AND "assignedOrgId" = ${assignedOrgId}` : prisma.empty}
            GROUP BY month
            ORDER BY month DESC
            LIMIT ${Number(months)}
        `;
        const byStatus = await prisma.demandePartage.groupBy({
            by: ["status"],
            where: {
                isDeleted: false,
                ...(orgId ? { targetOrgId: orgId } : {}),
                ...(assignedOrgId ? { assignedOrgId } : {}),
            },
            _count: { _all: true },
        });
        res.status(200).json({
            monthly: monthly
                .map((r) => ({ month: r.month, total: Number(r.total) }))
                .sort((a, b) => new Date(a.month) - new Date(b.month)),
            byStatus: byStatus.map((r) => ({ status: r.status || "UNKNOWN", count: r._count._all })),
        });
    } catch (e) {
        console.error("DEMANDE_STATS_ERROR:", e);
        res.status(500).json({ message: "Échec stats", code: "STATS_ERROR" });
    }
};

// ============ HELPER FUNCTIONS ============
async function downloadFile(url, outputPath) {
    const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
    });
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function uploadFile(filePath) {
    return `https://storage.example.com/${path.basename(filePath)}`;
}

async function getFileStreamFromStorage(url) {
    // Implémentez selon votre système de stockage
    const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
    });
    return response.data;
}

// ============ LIST BY USER ID ============
module.exports.listDemandesByUserId = async (req, res) => {
    try {
        const { userId, assignedOrgId } = req.params;
        const { page = 1, limit = 10, sortBy = "dateDemande", sortOrder = "desc" } = req.query;
        const pagination = sanitizePagination({ page, limit, sortBy, sortOrder, assignedOrgId });

        const where = {
            userId,
            assignedOrgId: assignedOrgId,
            isDeleted: false
        };
        const [rows, total] = await Promise.all([
            prisma.demandePartage.findMany({
                where,
                include: {
                    user: {
                        include: {
                            organization: true,
                        },
                    },
                    targetOrg: true,
                    assignedOrg: true,
                    transaction: true,
                    documents: true,
                    documents: true
                        ? {
                            include: {
                                ownerOrg: true,
                                blockchainBlocks: true,
                            },
                            orderBy: { createdAt: "desc" },
                        }
                        : false,

                    _count: {
                        select: { documents: true }
                    }
                },
                orderBy: { [pagination.sortBy]: pagination.sortOrder },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.demandePartage.count({ where }),
        ]);
        res.status(200).json({
            demandes: rows.map(serializeDemande),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit)
            }
        });
    } catch (e) {
        console.error("LIST_DEMANDES_BY_USER_ERROR:", e);
        res.status(500).json({ message: "Échec récupération demandes utilisateur", code: "LIST_DEMANDES_BY_USER_ERROR" });
    }
};

// ============ LIST BY ORG ID ============
module.exports.listDemandesByOrgId = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { page = 1, limit = 10, sortBy = "dateDemande", sortOrder = "desc" } = req.query;
        const pagination = sanitizePagination({ page, limit, sortBy, sortOrder });
        const where = {
            targetOrgId: orgId,
            isDeleted: false
        };
        const [rows, total] = await Promise.all([
            prisma.demandePartage.findMany({
                where,
                include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
                orderBy: { [pagination.sortBy]: pagination.sortOrder },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.demandePartage.count({ where }),
        ]);
        res.status(200).json({
            demandes: rows.map(serializeDemande),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit)
            }
        });
    } catch (e) {
        console.error("LIST_DEMANDES_BY_ORG_ID_ERROR:", e);
        res.status(500).json({ message: "Échec récupération demandes par ID d'organisation", code: "LIST_DEMANDES_BY_ORG_ID_ERROR" });
    }
};

// ============ LIST DOCUMENTS BY DEMANDE ID ============

// controllers/document.controller.js (CommonJS)
module.exports.listDocumentsByDemandeId = async (req, res) => {
    try {
        const { demandeId } = req.params; // <- ID de DemandePartage
        if (!demandeId) {
            return res.status(400).json({ success: false, message: "demandeId requis" });
        }

        const {
            page,
            limit,
            estTraduit,                // optionnel: "true" / "false"
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Champs autorisés pour le tri (présents dans DocumentPartage)
        const SORTABLE = new Set([
            "createdAt",
            "updatedAt",
            "encryptedAt",
            "id",
        ]);
        const safeSortBy = SORTABLE.has(sortBy) ? sortBy : "createdAt";
        const safeSortOrder = (String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc");

        // Filtre de base
        const where = {
            demandePartageId: demandeId,
            deletedAt: null,
            ...(typeof estTraduit !== "undefined"
                ? { estTraduit: String(estTraduit).toLowerCase() === "true" }
                : {}),
        };

        const usePagination = page && limit;
        const take = usePagination ? Math.min(parseInt(limit, 10) || 10, 100) : undefined;
        const skip = usePagination ? Math.max((parseInt(page, 10) || 1) - 1, 0) * (take || 0) : undefined;

        const orderBy = [{ [safeSortBy]: safeSortOrder }];

        const [items, total] = await Promise.all([
            prisma.documentPartage.findMany({
                where,
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    mention: true,
                    type: true,
                    dateObtention: true,
                    demandePartageId: true,
                    ownerOrgId: true,
                    urlOriginal: true,
                    urlChiffre: true,
                    urlTraduit: true,
                    encryptionKey: true,
                    encryptionKeyTraduit: true,
                    estTraduit: true,
                    aDocument: true,
                    encryptionIV: true,
                    blockchainHash: true,
                    encryptedBy: true,
                    encryptedAt: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                    ownerOrg: {
                        select: { id: true, name: true, slug: true, type: true },
                    },
                    // Si tu veux aussi les blocs:
                    // blockchainBlocks: true,
                },
            }),
            usePagination ? prisma.documentPartage.count({ where }) : Promise.resolve(undefined),
        ]);

        if (usePagination) {
            const current = parseInt(page, 10) || 1;
            return res.json({
                items,
                pagination: {
                    page: current,
                    limit: take,
                    total,
                    pages: Math.ceil(total / take),
                },
            });
        }

        return res.json(items);
    } catch (err) {
        console.error("listDocumentsByDemandeId error:", err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};


module.exports.listDemandesToTreatByOrgId = async (req, res) => {

    try {

        const { assignedOrgId } = req.params;
        if (!assignedOrgId) {
            return res.status(400).json({ message: "assignedOrgId requis", code: "MISSING_ASSIGNED_ORG_ID" });
        }

        const where = {
            assignedOrgId,
            isDeleted: false
        };
        const { search, userId, targetOrgId, from, to, status } = req.query;
        const { page, limit, skip, sortBy, sortOrder } = sanitizePagination(req.query);


        if (userId) where.userId = userId;
        if (targetOrgId) where.targetOrgId = targetOrgId;
        if (assignedOrgId) where.assignedOrgId = assignedOrgId;
        if (status) where.status = status;
        if (from || to) where.dateDemande = { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
        if (search) {
            where.OR = [
                { code: { contains: search, mode: "insensitive" } },
                { annee: { contains: search, mode: "insensitive" } },
                { niveau: { contains: search, mode: "insensitive" } },
                { user: { is: { email: { contains: search, mode: "insensitive" } } } },
                { targetOrg: { is: { name: { contains: search, mode: "insensitive" } } } },
            ];
        }
        const [rows, total] = await Promise.all([
            prisma.demandePartage.findMany({
                where,
                include: { user: true, targetOrg: true, assignedOrg: true, transaction: true, _count: { select: { documents: true } } },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit,
            }),
            prisma.demandePartage.count({ where }),
        ]);
        res.status(200).json({
            demandes: rows.map(serializeDemande),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: { search: search || null, userId: userId || null, targetOrgId: targetOrgId || null, assignedOrgId: assignedOrgId || null, from: from || null, to: to || null, status: status || null, sortBy, sortOrder },
        });
    } catch (e) {
        console.error("DEMANDE_LIST_ERROR:", e);
        res.status(500).json({ message: "Échec récupération demandes", code: "GET_DEMANDES_ERROR" });
    }
};