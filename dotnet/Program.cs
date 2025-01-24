using Microsoft.Azure.Cosmos;

namespace CosmosDBVectorSearchDemo
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // dotnet run load
            // dotnet run search "action thriller" 3
            if (args.Length < 1)
            {
                Console.WriteLine("Usage: dotnet run <operation> [<query> <numResults>]");
                return;
            }

            string operation = args[0].ToLower();

            Container container = Utils.GetCosmosDBContainer();

            switch (operation)
            {
                case "load":
                    await Load.Run(container);
                    break;

                case "search":
                    if (args.Length < 3)
                    {
                        Console.WriteLine("Usage: dotnet run search <query> <numResults>");
                        return;
                    }

                    string query = args[1];
                    if (!int.TryParse(args[2], out int numResults))
                    {
                        Console.WriteLine("The second argument must be an integer representing the number of results.");
                        return;
                    }

                    await Search.Run(container, query, numResults);
                    break;

                default:
                    Console.WriteLine("Invalid operation. Use 'load' or 'search'.");
                    break;
            }
        }
    }
}