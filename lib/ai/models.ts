// Curated list of top models from Vercel AI Gateway
export const DEFAULT_CHAT_MODEL = "xai/grok-4.1-fast-reasoning";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "xai/grok-4.1-fast-reasoning",
    name: "Nudist AI",
    provider: "xai",
    description: "Nudist-friendly chat powered by Grok 4.1 Fast Reasoning",
  },
];

// Group models by provider for UI
export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
