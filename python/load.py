from azure.cosmos import ContainerProxy
import utils
import json
import os

file_path = os.getenv("MOVIES_FILE_PATH", "../movies.json")

def main(container: ContainerProxy) -> None:
    with open(file_path, 'r') as file:
        movies = json.load(file)

    for movie in movies:
        try:
            title = movie["title"]
            description = movie["description"]
            embedding = utils.generate_embeddings(description)
            
            print("Generated description embedding for movie:", title)

            container.upsert_item({
                "id": title,
                #"title": title,
                "description": description,
                "embeddings": embedding
            })

            print("Added data to Cosmos DB for movie:", title)

        except Exception as e:
            print(f"Error processing movie {movie.get('title', 'unknown')}: {e}")

    print("Data loading complete")

if __name__ == "__main__":
    cosmos_container: ContainerProxy = utils.get_container()
    main(cosmos_container)