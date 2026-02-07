import { tool } from "ai";
import { z } from "zod";

type XaiResponseCitation = {
  title?: string;
  url?: string;
  snippet?: string;
};

function extractTextFromXaiResponse(json: unknown) {
  if (!json || typeof json !== "object") {
    return "";
  }

  const maybeOutputText = (json as { output_text?: unknown }).output_text;
  if (typeof maybeOutputText === "string" && maybeOutputText.trim().length > 0) {
    return maybeOutputText.trim();
  }

  const output = (json as { output?: unknown }).output;
  if (!Array.isArray(output)) {
    return "";
  }

  const textChunks: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const contentItem of content) {
      if (!contentItem || typeof contentItem !== "object") {
        continue;
      }

      const text = (contentItem as { text?: unknown }).text;
      if (typeof text === "string" && text.trim().length > 0) {
        textChunks.push(text.trim());
      }
    }
  }

  return textChunks.join("\n\n");
}

function extractCitationsFromXaiResponse(json: unknown): XaiResponseCitation[] {
  if (!json || typeof json !== "object") {
    return [];
  }

  const citations = (json as { citations?: unknown }).citations;
  if (!Array.isArray(citations)) {
    return [];
  }

  const parsedCitations = citations
    .map((citation): XaiResponseCitation | null => {
      if (!citation || typeof citation !== "object") {
        return null;
      }

      const title = (citation as { title?: unknown }).title;
      const url = (citation as { url?: unknown }).url;
      const snippet = (citation as { snippet?: unknown }).snippet;

      return {
        title: typeof title === "string" ? title : undefined,
        url: typeof url === "string" ? url : undefined,
        snippet: typeof snippet === "string" ? snippet : undefined,
      };
    });

  return parsedCitations.filter(
    (citation): citation is XaiResponseCitation => citation !== null
  );
}

export const searchWebXai = tool({
  description:
    "Search the web with xAI native web search. Use this for current events, live facts, and location recommendations.",
  inputSchema: z.object({
    query: z.string().describe("Search query."),
    maxResults: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .default(5)
      .describe("Maximum number of search results to return."),
  }),
  execute: async ({ query, maxResults }) => {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return { error: "XAI_API_KEY is not set." };
    }

    try {
      const response = await fetch("https://api.x.ai/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-4-1-fast-non-reasoning",
          input: query,
          tools: [
            {
              type: "web_search",
              max_search_results: maxResults,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          error: `xAI web search failed (${response.status}): ${errorBody}`,
        };
      }

      const json = (await response.json()) as unknown;
      const answer = extractTextFromXaiResponse(json);
      const citations = extractCitationsFromXaiResponse(json);

      return {
        query,
        answer:
          answer ||
          "Search completed, but the provider did not return a text summary.",
        citations,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error while searching with xAI.",
      };
    }
  },
});
