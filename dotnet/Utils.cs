using Azure;
using Azure.AI.OpenAI;
using Microsoft.Azure.Cosmos;
using OpenAI.Embeddings;

namespace CosmosDBVectorSearchDemo;

class Utils
{

    public static Container GetCosmosDBContainer()
    {
        string cosmosDbConnectionString = GetEnvironmentVariableOrThrow("COSMOS_DB_CONNECTION_STRING");
        string cosmosDbDatabaseName = GetEnvironmentVariableOrThrow("DATABASE_NAME");
        string cosmosDbContainerName = GetEnvironmentVariableOrThrow("CONTAINER_NAME");

        CosmosClient cosmosClient = new(cosmosDbConnectionString);
        Database database = cosmosClient.GetDatabase(cosmosDbDatabaseName);
        Container container = database.GetContainer(cosmosDbContainerName);

        return container;
    }

    public static float[] GenerateEmbeddingForQuery(string query)
    {
        string oaiKey = GetEnvironmentVariableOrThrow("AZURE_OPENAI_KEY");
        Uri oaiEndpointUri = new(GetEnvironmentVariableOrThrow("AZURE_OPENAI_ENDPOINT"));

        AzureKeyCredential credentials = new(oaiKey);
        AzureOpenAIClient azOpenAIClient = new(oaiEndpointUri, credentials);

        EmbeddingClient embeddingClient = azOpenAIClient.GetEmbeddingClient(GetEnvironmentVariableOrThrow("EMBEDDINGS_MODEL"));

        System.ClientModel.ClientResult<OpenAIEmbedding> result = embeddingClient.GenerateEmbedding(query);

        return result.Value.ToFloats().ToArray();

    }
    public static string GetEnvironmentVariableOrThrow(string variableName)
    {
        string value = Environment.GetEnvironmentVariable(variableName) ?? string.Empty;
        if (string.IsNullOrEmpty(value))
        {
            throw new InvalidOperationException($"Environment variable '{variableName}' is not declared or is an empty string.");
        }
        return value;
    }
}
