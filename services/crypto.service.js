// services/crypto.service.js
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Blockchain = require("./blockchain.service");
const { createAuditLog } = require("../utils/audit");

function publicBase() {
    const base = process.env.PUBLIC_BASE_URL || "";
    return base.replace(/\/+$/, ""); // retire trailing slashes
}

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

class CryptoService {
    constructor() {
        this.algorithm = "aes-256-cbc";
        this.blockchain = new Blockchain();
    }

    // === Génération clés/IV ===
    generateKey() {
        return crypto.randomBytes(32).toString("hex"); // 256 bits
    }
    generateIV() {
        return crypto.randomBytes(16).toString("hex"); // 128 bits
    }

    // === Hash util ===
    calculateHash(data) {
        if (typeof data === "string") data = Buffer.from(data);
        return crypto.createHash("sha256").update(data).digest("hex");
    }

    // === Chiffrement ===
    async encryptFile(filePath, key, iv) {
        return new Promise((resolve, reject) => {
            try {
                const fileData = fs.readFileSync(filePath);
                const cipher = crypto.createCipheriv(
                    this.algorithm,
                    Buffer.from(key, "hex"),
                    Buffer.from(iv, "hex")
                );
                const encrypted = Buffer.concat([cipher.update(fileData), cipher.final()]);
                const dir = path.dirname(filePath);
                const ext = path.extname(filePath);
                const baseName = path.basename(filePath, ext);
                const encryptedPath = path.join(dir, `${baseName}_encrypted${ext}`);
                fs.writeFileSync(encryptedPath, encrypted);
                const hash = this.calculateHash(encrypted);
                resolve({ encryptedPath, hash });
            } catch (err) {
                reject(new Error(`Chiffrement échoué: ${err.message}`));
            }
        });
    }

    // === Déchiffrement ===
    async decryptFile(encryptedPath, key, iv, outputPath) {
        return new Promise((resolve, reject) => {
            try {
                const enc = fs.readFileSync(encryptedPath);
                const decipher = crypto.createDecipheriv(
                    this.algorithm,
                    Buffer.from(key, "hex"),
                    Buffer.from(iv, "hex")
                );
                const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);
                ensureDir(path.dirname(outputPath));
                fs.writeFileSync(outputPath, decrypted);
                resolve(outputPath);
            } catch (err) {
                reject(new Error(`Déchiffrement échoué: ${err.message}`));
            }
        });
    }

    // // === Téléchargement HTTP -> fichier local (temp) ===
    async downloadFile(fileUrl, tempLabel) {
            const tempRoot = path.resolve(process.cwd(), "temp");
            const dir = path.join(tempRoot, tempLabel || "tmp");
            ensureDir(dir);

            const fileName = path.basename(new URL(fileUrl).pathname); // ex: document-xxx.pdf
            const outPath = path.join(dir, fileName);

            const resp = await axios.get(fileUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(outPath, resp.data);
            return outPath;
        }
        // === Téléchargement HTTP -> fichier local (temp) ===
        // Usage 1: downloadFile(url, "translated") -> /temp/translated/<nom_d_origine.ext>
        // Usage 2: downloadFile(url, "translated", "translated_<id>.pdf") -> /temp/translated/translated_<id>.pdf
        // async downloadFile(fileUrl, tempLabel = "tmp", desiredFileName = null) {
        //     const tempRoot = path.resolve(process.cwd(), "temp");
        //     const dir = path.join(tempRoot, tempLabel);
        //     ensureDir(dir);

    //     let fileName;
    //     try {
    //         const url = new URL(fileUrl);
    //         const fromUrl = path.basename(url.pathname);
    //         fileName = desiredFileName || (fromUrl && fromUrl !== "/" ? fromUrl : "file");
    //     } catch {
    //         // Si fileUrl n'est pas une URL valide, garde un fallback
    //         fileName = desiredFileName || "file";
    //     }

    //     const outPath = path.join(dir, fileName);

    //     const resp = await axios.get(fileUrl, { responseType: "arraybuffer" });
    //     fs.writeFileSync(outPath, resp.data);
    //     return outPath;
    // }


    // === "Upload" local: déplace le fichier chiffré vers /uploads/encrypted et retourne URL publique ===
    async uploadFile(localFilePath) {
        const uploadsRoot = path.resolve(process.cwd(), "uploads", "encrypted");
        ensureDir(uploadsRoot);

        const fileName = path.basename(localFilePath);
        const finalPath = path.join(uploadsRoot, fileName);

        // Déplace/copie (ici on copie puis supprime pour simplicité cross-device)
        fs.copyFileSync(localFilePath, finalPath);
        try { fs.unlinkSync(localFilePath); } catch (_) {}

        // URL publique: assure-toi d’exposer `app.use("/uploads", express.static("uploads"))`
        const base = publicBase();
        const publicUrl = `${base}/uploads/encrypted/${encodeURIComponent(fileName)}`;
        return publicUrl;
    }

    // === Orchestrateur complet: télécharge, chiffre, dépose, met à jour la DB, blockchain, audit ===
    async encryptAndPersist(documentId, urlOriginal, userId) {
        // 1) télécharger l’original en temp
        const localOriginal = await this.downloadFile(urlOriginal, `original_${documentId}`);

        // 2) générer clés
        const key = this.generateKey();
        const iv = this.generateIV();

        // 3) chiffrer
        const { encryptedPath, hash } = await this.encryptFile(localOriginal, key, iv);

        // 4) "upload" vers /uploads/encrypted et obtenir URL publique
        const publicEncryptedUrl = await this.uploadFile(encryptedPath);

        // 5) mettre à jour le DocumentPartage existant
        const updated = await prisma.documentPartage.update({
            where: { id: documentId },
            data: {
                urlChiffre: publicEncryptedUrl,
                encryptionKey: key,
                encryptionIV: iv,
                blockchainHash: hash,
                encryptedBy: userId || null,
                encryptedAt: new Date(),
            },
        });

        // 6) blockchain + audit (non bloquants)
        try {
            await this.blockchain.addBlock({
                documentId,
                hash,
                timestamp: new Date(),
                action: "encrypt",
                userId: userId || "system",
            });
        } catch (e) {
            // log mais ne bloque pas
            console.error("Blockchain addBlock error:", e);
        }

        try {
            await createAuditLog({
                userId: userId || null,
                action: "DOCUMENT_ENCRYPTED",
                resource: "documents",
                resourceId: documentId,
                details: { hash, key: "***", iv: "***", fileUrl: publicEncryptedUrl },
                ipAddress: "system",
                userAgent: "crypto-service",
            });
        } catch (e) {
            console.error("Audit log error (encrypt):", e);
        }

        return updated;
    }

    // === Récupération déchiffrée (si tu en as besoin) ===
    async getDecryptedDocument(documentPartageId) {
        const encryptedDoc = await prisma.documentPartage.findUnique({
            where: { id: documentPartageId },
            select: {
                id: true,
                urlChiffre: true,
                encryptionKey: true,
                encryptionIV: true,
                blockchainHash: true,
            },
        });

        if (!encryptedDoc) throw new Error("Document chiffré introuvable");
        if (!encryptedDoc.urlChiffre) throw new Error("Aucune URL chiffrée stockée");

        const tempDir = path.resolve(process.cwd(), "temp", `decrypt_${documentPartageId}`);
        ensureDir(tempDir);

        const localEncrypted = await this.downloadFile(encryptedDoc.urlChiffre, `encrypted_${documentPartageId}`);
        const outPath = path.join(tempDir, `decrypted_${path.basename(localEncrypted)}`);

        await this.decryptFile(
            localEncrypted,
            encryptedDoc.encryptionKey,
            encryptedDoc.encryptionIV,
            outPath
        );

        // Vérif d’intégrité
        const fileData = fs.readFileSync(outPath);
        const currentHash = this.calculateHash(fileData);
        if (currentHash !== encryptedDoc.blockchainHash) {
            throw new Error("Violation d'intégrité détectée - hash ne correspond pas");
        }

        try {
            await createAuditLog({
                userId: "system",
                action: "DOCUMENT_DECRYPTED",
                resource: "documents",
                resourceId: documentPartageId,
                details: { hash: currentHash, outputPath: outPath },
                ipAddress: "system",
                userAgent: "crypto-service",
            });
        } catch (e) {
            console.error("Audit log error (decrypt):", e);
        }

        return { filePath: outPath, document: encryptedDoc };
    }

    // (optionnel) log de sécu générique
    async logSecurityEvent(action, documentId, userId, details = {}) {
        await prisma.securityLog.create({
            data: {
                action,
                resourceType: "DOCUMENT",
                resourceId: documentId,
                userId,
                ipAddress: details.ip || undefined,
                userAgent: details.userAgent || "crypto-service",
                metadata: {
                    ...details,
                    key: details.key ? "***" : undefined,
                    iv: details.iv ? "***" : undefined,
                },
            },
        });
    }
}

module.exports = new CryptoService();