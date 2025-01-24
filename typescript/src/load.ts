import { getContainer, getAzureOpenAIClient, generateEmbeddings } from "./utils";
import * as fs from "fs";

const file = "../movies.json";

async function load() {
    try {
        const container = getContainer();
        const azureOpenAIClient = getAzureOpenAIClient();

        // Read movies.json file
        const movies = await readMoviesFromFile(file);

        // Load each movie into Cosmos DB container
        for (const movie of movies) {
            const movieWithEmbedding = await createMovieWithEmbedding(movie, azureOpenAIClient);
            await container.items.upsert(movieWithEmbedding);
            console.log(`Inserted movie: ${movie.title}`);
        }
    } catch (err) {
        console.error("Error loading movies:", err);
        process.exit(1);
    }
}

async function readMoviesFromFile(filePath: string): Promise<Movie[]> {
    try {
        console.log(`Reading movies from file: ${filePath}`);
        const data = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(data) as Movie[];
    } catch (err) {
        throw new Error(`Error reading or parsing file: ${err}`);
    }
}

async function createMovieWithEmbedding(movie: Movie, client: any): Promise<any> {
    const embedding = await generateEmbeddings(movie.description, client);
    console.log(`Created embedding for movie: ${movie.title}`);
    return {
        id: movie.title,
        description: movie.description,
        embeddings: embedding,
    };
}

type Movie = {
    title: string,
    description: string
}

load();