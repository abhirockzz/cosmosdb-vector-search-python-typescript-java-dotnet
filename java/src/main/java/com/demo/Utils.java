package com.demo;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.Embeddings;
import com.azure.ai.openai.models.EmbeddingsOptions;
import com.azure.cosmos.CosmosClientBuilder;
import com.azure.cosmos.CosmosContainer;

import java.util.Arrays;
import java.util.List;

public class Utils {

    public static List<Float> calculateEmbedding(OpenAIClient client, String input) {
        
        EmbeddingsOptions embeddingsOptions = new EmbeddingsOptions(
                Arrays.asList(input));

        Embeddings embeddings = client.getEmbeddings(System.getenv("EMBEDDINGS_MODEL"), embeddingsOptions);        
        return embeddings.getData().get(0).getEmbedding();
    }

    public static CosmosContainer getCosmosDBContainer() {
       
        // haven't used endpoint and key directly since other language samples are using connection string. this is just for consistency
        String connectionString = System.getenv("COSMOS_DB_CONNECTION_STRING");
        String[] parts = connectionString.split(";");
        
        String endpoint = null;
        String key = null;

        for (String part : parts) {
            if (part.startsWith("AccountEndpoint=")) {
                endpoint = part.split("=", 2)[1];
            } else if (part.startsWith("AccountKey=")) {
                key = part.split("=", 2)[1];
            }
        }

        if (endpoint == null || key == null) {
            throw new IllegalArgumentException("Invalid connection string format");
        }

        return new CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .buildClient()
                .getDatabase(System.getenv("DATABASE_NAME"))
                .getContainer(System.getenv("CONTAINER_NAME"));
    }
}
