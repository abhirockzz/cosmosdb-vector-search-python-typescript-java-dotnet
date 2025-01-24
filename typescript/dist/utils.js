"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = getContainer;
exports.generateEmbeddings = generateEmbeddings;
exports.getEnvVar = getEnvVar;
exports.getAzureOpenAIClient = getAzureOpenAIClient;
const cosmos_1 = require("@azure/cosmos");
const openai_1 = require("openai");
function getContainer() {
    const client = new cosmos_1.CosmosClient(getEnvVar("COSMOS_DB_CONNECTION_STRING"));
    return client.database(getEnvVar("DATABASE_NAME")).container(getEnvVar("CONTAINER_NAME"));
}
function generateEmbeddings(text, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const embeddings = yield client.embeddings.create({ input: text, model: getEnvVar("EMBEDDINGS_MODEL") });
            return embeddings.data[0].embedding;
        }
        catch (error) {
            console.error("Error generating embeddings:", error);
            throw error;
        }
    });
}
function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} must be set`);
    }
    return value;
}
function getAzureOpenAIClient() {
    const apiKey = getEnvVar("AZURE_OPENAI_KEY");
    const deployment = getEnvVar("EMBEDDINGS_MODEL");
    const apiVersion = "2024-10-21";
    return new openai_1.AzureOpenAI({ apiKey, deployment, apiVersion });
}
