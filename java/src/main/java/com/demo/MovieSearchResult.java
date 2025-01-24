package com.demo;

public class MovieSearchResult {
    private String id;
    //private String title;
    private String description;
    private double similarityScore;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public void setSimilarityScore(double similarityScore) {
        this.similarityScore = similarityScore;
    }

    @Override
    public String toString() {
        return "MovieSearchResult{" +
                "title='" + id + '\'' +
                ", description='" + description + '\'' +
                ", similarityScore=" + similarityScore +
                '}';
    }
}

