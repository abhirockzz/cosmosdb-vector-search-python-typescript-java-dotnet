# Create the vector embedding policy
vector_embedding_policy = {
    "vectorEmbeddings": [
        {
            "path": "/embeddings",
            "dataType": "float32",
            "distanceFunction": "cosine",
            "dimensions": 1536
        }
    ]
}

# Create the indexing policy
indexing_policy = {
    "indexingMode": "consistent",
    "automatic": True,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/\"_etag\"/?"
        },
        {
            "path": "/embeddings/*"
        }
    ],
    "vectorIndexes": [
        {
            "path": "/embeddings",
            "type": "diskANN"
        }
    ]
}