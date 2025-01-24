import { CosmosClient } from "@azure/cosmos";

function main() {
    
    const connectionString = getEnvVar("COSMOS_CONNECTION_STRING");
    const dbName = getEnvVar("DATABASE_NAME");
    const containerName = getEnvVar("CONTAINER_NAME");

    const client = new CosmosClient(connectionString);
    
    const db = client.database(dbName);
    console.log("database info: ", db.id);

    const container = db.container(containerName);
    console.log("container info: ", container.id);

}

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} must be set`);
    }
    return value;
}

main();