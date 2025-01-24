"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const file = "../movies.json";
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const container = (0, utils_1.getContainer)();
            const azureOpenAIClient = (0, utils_1.getAzureOpenAIClient)();
            // Read movies.json file
            const movies = yield readMoviesFromFile(file);
            // Load each movie into Cosmos DB container
            for (const movie of movies) {
                const movieWithEmbedding = yield createMovieWithEmbedding(movie, azureOpenAIClient);
                yield container.items.upsert(movieWithEmbedding);
                console.log(`Inserted movie: ${movie.title}`);
            }
        }
        catch (err) {
            console.error("Error loading movies:", err);
            process.exit(1);
        }
    });
}
function readMoviesFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Reading movies from file: ${filePath}`);
            const data = yield fs.promises.readFile(filePath, "utf-8");
            return JSON.parse(data);
        }
        catch (err) {
            throw new Error(`Error reading or parsing file: ${err}`);
        }
    });
}
function createMovieWithEmbedding(movie, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const embedding = yield (0, utils_1.generateEmbeddings)(movie.description, client);
        console.log(`Created embedding for movie: ${movie.title}`);
        return {
            id: movie.title,
            description: movie.description,
            embeddings: embedding,
        };
    });
}
load();
