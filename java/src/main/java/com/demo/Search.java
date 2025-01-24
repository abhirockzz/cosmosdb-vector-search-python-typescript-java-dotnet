package com.demo;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.models.CosmosQueryRequestOptions;
import com.azure.cosmos.models.SqlParameter;
import com.azure.cosmos.models.SqlQuerySpec;
import com.azure.cosmos.util.CosmosPagedIterable;

import java.util.ArrayList;
import java.util.List;

public class Search {

    static String QUERY = "SELECT TOP @num_results c.id, c.description, VectorDistance(c.embeddings, @embedding) AS similarityScore FROM c ORDER BY VectorDistance(c.embeddings, @embedding)";

    public static void run(String query, String numResults) {

        System.out.println("Search results for query: "+ query+ "\n");

        CosmosContainer container = Utils.getCosmosDBContainer();

        OpenAIClient client = new OpenAIClientBuilder()
                .credential(new AzureKeyCredential(System.getenv("AZURE_OPENAI_KEY")))
                .endpoint(System.getenv("AZURE_OPENAI_ENDPOINT"))
                .buildClient();

        List<Float> userPromptEmbedding = Utils.calculateEmbedding(client, query);

        ArrayList<SqlParameter> params = new ArrayList<>();
        params.add(new SqlParameter("@num_results",Integer.parseInt(numResults)));
        params.add(new SqlParameter("@embedding",userPromptEmbedding));

        SqlQuerySpec sqlQuerySpec = new SqlQuerySpec(QUERY, params);

        CosmosPagedIterable<MovieSearchResult> movieSearchResults = container.queryItems(sqlQuerySpec, new CosmosQueryRequestOptions(), MovieSearchResult.class);

        for(MovieSearchResult movieSearchResult: movieSearchResults) {
            System.out.println("Similarity score: "+ movieSearchResult.getSimilarityScore());
            System.out.println("Description: "+ movieSearchResult.getDescription());
            System.out.println("Title: "+ movieSearchResult.getId());
            System.out.println("=====================================");
        }
    }
}
