using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace CosmosDBVectorSearchDemo;

class Load
{
    public static async Task Run(Container container)
    {
        string jsonFilePath = "../movies.json";

        if (!File.Exists(jsonFilePath))
        {
            Console.WriteLine($"File not found: {jsonFilePath}");
            return;
        }

        string jsonString = await File.ReadAllTextAsync(jsonFilePath);
        var movieInfo = JsonSerializer.Deserialize<List<MovieInfo>>(jsonString);

        if (movieInfo == null)
        {
            Console.WriteLine("No movies found in the JSON file.");
            return;
        }

        foreach (var movie in movieInfo)
        {
            float[] embedding = Utils.GenerateEmbeddingForQuery(movie.description);

            Console.WriteLine($"Generated description embeddings for: {movie.title}");

            Movie movieDocument = new(movie.title, movie.description, embedding);

            //await container.CreateItemAsync(movieDocument, new PartitionKey(movieDocument.id));
            await container.UpsertItemAsync(movieDocument, new PartitionKey(movieDocument.id));
            Console.WriteLine($"Added movie: {movie.title} to Cosmos DB");
        }

        Console.WriteLine("Data loaded successfully.");
    }

    private record MovieInfo(string title, string description);
    private record Movie(string id, string description, float[] embeddings);
}