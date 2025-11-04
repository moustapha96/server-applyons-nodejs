// services/blockchain.service.js
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Blockchain {
    constructor() {
        this.chain = [];
        this.currentTransactions = [];
        this.genesisBlock = this.createGenesisBlock();
    }

    /**
     * Crée le bloc genesis
     */
    createGenesisBlock() {
        return {
            index: 0,
            timestamp: new Date().getTime(),
            transactions: [],
            previousHash: '0',
            hash: this.calculateHash(0, new Date().getTime(), [], '0')
        };
    }

    /**
     * Crée un nouveau bloc
     */
    async createNewBlock(transactions, previousHash) {
        const block = {
            index: this.chain.length,
            timestamp: new Date().getTime(),
            transactions,
            previousHash: previousHash || this.getLastBlock().hash,
        };

        block.hash = this.calculateHash(
            block.index,
            block.timestamp,
            block.transactions,
            block.previousHash
        );

        // Sauvegarder dans la base de données
        await prisma.blockchain.create({
            data: {
                index: block.index,
                timestamp: new Date(block.timestamp),
                transactions: JSON.stringify(block.transactions),
                previousHash: block.previousHash,
                hash: block.hash
            }
        });

        this.currentTransactions = [];
        this.chain.push(block);
        return block;
    }

    /**
     * Ajoute un bloc à la chaîne
     */
    async addBlock(data) {
        const transaction = {
            documentId: data.documentId,
            hash: data.hash,
            timestamp: data.timestamp.toISOString(),
            action: data.action,
            userId: data.userId
        };

        this.currentTransactions.push(transaction);

        // Créer un nouveau bloc toutes les 10 transactions ou toutes les 5 minutes
        if (this.currentTransactions.length >= 10 ||
            (this.currentTransactions.length > 0 &&
                Date.now() - this.currentTransactions[0].timestamp > 300000)) {
            await this.createNewBlock(this.currentTransactions);
        }
    }

    /**
     * Calcule le hash d'un bloc
     */
    calculateHash(index, timestamp, transactions, previousHash) {
        return crypto
            .createHash('sha256')
            .update(index + timestamp + JSON.stringify(transactions) + previousHash)
            .digest('hex');
    }

    /**
     * Récupère le dernier bloc de la chaîne
     */
    getLastBlock() {
        if (this.chain.length === 0) {
            return this.genesisBlock;
        }
        return this.chain[this.chain.length - 1];
    }

    /**
     * Vérifie l'intégrité de la chaîne
     */
    async isChainValid() {
        const blocks = await prisma.blockchain.findMany({
            orderBy: { index: 'asc' }
        });

        for (let i = 1; i < blocks.length; i++) {
            const currentBlock = blocks[i];
            const previousBlock = blocks[i - 1];

            // Vérifier que le hash du bloc est correct
            const calculatedHash = this.calculateHash(
                currentBlock.index,
                currentBlock.timestamp.getTime(),
                JSON.parse(currentBlock.transactions),
                currentBlock.previousHash
            );

            if (currentBlock.hash !== calculatedHash) {
                return false;
            }

            // Vérifier que le previousHash pointe bien vers le hash du bloc précédent
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    /**
     * Récupère l'historique d'un document
     */
    async getDocumentHistory(documentId) {
        const blocks = await prisma.blockchain.findMany({
            orderBy: { index: 'asc' }
        });

        const history = [];

        for (const block of blocks) {
            const transactions = JSON.parse(block.transactions);
            for (const tx of transactions) {
                if (tx.documentId === documentId) {
                    history.push({
                        blockIndex: block.index,
                        blockHash: block.hash,
                        timestamp: block.timestamp,
                        transaction: tx
                    });
                }
            }
        }

        return history;
    }
}

module.exports = Blockchain;