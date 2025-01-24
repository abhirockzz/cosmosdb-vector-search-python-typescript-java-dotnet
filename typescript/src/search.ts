import { getContainer, getAzureOpenAIClient, generateEmbeddings } from "./utils";

async function search(input: string, topK: number) {
    const container = getContainer();
    const azureOpenAIClient = getAzureOpenAIClient();
    const queryEmbedding = await generateEmbeddings(input, azureOpenAIClient);

    const querySpec = {
        query: "SELECT TOP @num_results c.id, c.description, VectorDistance(c.embeddings, @embedding) AS SimilarityScore FROM c ORDER BY VectorDistance(c.embeddings, @embedding)",
        parameters: [
            { name: "@embedding", value: queryEmbedding },
            { name: "@num_results", value: topK }
        ]
    };

    const searchResults = (await container.items.query(querySpec).fetchAll()).resources;

    for (const result of searchResults) {
        console.log(`Similarity score: ${result.SimilarityScore}`);
        console.log(`Title: ${result.id}`);
        console.log(`Description: ${result.description}`);
        console.log('=====================================');
    }
}

function parseArguments(args: string[]): { query: string, numResults: number } {
    if (args.length < 2) {
        throw new Error("Please provide both a search query and the number of results to return.");
    }

    const query = args[0];
    const numResults = parseInt(args[1], 10);

    if (isNaN(numResults) || numResults <= 0) {
        throw new Error("The number of results must be a positive integer.");
    }

    return { query, numResults };
}

try {
    const { query, numResults } = parseArguments(process.argv.slice(2));

    console.log(`Search results for query: ${query}\n`);
    search(query, numResults).catch((err) => {
        console.error("Error during search:", err);
        process.exit(1);
    });
} catch (err) {
    console.error("Error parsing arguments:", err);
    process.exit(1);
}