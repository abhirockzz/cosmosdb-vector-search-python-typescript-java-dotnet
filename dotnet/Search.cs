using Microsoft.Azure.Cosmos;

namespace CosmosDBVectorSearchDemo;

class Search
{
    public static async Task Run(Container container, string query, int numResults)
    {
        Console.WriteLine($"Search results for query: {query}\n");

        float[] queryEmbedding = Utils.GenerateEmbeddingForQuery(query);

        var queryDef = new QueryDefinition(

            query: $"SELECT TOP @num_results c.id, c.description, VectorDistance(c.embeddings, @embedding) AS SimilarityScore FROM c ORDER BY VectorDistance(c.embeddings, @embedding)")
            .WithParameter("@embedding", queryEmbedding)
            .WithParameter("@num_results", numResults);

        using FeedIterator<SearchResult> feed = container.GetItemQueryIterator<SearchResult>(
            queryDefinition: queryDef
        );
        while (feed.HasMoreResults)
        {
            FeedResponse<SearchResult> response = await feed.ReadNextAsync();
            foreach (SearchResult item in response)
            {
                Console.WriteLine($"Similarity Score: {item.SimilarityScore}");
                Console.WriteLine($"Title: {item.id}");
                Console.WriteLine($"Description: {item.description}");
                Console.WriteLine("=====================================");

            }
        }
    }
    private record SearchResult(string id, string description, float SimilarityScore);

}
