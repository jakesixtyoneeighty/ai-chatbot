import { tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";

const getExaClient = () => {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("EXA_API_KEY is not set in environment variables");
  }
  return new Exa(apiKey);
};

export const searchExa = tool({
  description: "Search the web using Exa. Use this to find information on the internet.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    numResults: z.number().optional().default(5).describe("Number of results to return"),
  }),
  execute: async ({ query, numResults }) => {
    try {
      const exa = getExaClient();
      const result = await exa.searchAndContents(query, {
        numResults,
        useAutoprompt: true,
        text: true,
        highlights: {
            numSentences: 3,
            highlightsPerUrl: 1,
        },
      });
      return result;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error occurred during search" };
    }
  },
});

export const readUrlExa = tool({
  description: "Read the content of a specific URL using Exa.",
  inputSchema: z.object({
    url: z.string().describe("The URL to read content from"),
  }),
  execute: async ({ url }) => {
    try {
      const exa = getExaClient();
      // Exa's getContents expects an array of IDs (which can be URLs)
      const result = await exa.getContents([url], {
        text: true,
      });
      return result;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error occurred during URL fetch" };
    }
  },
});
