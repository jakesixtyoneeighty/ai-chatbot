import { customProvider, type LanguageModel } from "ai";
import { normalizeChatModelId } from "./models";
import { isTestEnvironment } from "../constants";

const XAI_TITLE_MODEL = "grok-4-1-fast-non-reasoning";
const XAI_ARTIFACT_MODEL = "grok-4-1-fast-non-reasoning";

let xaiProvider: ((modelId: string) => LanguageModel) | null = null;

function getXaiProvider() {
  if (xaiProvider) {
    return xaiProvider;
  }

  try {
    const { xai } = require("@ai-sdk/xai") as {
      xai: (modelId: string) => LanguageModel;
    };
    xaiProvider = xai;
    return xaiProvider;
  } catch {
    throw new Error(
      "xAI provider is unavailable. Install @ai-sdk/xai and set XAI_API_KEY."
    );
  }
}

function toXaiModelId(modelId: string) {
  const normalizedModelId = normalizeChatModelId(modelId);
  return normalizedModelId.startsWith("xai/")
    ? normalizedModelId.slice("xai/".length)
    : normalizedModelId;
}

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    const normalizedModelId = normalizeChatModelId(modelId);
    const mockModelId = normalizedModelId.includes("reasoning")
      ? "chat-model-reasoning"
      : "chat-model";

    return myProvider.languageModel(mockModelId);
  }

  const xai = getXaiProvider();
  return xai(toXaiModelId(modelId));
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }

  const xai = getXaiProvider();
  return xai(XAI_TITLE_MODEL);
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }

  const xai = getXaiProvider();
  return xai(XAI_ARTIFACT_MODEL);
}
