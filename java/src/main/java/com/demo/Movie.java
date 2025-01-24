package com.demo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Movie {
    private String id;
    private String title;
    private String description;
    private List<Float> embeddings;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Float> getEmbeddings() {
        return embeddings;
    }

    public void setEmbeddings(List<Float> embeddings) {
        this.embeddings = embeddings;
    }

    //generate toString
    @Override
    public String toString() {
        return "Movie{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

}
