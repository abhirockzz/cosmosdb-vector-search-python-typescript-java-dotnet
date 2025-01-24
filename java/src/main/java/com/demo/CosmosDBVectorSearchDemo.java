package com.demo;

public class CosmosDBVectorSearchDemo {

    public static void main(String[] args) {

        if (args.length < 1) {
            System.out.println("Please provide an operation: load or search");
            return;
        }

        String operation = args[0];

        switch (operation.toLowerCase()) {
            case "load":
                Load.run();
                break;
            case "search":
                if (args.length < 3) {
                    System.out.println("Please provide a query and the number of results for the search operation");
                    return;
                }
                String query = args[1];
                String numResults = args[2];
                Search.run(query, numResults);
                break;
            default:
                System.out.println("Unknown operation: " + operation);
                System.out.println("Valid operations are: load, search");
                break;
        }
    }
}