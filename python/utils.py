from openai import AzureOpenAI
import os
from azure.cosmos import CosmosClient, ContainerProxy
import time

def get_env_variable(var_name: str) -> str:
    value = os.environ.get(var_name)
    #print(f"{var_name}={value}")
    if not value:
        raise ValueError(f"{var_name} environment variable is not set")
    return value

azure_openai_client = AzureOpenAI(
        azure_endpoint=get_env_variable("AZURE_OPENAI_ENDPOINT"),
        api_version=get_env_variable("AZURE_OPENAI_VERSION"),
        api_key=get_env_variable("AZURE_OPENAI_KEY")
    )

def generate_embeddings(text: str) -> list[float]:
    response = azure_openai_client.embeddings.create(input=text, model=get_env_variable("EMBEDDINGS_MODEL"))
    embeddings = response.data[0].embedding
    time.sleep(0.5) # to avoid rate limiting 
    return embeddings

def get_container() -> ContainerProxy:
    client = CosmosClient.from_connection_string(get_env_variable("COSMOS_DB_CONNECTION_STRING"))
    db = client.get_database_client(get_env_variable("DATABASE_NAME"))
    db_container = db.get_container_client(get_env_variable("CONTAINER_NAME"))
    print("database and container ready....")
    return db_container


