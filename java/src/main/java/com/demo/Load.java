package com.demo;

import java.io.File;
import java.io.IOException;
import java.util.List;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.cosmos.CosmosContainer;
import com.fasterxml.jackson.databind.ObjectMapper;


public class Load {

    public static void run() {

        System.out.println("Loading data...");

        CosmosContainer container = Utils.getCosmosDBContainer();

        ObjectMapper objectMapper = new ObjectMapper();
        try  {
            List<Movie> movies = objectMapper.readValue(new File("../movies.json"), objectMapper.getTypeFactory().constructCollectionType(List.class, Movie.class));

            OpenAIClient client = new OpenAIClientBuilder()
                .credential(new AzureKeyCredential(System.getenv("AZURE_OPENAI_KEY")))
                .endpoint(System.getenv("AZURE_OPENAI_ENDPOINT"))
                .buildClient();

            for (Movie movie : movies) {                
                movie.setId(movie.getTitle());
                movie.setEmbeddings(Utils.calculateEmbedding(client, movie.getDescription()));
                System.out.println("calculated embedding for "+ movie.getTitle());

                container.upsertItem(movie);
                System.out.println("Added movie to Cosmos DB: " + movie.getTitle());
            }

            System.out.println("Data loaded successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
