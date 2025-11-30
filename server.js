const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { swaggerUi, specs, uiOptions } = require('./swagger');
require("dotenv").config();
require("./config/db");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

// Configuration de base
app.set('trust proxy', 1); // ou 'loopback' si tu es en développement local

// Middlewares de sécurité et parsing

app.use(
    helmet({
      // 🔓 Autoriser l'utilisation des ressources (images, etc.) depuis d'autres origines
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // ou tu peux totalement le désactiver :
      // crossOriginResourcePolicy: false,
    })
  );

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:3000",
    "https://admin.applyons.com",
    "https://applyons.com"
  ];

// Configuration CORS
// app.use(
//     cors({
//         origin: ["http://localhost:3000", "https://admin.applyons.com", "https://applyons.com"],
//         methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//         credentials: true,
//     })
// );


app.use(
    cors({
      origin(origin, callback) {
        // autoriser aussi les requêtes sans Origin (curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limite chaque IP à 5000 requêtes par fenêtre
    message: "Too many requests from this IP, please try again later.",
    trustProxy: true,
});
app.use("/api/", limiter);

// Middleware global pour vérifier l'utilisateur
app.use(checkUser);

// Routes statiques
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/profiles", express.static(path.join(__dirname, "uploads")));
app.use("/documents", express.static(path.join(__dirname, "uploads")));
app.use("/settings", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));
app.get("/", (req, res) => res.redirect("/api-docs"));
app.get("/openapi.json", (req, res) => res.json(specs));

// Routes API
app.get("/api/jwtid", requireAuth, (req, res) => {
    res.status(200).json({ userId: res.locals.user.id });
});
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/demandes", require("./routes/demande.routes"));
app.use("/api/documents", require("./routes/document.routes"));
app.use("/api/abonnements", require("./routes/abonnement.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/organizations", require("./routes/organization.routes"));
app.use("/api/invites", require("./routes/invite.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/filieres", require("./routes/filiere.routes"));
app.use("/api/contacts", require("./routes/contact.routes"));
app.use("/api/permissions", require("./routes/permission.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/contacts", require("./routes/contact.routes"));
app.use("/api/settings", require("./routes/settings.routes"));


// Gestion des erreurs 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : {},
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Applyons Backoffice API listening on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Api doc: http://localhost:${PORT}/api-docs`);
});