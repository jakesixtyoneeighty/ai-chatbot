// Curated list of top models from Vercel AI Gateway
export const DEFAULT_CHAT_MODEL = "bytedance/seed-1.8";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "bytedance/seed-1.8",
    name: "Nudist AI",
    provider: "bytedance",
    description: "The first Nudist friendly, image positive AI chatbot",
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
