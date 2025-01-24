"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmos_1 = require("@azure/cosmos");
function main() {
    const connectionString = getEnvVar("COSMOS_CONNECTION_STRING");
    const dbName = getEnvVar("DATABASE_NAME");
    const containerName = getEnvVar("CONTAINER_NAME");
    const client = new cosmos_1.CosmosClient(connectionString);
    const db = client.database(dbName);
    console.log("database info: ", db.id);
    const container = db.container(containerName);
    console.log("container info: ", container.id);
}
function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} must be set`);
    }
    return value;
}
main();
