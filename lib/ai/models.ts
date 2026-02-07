// Curated list of chat models
export const DEFAULT_CHAT_MODEL = "xai/grok-4-1-fast-reasoning";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "xai/grok-4-1-fast-reasoning",
    name: "Nudist AI",
    provider: "xai",
    description: "Nudist-friendly chat powered by Grok 4.1 Fast Reasoning",
  },
];

const MODEL_ID_ALIASES: Record<string, string> = {
  "xai/grok-4.1-fast-reasoning": "xai/grok-4-1-fast-reasoning",
  "xai/grok-4.1-fast-non-reasoning": "xai/grok-4-1-fast-non-reasoning",
};
const SUPPORTED_CHAT_MODEL_IDS = new Set(chatModels.map((model) => model.id));

export function normalizeChatModelId(modelId: string) {
  return MODEL_ID_ALIASES[modelId] ?? modelId;
}

export function isSupportedChatModelId(modelId: string) {
  const normalizedId = normalizeChatModelId(modelId);
  return SUPPORTED_CHAT_MODEL_IDS.has(normalizedId);
}

export function resolveChatModelId(modelId?: string | null) {
  if (!modelId) {
    return DEFAULT_CHAT_MODEL;
  }

  const normalizedId = normalizeChatModelId(modelId);
  return isSupportedChatModelId(normalizedId)
    ? normalizedId
    : DEFAULT_CHAT_MODEL;
}

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
