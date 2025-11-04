// config/storage.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class StorageService {
    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        this.buckets = {
            original: process.env.S3_BUCKET_ORIGINAL || 'applyons-documents-original',
            encrypted: process.env.S3_BUCKET_ENCRYPTED || 'applyons-documents-encrypted',
            translated: process.env.S3_BUCKET_TRANSLATED || 'applyons-documents-translated'
        };
    }

    async uploadOriginal(filePath, documentId) {
        const fileContent = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const key = `documents/${documentId}/original${ext}`;

        const params = {
            Bucket: this.buckets.original,
            Key: key,
            Body: fileContent,
            ContentType: this.getContentType(ext)
        };

        const result = await this.s3.upload(params).promise();
        return result.Location;
    }

    async uploadEncrypted(filePath, documentId) {
        const fileContent = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const key = `documents/${documentId}/encrypted${ext}`;

        const params = {
            Bucket: this.buckets.encrypted,
            Key: key,
            Body: fileContent,
            ContentType: 'application/octet-stream'
        };

        const result = await this.s3.upload(params).promise();
        return result.Location;
    }

    async uploadTranslated(filePath, documentId) {
        const fileContent = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const key = `documents/${documentId}/translated${ext}`;

        const params = {
            Bucket: this.buckets.translated,
            Key: key,
            Body: fileContent,
            ContentType: this.getContentType(ext)
        };

        const result = await this.s3.upload(params).promise();
        return result.Location;
    }

    async download(fileUrl, outputPath) {
        // Extraire le bucket et la clé de l'URL
        const match = fileUrl.match(/https?:\/\/[^\/]+\/([^\/]+)\/(.+)/);
        if (!match) {
            throw new Error("URL de stockage invalide");
        }

        const [, bucket, key] = match;

        const params = {
            Bucket: bucket,
            Key: key
        };

        const result = await this.s3.getObject(params).promise();

        fs.writeFileSync(outputPath, result.Body);
        return outputPath;
    }

    async getFileStream(fileUrl) {
        const match = fileUrl.match(/https?:\/\/[^\/]+\/([^\/]+)\/(.+)/);
        if (!match) {
            throw new Error("URL de stockage invalide");
        }

        const [, bucket, key] = match;

        const params = {
            Bucket: bucket,
            Key: key
        };

        const result = await this.s3.getObject(params).promise();
        return result.Body; // Retourne un stream
    }

    getContentType(ext) {
        const types = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        return types[ext.toLowerCase()] || 'application/octet-stream';
    }
}

module.exports = new StorageService();