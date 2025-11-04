// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Applyons Backoffice API",
//             version: "1.0.0",
//             description: "API Documentation for Applyons Backoffice",
//             contact: { name: "Applyons Support", email: "support@applyons.com" },
//         },
//         servers: [
//             { url: "http://localhost:5000", description: "Local server" },
//             { url: "https://api-applyons.applyons.com", description: "Serveur Applyons" },
//         ],
//         components: {
//             securitySchemes: {
//                 bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
//             },

//             /* ---------- Parameters (réutilisables dans les routes) ---------- */
//             parameters: {
//                 page: { in: "query",
//                     name: "page",
//                     schema: { type: "integer", minimum: 1, default: 1 },
//                     description: "Numéro de page (1-n)",
//                 },
//                 limit: { in: "query",
//                     name: "limit",
//                     schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
//                     description: "Taille de page",
//                 },
//                 sortBy: { in: "query",
//                     name: "sortBy",
//                     schema: { type: "string" },
//                     description: "Champ de tri (selon ressource)",
//                 },
//                 sortOrder: { in: "query",
//                     name: "sortOrder",
//                     schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
//                     description: "Ordre de tri",
//                 },
//             },

//             /* ---------------------- Schemas globaux ------------------------ */
//             schemas: {
//                 /* Utilitaires */
//                 Pagination: {
//                     type: "object",
//                     properties: {
//                         page: { type: "integer", example: 1 },
//                         limit: { type: "integer", example: 10 },
//                         total: { type: "integer", example: 123 },
//                         pages: { type: "integer", example: 13 },
//                     },
//                 },
//                 Error: {
//                     type: "object",
//                     properties: {
//                         message: { type: "string" },
//                         code: { type: "string" },
//                         errors: {
//                             type: "array",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     msg: { type: "string" },
//                                     param: { type: "string" },
//                                     location: { type: "string" },
//                                 },
//                             },
//                         },
//                     },
//                 },
//                 MessageOnly: {
//                     type: "object",
//                     properties: { message: { type: "string" } },
//                     example: { message: "Opération effectuée" },
//                 },

//                 /* Référentiels légers pour les embeds */
//                 UserLite: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         username: { type: "string" },
//                     },
//                 },
//                 OrganizationLite: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         name: { type: "string" },
//                         slug: { type: "string" },
//                         type: { type: "string", nullable: true },
//                     },
//                 },

//                 /* ---------------------- Users (minimal) ---------------------- */
//                 User: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         username: { type: "string" },
//                         role: {
//                             type: "string",
//                             enum: ["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"],
//                         },
//                         enabled: { type: "boolean" },
//                         phone: { type: "string" },
//                         avatar: { type: "string" },
//                         country: { type: "string" },
//                         organization: {
//                             type: "object",
//                             properties: {
//                                 id: { type: "string" },
//                                 name: { type: "string" },
//                                 slug: { type: "string" },
//                                 type: { type: "string" },
//                             },
//                         },
//                         permissions: {
//                             type: "array",
//                             items: { type: "object", properties: { key: { type: "string" }, name: { type: "string" } } },
//                         },
//                     },
//                 },
//                 RegisterUser: {
//                     type: "object",
//                     required: ["email", "password"],
//                     properties: {
//                         username: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         password: { type: "string", minLength: 6 },
//                         role: { type: "string", enum: ["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR"] },
//                         organizationId: { type: "string" },
//                         permissions: { type: "array", items: { type: "string" } },
//                     },
//                 },
//                 UpdateProfile: {
//                     type: "object",
//                     properties: {
//                         username: { type: "string" },
//                         phone: { type: "string" },
//                         adress: { type: "string" },
//                         avatar: { type: "string" },
//                         country: { type: "string" },
//                     },
//                 },
//                 CreateUser: {
//                     allOf: [
//                         { $ref: "#/components/schemas/RegisterUser" },
//                         { type: "object", properties: { enabled: { type: "boolean" } } },
//                     ],
//                 },
//                 UpdateUser: {
//                     type: "object",
//                     properties: {
//                         username: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         role: { type: "string" },
//                         enabled: { type: "boolean" },
//                         organizationId: { type: "string" },
//                         permissions: { type: "array", items: { type: "string" } },
//                         phone: { type: "string" },
//                         adress: { type: "string" },
//                         country: { type: "string" },
//                         gender: { type: "string", enum: ["MALE", "FEMALE", "OTHER"] },
//                     },
//                 },

//                 /* -------- Organizations / Departments / Filieres ------------ */
//                 Organization: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         name: { type: "string" },
//                         slug: { type: "string" },
//                         type: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         phone: { type: "string" },
//                         address: { type: "string" },
//                         website: { type: "string" },
//                         country: { type: "string" },
//                     },
//                 },
//                 Department: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         organizationId: { type: "string" },
//                         name: { type: "string" },
//                         code: { type: "string" },
//                         description: { type: "string" },
//                     },
//                 },
//                 Filiere: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         departmentId: { type: "string" },
//                         name: { type: "string" },
//                         code: { type: "string" },
//                         description: { type: "string" },
//                         level: { type: "string" },
//                         department: { $ref: "#/components/schemas/Department" },
//                     },
//                 },

//                 /* ------- Demandes / Documents / Transactions / Payments ------ */
//                 Demande: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         code: { type: "string", nullable: true },
//                         dateDemande: { type: "string", format: "date-time" },
//                         isDeleted: { type: "boolean" },
//                         status: { type: "string", nullable: true },
//                         user: { $ref: "#/components/schemas/UserLite" },
//                         targetOrg: { $ref: "#/components/schemas/OrganizationLite" },
//                         assignedOrg: { $ref: "#/components/schemas/OrganizationLite" },
//                         meta: {
//                             type: "object",
//                             properties: {
//                                 serie: { type: "string", nullable: true },
//                                 niveau: { type: "string", nullable: true },
//                                 mention: { type: "string", nullable: true },
//                                 annee: { type: "string", nullable: true },
//                                 countryOfSchool: { type: "string", nullable: true },
//                                 secondarySchoolName: { type: "string", nullable: true },
//                                 graduationDate: { type: "string", format: "date-time", nullable: true },
//                             },
//                         },
//                         documentsCount: { type: "integer" },
//                         transaction: { $ref: "#/components/schemas/Transaction" },
//                     },
//                 },

//                 CreateDemande: {
//                     type: "object",
//                     required: ["targetOrgId"],
//                     properties: {
//                         targetOrgId: { type: "string" },
//                         assignedOrgId: { type: "string", nullable: true },
//                         userId: { type: "string", nullable: true },

//                         // académiques
//                         serie: { type: "string", nullable: true },
//                         niveau: { type: "string", nullable: true },
//                         mention: { type: "string", nullable: true },
//                         annee: { type: "string", nullable: true },
//                         countryOfSchool: { type: "string", nullable: true },
//                         secondarySchoolName: { type: "string", nullable: true },
//                         graduationDate: { type: "string", format: "date", nullable: true },

//                         // header/dossier
//                         periode: { type: "string", nullable: true },
//                         year: { type: "string", nullable: true },
//                         status: { type: "string", nullable: true },
//                         observation: { type: "string", nullable: true },

//                         // paiement statut métier
//                         statusPayment: { type: "string", nullable: true },

//                         // Identité
//                         dob: { type: "string", format: "date", nullable: true },
//                         citizenship: { type: "string", nullable: true },
//                         passport: { type: "string", nullable: true },

//                         // Anglais / tests
//                         isEnglishFirstLanguage: { type: "boolean", nullable: true },
//                         englishProficiencyTests: { type: "object", additionalProperties: true, nullable: true },
//                         testScores: { type: "string", nullable: true },

//                         // Scolarité / Notes
//                         gradingScale: { type: "string", nullable: true },
//                         gpa: { type: "string", nullable: true },
//                         examsTaken: { type: "object", additionalProperties: true, nullable: true },
//                         intendedMajor: { type: "string", nullable: true },

//                         // Activités / Distinctions
//                         extracurricularActivities: { type: "string", nullable: true },
//                         honorsOrAwards: { type: "string", nullable: true },

//                         // Famille
//                         parentGuardianName: { type: "string", nullable: true },
//                         occupation: { type: "string", nullable: true },
//                         educationLevel: { type: "string", nullable: true },

//                         // Financier
//                         willApplyForFinancialAid: { type: "boolean", nullable: true },
//                         hasExternalSponsorship: { type: "boolean", nullable: true },

//                         // Visa
//                         visaType: { type: "string", nullable: true },
//                         hasPreviouslyStudiedInUS: { type: "boolean", nullable: true },

//                         // Essays
//                         personalStatement: { type: "string", nullable: true },
//                         optionalEssay: { type: "string", nullable: true },

//                         // Candidature
//                         applicationRound: { type: "string", nullable: true },
//                         howDidYouHearAboutUs: { type: "string", nullable: true },
//                     },
//                 },

//                 UpdateDemande: {
//                     type: "object",
//                     properties: {
//                         assignedOrgId: { type: "string", nullable: true },

//                         // mêmes champs optionnels que CreateDemande
//                         serie: { type: "string", nullable: true },
//                         niveau: { type: "string", nullable: true },
//                         mention: { type: "string", nullable: true },
//                         annee: { type: "string", nullable: true },
//                         countryOfSchool: { type: "string", nullable: true },
//                         secondarySchoolName: { type: "string", nullable: true },
//                         graduationDate: { type: "string", format: "date", nullable: true },

//                         periode: { type: "string", nullable: true },
//                         year: { type: "string", nullable: true },
//                         status: { type: "string", nullable: true },
//                         observation: { type: "string", nullable: true },
//                         statusPayment: { type: "string", nullable: true },

//                         dob: { type: "string", format: "date", nullable: true },
//                         citizenship: { type: "string", nullable: true },
//                         passport: { type: "string", nullable: true },

//                         isEnglishFirstLanguage: { type: "boolean", nullable: true },
//                         englishProficiencyTests: { type: "object", additionalProperties: true, nullable: true },
//                         testScores: { type: "string", nullable: true },

//                         gradingScale: { type: "string", nullable: true },
//                         gpa: { type: "string", nullable: true },
//                         examsTaken: { type: "object", additionalProperties: true, nullable: true },
//                         intendedMajor: { type: "string", nullable: true },

//                         extracurricularActivities: { type: "string", nullable: true },
//                         honorsOrAwards: { type: "string", nullable: true },

//                         parentGuardianName: { type: "string", nullable: true },
//                         occupation: { type: "string", nullable: true },
//                         educationLevel: { type: "string", nullable: true },

//                         willApplyForFinancialAid: { type: "boolean", nullable: true },
//                         hasExternalSponsorship: { type: "boolean", nullable: true },

//                         visaType: { type: "string", nullable: true },
//                         hasPreviouslyStudiedInUS: { type: "boolean", nullable: true },

//                         personalStatement: { type: "string", nullable: true },
//                         optionalEssay: { type: "string", nullable: true },

//                         applicationRound: { type: "string", nullable: true },
//                         howDidYouHearAboutUs: { type: "string", nullable: true },
//                     },
//                 },

//                 Document: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         demandePartageId: { type: "string" },
//                         ownerOrgId: { type: "string" },
//                         codeAdn: { type: "string", nullable: true },
//                         estTraduit: { type: "boolean" },
//                         aDocument: { type: "boolean" },
//                         hasOriginal: { type: "boolean", nullable: true },
//                         hasTraduit: { type: "boolean", nullable: true },
//                         isEncrypted: { type: "boolean", nullable: true },
//                         urlOriginal: { type: "string", format: "uri", nullable: true },
//                         urlTraduit: { type: "string", format: "uri", nullable: true },
//                         urlChiffre: { type: "string", format: "uri", nullable: true },
//                         blockchainHash: { type: "string", nullable: true },
//                         encryptedBy: { type: "string", nullable: true },
//                         encryptedAt: { type: "string", format: "date-time", nullable: true },
//                         createdAt: { type: "string", format: "date-time", nullable: true },
//                     },
//                 },
//                 Transaction: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         demandePartageId: { type: "string" },
//                         montant: { type: "number" },
//                         typePaiement: {
//                             type: "string",
//                             enum: ["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"],
//                         },
//                         statut: {
//                             type: "string",
//                             enum: ["PENDING", "SUCCESS", "FAILED", "CANCELED"],
//                         },
//                         createdAt: { type: "string", format: "date-time", nullable: true },
//                         updatedAt: { type: "string", format: "date-time", nullable: true },
//                     },
//                 },
//                 Payment: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         provider: { type: "string" },
//                         status: {
//                             type: "string",
//                             enum: ["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"],
//                         },
//                         amount: { type: "number" },
//                         currency: { type: "string" },
//                         paymentType: {
//                             type: "string",
//                             enum: ["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"],
//                         },
//                         providerRef: { type: "string", nullable: true },
//                         paymentInfo: { type: "object", additionalProperties: true, nullable: true },
//                         demandePartageId: { type: "string", nullable: true },
//                         createdAt: { type: "string", format: "date-time", nullable: true },
//                         updatedAt: { type: "string", format: "date-time", nullable: true },
//                     },
//                 },
//                 Abonnement: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         organizationId: { type: "string" },
//                         dateDebut: { type: "string", format: "date" },
//                         dateExpiration: { type: "string", format: "date" },
//                         montant: { type: "number" },
//                     },
//                 },

//                 /* ------------------- Réponses agrégées Demandes ------------------- */
//                 DemandeListResponse: {
//                     type: "object",
//                     properties: {
//                         demandes: {
//                             type: "array",
//                             items: { $ref: "#/components/schemas/Demande" },
//                         },
//                         pagination: { $ref: "#/components/schemas/Pagination" },
//                         filters: { type: "object", additionalProperties: true },
//                     },
//                 },
//                 DemandeItemResponse: {
//                     type: "object",
//                     properties: {
//                         demande: { $ref: "#/components/schemas/Demande" },
//                         documents: { type: "array", items: { $ref: "#/components/schemas/Document" } },
//                         transaction: { $ref: "#/components/schemas/Transaction" },
//                         payment: { $ref: "#/components/schemas/Payment" },
//                     },
//                 },

//                 /* ------------------------ Contact / Config ------------------------ */
//                 ContactMessage: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         name: { type: "string" },
//                         email: { type: "string", format: "email" },
//                         subject: { type: "string", nullable: true },
//                         message: { type: "string" },
//                         createdAt: { type: "string", format: "date-time" },
//                         updatedAt: { type: "string", format: "date-time" },
//                     },
//                 },
//                 Configuration: {
//                     type: "object",
//                     properties: {
//                         id: { type: "string" },
//                         key: { type: "string" },
//                         value: { type: "string", nullable: true },
//                         jsonValue: { type: "object", nullable: true },
//                         description: { type: "string", nullable: true },
//                         createdAt: { type: "string", format: "date-time" },
//                         updatedAt: { type: "string", format: "date-time" },
//                     },
//                 },
//                 UpsertConfiguration: {
//                     type: "object",
//                     required: ["key"],
//                     properties: {
//                         key: { type: "string", example: "smtp.host" },
//                         value: { type: "string", nullable: true },
//                         jsonValue: { type: "object", nullable: true },
//                         description: { type: "string", nullable: true },
//                     },
//                 },
//             },
//         },
//         security: [{ bearerAuth: [] }],
//     },

//     // Ajuste les globs si tes routes sont ailleurs
//     apis: ["./routes/*.js"],
// };

// const specs = swaggerJsdoc(options);

// // UI options (persistance du token, tri alpha, etc.)
// const uiOptions = {
//     explorer: true,
//     swaggerOptions: {
//         persistAuthorization: true,
//         docExpansion: "list",
//         tagsSorter: "alpha",
//         operationsSorter: "alpha",
//     },
// };

// module.exports = { swaggerUi, specs, uiOptions };
// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Applyons Backoffice API",
            version: "1.0.0",
            description: "API Documentation for Applyons Backoffice",
            contact: { name: "Applyons Support", email: "support@applyons.com" },
        },
        servers: [
            { url: "http://localhost:5000", description: "Local server" },
            { url: "https://api-applyons.applyons.com", description: "Serveur Applyons" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },

            /* ---------- Parameters (réutilisables dans les routes) ---------- */
            parameters: {
                page: { in: "query",
                    name: "page",
                    schema: { type: "integer", minimum: 1, default: 1 },
                    description: "Numéro de page (1-n)",
                },
                limit: { in: "query",
                    name: "limit",
                    schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
                    description: "Taille de page",
                },
                sortBy: { in: "query",
                    name: "sortBy",
                    schema: { type: "string" },
                    description: "Champ de tri (selon ressource)",
                },
                sortOrder: { in: "query",
                    name: "sortOrder",
                    schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                    description: "Ordre de tri",
                },
            },

            /* ---------------------- Schemas globaux ------------------------ */
            schemas: {
                /* Utilitaires */
                Pagination: {
                    type: "object",
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 123 },
                        pages: { type: "integer", example: 13 },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        code: { type: "string" },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    msg: { type: "string" },
                                    param: { type: "string" },
                                    location: { type: "string" },
                                },
                            },
                        },
                    },
                },
                MessageOnly: {
                    type: "object",
                    properties: { message: { type: "string" } },
                    example: { message: "Opération effectuée" },
                },

                /* Référentiels légers pour les embeds */
                UserLite: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        email: { type: "string", format: "email" },
                        username: { type: "string" },
                    },
                },
                OrganizationLite: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        type: { type: "string", nullable: true },
                    },
                },

                /* ---------------------- Users (minimal) ---------------------- */
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        email: { type: "string", format: "email" },
                        username: { type: "string" },
                        role: {
                            type: "string",
                            enum: ["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR", "ADMIN"],
                        },
                        enabled: { type: "boolean" },
                        phone: { type: "string" },
                        avatar: { type: "string" },
                        country: { type: "string" },
                        organization: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                slug: { type: "string" },
                                type: { type: "string" },
                            },
                        },
                        permissions: {
                            type: "array",
                            items: { type: "object", properties: { key: { type: "string" }, name: { type: "string" } } },
                        },
                    },
                },
                RegisterUser: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        username: { type: "string" },
                        email: { type: "string", format: "email" },
                        password: { type: "string", minLength: 6 },
                        role: { type: "string", enum: ["DEMANDEUR", "INSTITUT", "TRADUCTEUR", "SUPERVISEUR"] },
                        organizationId: { type: "string" },
                        permissions: { type: "array", items: { type: "string" } },
                    },
                },
                UpdateProfile: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        phone: { type: "string" },
                        adress: { type: "string" },
                        avatar: { type: "string" },
                        country: { type: "string" },
                    },
                },
                CreateUser: {
                    allOf: [
                        { $ref: "#/components/schemas/RegisterUser" },
                        { type: "object", properties: { enabled: { type: "boolean" } } },
                    ],
                },
                UpdateUser: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        email: { type: "string", format: "email" },
                        role: { type: "string" },
                        enabled: { type: "boolean" },
                        organizationId: { type: "string" },
                        permissions: { type: "array", items: { type: "string" } },
                        phone: { type: "string" },
                        adress: { type: "string" },
                        country: { type: "string" },
                        gender: { type: "string", enum: ["MALE", "FEMALE", "OTHER"] },
                    },
                },

                /* -------- Organizations / Departments / Filieres ------------ */
                Organization: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        type: { type: "string" },
                        email: { type: "string", format: "email" },
                        phone: { type: "string" },
                        address: { type: "string" },
                        website: { type: "string" },
                        country: { type: "string" },
                    },
                },
                Department: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        organizationId: { type: "string" },
                        name: { type: "string" },
                        code: { type: "string" },
                        description: { type: "string" },
                    },
                },
                Filiere: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        departmentId: { type: "string" },
                        name: { type: "string" },
                        code: { type: "string" },
                        description: { type: "string" },
                        level: { type: "string" },
                        department: { $ref: "#/components/schemas/Department" },
                    },
                },

                /* ------- Demandes / Documents / Transactions / Payments ------ */
                Demande: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        code: { type: "string", nullable: true },
                        dateDemande: { type: "string", format: "date-time" },
                        isDeleted: { type: "boolean" },
                        status: { type: "string", nullable: true },
                        user: { $ref: "#/components/schemas/UserLite" },
                        targetOrg: { $ref: "#/components/schemas/OrganizationLite" },
                        assignedOrg: { $ref: "#/components/schemas/OrganizationLite" },
                        meta: {
                            type: "object",
                            properties: {
                                serie: { type: "string", nullable: true },
                                niveau: { type: "string", nullable: true },
                                mention: { type: "string", nullable: true },
                                annee: { type: "string", nullable: true },
                                countryOfSchool: { type: "string", nullable: true },
                                secondarySchoolName: { type: "string", nullable: true },
                                graduationDate: { type: "string", format: "date-time", nullable: true },
                            },
                        },
                        documentsCount: { type: "integer" },
                        transaction: { $ref: "#/components/schemas/Transaction" },
                    },
                },

                CreateDemande: {
                    type: "object",
                    required: ["targetOrgId"],
                    properties: {
                        targetOrgId: { type: "string" },
                        assignedOrgId: { type: "string", nullable: true },
                        userId: { type: "string", nullable: true },

                        // académiques
                        serie: { type: "string", nullable: true },
                        niveau: { type: "string", nullable: true },
                        mention: { type: "string", nullable: true },
                        annee: { type: "string", nullable: true },
                        countryOfSchool: { type: "string", nullable: true },
                        secondarySchoolName: { type: "string", nullable: true },
                        graduationDate: { type: "string", format: "date", nullable: true },

                        // header/dossier
                        periode: { type: "string", nullable: true },
                        year: { type: "string", nullable: true },
                        status: { type: "string", nullable: true },
                        observation: { type: "string", nullable: true },

                        // paiement statut métier
                        statusPayment: { type: "string", nullable: true },

                        // Identité
                        dob: { type: "string", format: "date", nullable: true },
                        citizenship: { type: "string", nullable: true },
                        passport: { type: "string", nullable: true },

                        // Anglais / tests
                        isEnglishFirstLanguage: { type: "boolean", nullable: true },
                        englishProficiencyTests: { type: "object", additionalProperties: true, nullable: true },
                        testScores: { type: "string", nullable: true },

                        // Scolarité / Notes
                        gradingScale: { type: "string", nullable: true },
                        gpa: { type: "string", nullable: true },
                        examsTaken: { type: "object", additionalProperties: true, nullable: true },
                        intendedMajor: { type: "string", nullable: true },

                        // Activités / Distinctions
                        extracurricularActivities: { type: "string", nullable: true },
                        honorsOrAwards: { type: "string", nullable: true },

                        // Famille
                        parentGuardianName: { type: "string", nullable: true },
                        occupation: { type: "string", nullable: true },
                        educationLevel: { type: "string", nullable: true },

                        // Financier
                        willApplyForFinancialAid: { type: "boolean", nullable: true },
                        hasExternalSponsorship: { type: "boolean", nullable: true },

                        // Visa
                        visaType: { type: "string", nullable: true },
                        hasPreviouslyStudiedInUS: { type: "boolean", nullable: true },

                        // Essays
                        personalStatement: { type: "string", nullable: true },
                        optionalEssay: { type: "string", nullable: true },

                        // Candidature
                        applicationRound: { type: "string", nullable: true },
                        howDidYouHearAboutUs: { type: "string", nullable: true },
                    },
                },

                UpdateDemande: {
                    type: "object",
                    properties: {
                        assignedOrgId: { type: "string", nullable: true },

                        // mêmes champs optionnels que CreateDemande
                        serie: { type: "string", nullable: true },
                        niveau: { type: "string", nullable: true },
                        mention: { type: "string", nullable: true },
                        annee: { type: "string", nullable: true },
                        countryOfSchool: { type: "string", nullable: true },
                        secondarySchoolName: { type: "string", nullable: true },
                        graduationDate: { type: "string", format: "date", nullable: true },

                        periode: { type: "string", nullable: true },
                        year: { type: "string", nullable: true },
                        status: { type: "string", nullable: true },
                        observation: { type: "string", nullable: true },
                        statusPayment: { type: "string", nullable: true },

                        dob: { type: "string", format: "date", nullable: true },
                        citizenship: { type: "string", nullable: true },
                        passport: { type: "string", nullable: true },

                        isEnglishFirstLanguage: { type: "boolean", nullable: true },
                        englishProficiencyTests: { type: "object", additionalProperties: true, nullable: true },
                        testScores: { type: "string", nullable: true },

                        gradingScale: { type: "string", nullable: true },
                        gpa: { type: "string", nullable: true },
                        examsTaken: { type: "object", additionalProperties: true, nullable: true },
                        intendedMajor: { type: "string", nullable: true },

                        extracurricularActivities: { type: "string", nullable: true },
                        honorsOrAwards: { type: "string", nullable: true },

                        parentGuardianName: { type: "string", nullable: true },
                        occupation: { type: "string", nullable: true },
                        educationLevel: { type: "string", nullable: true },

                        willApplyForFinancialAid: { type: "boolean", nullable: true },
                        hasExternalSponsorship: { type: "boolean", nullable: true },

                        visaType: { type: "string", nullable: true },
                        hasPreviouslyStudiedInUS: { type: "boolean", nullable: true },

                        personalStatement: { type: "string", nullable: true },
                        optionalEssay: { type: "string", nullable: true },

                        applicationRound: { type: "string", nullable: true },
                        howDidYouHearAboutUs: { type: "string", nullable: true },
                    },
                },

                Document: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        demandePartageId: { type: "string" },
                        ownerOrgId: { type: "string" },
                        codeAdn: { type: "string", nullable: true },
                        estTraduit: { type: "boolean" },
                        aDocument: { type: "boolean" },
                        hasOriginal: { type: "boolean", nullable: true },
                        hasTraduit: { type: "boolean", nullable: true },
                        isEncrypted: { type: "boolean", nullable: true },
                        urlOriginal: { type: "string", format: "uri", nullable: true },
                        urlTraduit: { type: "string", format: "uri", nullable: true },
                        urlChiffre: { type: "string", format: "uri", nullable: true },
                        blockchainHash: { type: "string", nullable: true },
                        encryptedBy: { type: "string", nullable: true },
                        encryptedAt: { type: "string", format: "date-time", nullable: true },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                    },
                },
                Transaction: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        demandePartageId: { type: "string" },
                        montant: { type: "number" },
                        typePaiement: {
                            type: "string",
                            enum: ["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"],
                        },
                        statut: {
                            type: "string",
                            enum: ["PENDING", "SUCCESS", "FAILED", "CANCELED"],
                        },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true },
                    },
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        provider: { type: "string" },
                        status: {
                            type: "string",
                            enum: ["INITIATED", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "CANCELED", "FAILED"],
                        },
                        amount: { type: "number" },
                        currency: { type: "string" },
                        paymentType: {
                            type: "string",
                            enum: ["MOBILE_MONEY", "BANK_TRANSFER", "CARD", "CASH"],
                        },
                        providerRef: { type: "string", nullable: true },
                        paymentInfo: { type: "object", additionalProperties: true, nullable: true },
                        demandePartageId: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true },
                    },
                },
                Abonnement: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        organizationId: { type: "string" },
                        dateDebut: { type: "string", format: "date" },
                        dateExpiration: { type: "string", format: "date" },
                        montant: { type: "number" },
                    },
                },

                /* ------------------- Réponses agrégées Demandes ------------------- */
                DemandeListResponse: {
                    type: "object",
                    properties: {
                        demandes: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Demande" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                        filters: { type: "object", additionalProperties: true },
                    },
                },
                DemandeItemResponse: {
                    type: "object",
                    properties: {
                        demande: { $ref: "#/components/schemas/Demande" },
                        documents: { type: "array", items: { $ref: "#/components/schemas/Document" } },
                        transaction: { $ref: "#/components/schemas/Transaction" },
                        payment: { $ref: "#/components/schemas/Payment" },
                    },
                },

                /* ------------------------ Contact / Config ------------------------ */
                ContactMessage: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        subject: { type: "string", nullable: true },
                        message: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                // === AJOUT 1: schéma pour la création d'un contact ===
                CreateContactMessage: {
                    type: "object",
                    required: ["name", "email", "message"],
                    properties: {
                        name: { type: "string", example: "Alice Dupont" },
                        email: { type: "string", format: "email", example: "alice@example.com" },
                        subject: { type: "string", nullable: true, example: "Question sur l’inscription" },
                        message: { type: "string", example: "Bonjour, j’aimerais en savoir plus..." },
                    },
                },


                // === AJOUT 2: schéma pour /api/departments/stats ===
                DepartmentStatsResponse: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 42 },
                        byOrganization: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    organizationId: { type: "string", example: "org_123" },
                                    organizationName: { type: "string", example: "Université de Dakar" },
                                    count: { type: "integer", example: 5 },
                                },
                            },
                        },
                        byLevel: {
                            description: "Agrégat par niveau (si filières liées)",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    level: { type: "string", example: "Licence" },
                                    count: { type: "integer", example: 12 },
                                },
                            },
                        },
                        byMonth: {
                            description: "Créations par mois (YYYY-MM)",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    month: { type: "string", example: "2025-09" },
                                    count: { type: "integer", example: 7 },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },

    // Ajuste les globs si tes routes sont ailleurs
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

// UI options (persistance du token, tri alpha, etc.)
const uiOptions = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "list",
        tagsSorter: "alpha",
        operationsSorter: "alpha",
    },
};

module.exports = { swaggerUi, specs, uiOptions };