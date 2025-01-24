import { Container, CosmosClient } from "@azure/cosmos";
import { AzureOpenAI } from "openai";

export function getContainer(): Container {
    const client = new CosmosClient(getEnvVar("COSMOS_DB_CONNECTION_STRING"));
    return client.database(getEnvVar("DATABASE_NAME")).container(getEnvVar("CONTAINER_NAME"));
}

export async function generateEmbeddings(text: string, client: AzureOpenAI): Promise<number[]> {
    try {
        const embeddings = await client.embeddings.create({ input: text, model: getEnvVar("EMBEDDINGS_MODEL") });
        return embeddings.data[0].embedding;
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw error;
    }
}

export function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} must be set`);
    }
    return value;
}

export function getAzureOpenAIClient(): AzureOpenAI {

    const apiKey = getEnvVar("AZURE_OPENAI_KEY");
    const deployment = getEnvVar("EMBEDDINGS_MODEL");
    const apiVersion = "2024-10-21";

    return new AzureOpenAI({ apiKey, deployment, apiVersion });
}