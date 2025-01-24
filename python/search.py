from azure.cosmos import ContainerProxy
import utils
import argparse

VECTOR_FIELD_NAME = "embeddings"

QUERY_TEMPLATE = f"""
SELECT TOP @num_results c.id, c.description, 
VectorDistance(c.{VECTOR_FIELD_NAME}, @embedding) AS SimilarityScore 
FROM c 
ORDER BY VectorDistance(c.{VECTOR_FIELD_NAME}, @embedding)
"""

def main(container: ContainerProxy, prompt: str, num_results: int = 3) -> None:
    try:
        query_embedding = utils.generate_embeddings(prompt)

        query = QUERY_TEMPLATE

        items = container.query_items(
            query,
            parameters=[
                {"name": "@num_results", "value": num_results},
                {"name": "@embedding", "value": query_embedding}
            ],
            enable_cross_partition_query=True
        )

        print(f'Search results for query: {prompt}\n')

        for item in items:
            print(f'Similarity score: {item["SimilarityScore"]}')
            print(f'Title: {item["id"]}')
            print(f'Description: {item["description"]}')
            print("=====================================")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cosmos DB Vector Search")
    parser.add_argument("query", type=str, help="Search query")
    parser.add_argument("top_k", type=int, help="Number of top results to return")

    args = parser.parse_args()

    cosmos_container: ContainerProxy = utils.get_container()
    main(cosmos_container, args.query, args.top_k)