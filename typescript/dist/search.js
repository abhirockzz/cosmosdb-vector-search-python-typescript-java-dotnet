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
const utils_1 = require("./utils");
function search(input, topK) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = (0, utils_1.getContainer)();
        const azureOpenAIClient = (0, utils_1.getAzureOpenAIClient)();
        const queryEmbedding = yield (0, utils_1.generateEmbeddings)(input, azureOpenAIClient);
        const querySpec = {
            query: "SELECT TOP @num_results c.id, c.description, VectorDistance(c.embeddings, @embedding) AS SimilarityScore FROM c ORDER BY VectorDistance(c.embeddings, @embedding)",
            parameters: [
                { name: "@embedding", value: queryEmbedding },
                { name: "@num_results", value: topK }
            ]
        };
        const searchResults = (yield container.items.query(querySpec).fetchAll()).resources;
        for (const result of searchResults) {
            console.log(`Similarity score: ${result.SimilarityScore}`);
            console.log(`Title: ${result.id}`);
            console.log(`Description: ${result.description}`);
            console.log('=====================================');
        }
    });
}
function parseArguments(args) {
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
}
catch (err) {
    console.error("Error parsing arguments:", err);
    process.exit(1);
}
