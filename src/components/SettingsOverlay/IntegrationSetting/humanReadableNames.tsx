import { IntegrationDto } from "./useIntegrations";

export const humanReadableProvider = (
  provider: IntegrationDto["provider"] | string
) => {
  switch (provider) {
    case "azure_open_ai":
      return "Azure Open AI";
    case "open_ai":
      return "Open AI";
    case "claude":
      return "Anthropic";
    case "aws_bedrock":
      return "AWS Bedrock";
    default:
      return provider;
  }
};

export const humanReadableModel = (model: IntegrationDto["model"] | string) => {
  switch (true) {
    case model === "gpt-4-1106-preview":
      return "GPT-4 Turbo Preview";
    case model.startsWith("gpt-3.5-turbo"):
      return "GPT-3.5 Turbo";
    case model.includes("claude-2"):
    case model.includes("claude-v2"):
      return "Claude v2.1";
    case model.includes("claude-instant"):
      return "Claude v1.2";
    case model === "dall-e-3":
      return "DALL-E 3";
    default:
      return model;
  }
};

export const humanReadableChatLabels = ({
  model,
  provider,
  hasMultipleAnthropicProviders,
  hasMultipleOpenAiProviders,
}: {
  model: string;
  provider: string;
  hasMultipleAnthropicProviders: boolean;
  hasMultipleOpenAiProviders: boolean;
}) => {
  if (model.startsWith("gpt-3.5")) {
    return hasMultipleOpenAiProviders
      ? `GPT-3.5 (${humanReadableProvider(provider)})`
      : "GPT-3.5";
  }
  if (model.startsWith("gpt-4")) {
    return hasMultipleOpenAiProviders
      ? `GPT-4 (${humanReadableProvider(provider)})`
      : "GPT-4";
  }
  if (
    model === "claude-instant-1.2" ||
    model === "anthropic.claude-instant-v1"
  ) {
    return hasMultipleAnthropicProviders
      ? `Claude v1.2 (${humanReadableProvider(provider)})`
      : "Claude v1.2";
  }
  if (model === "claude-2.1" || model === "anthropic.claude-v2:1") {
    return hasMultipleAnthropicProviders
      ? `Claude v2.1 (${humanReadableProvider(provider)})`
      : "Claude v2.1";
  }
  return humanReadableModel(model);
};
