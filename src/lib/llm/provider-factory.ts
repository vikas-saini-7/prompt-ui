/**
 * LLM Provider Factory
 * Instantiates providers based on configuration
 * All model/provider configurations are in /config
 */

import { BaseLLMProvider } from "./base-provider";
import { OpenAIProvider } from "./providers/openai";
import { ClaudeProvider } from "./providers/claude";
import { MODELS_CONFIG, type ModelMetadata } from "@/config/models.config";

// Type for provider class constructor
type ProviderConstructor = new (
  apiKey: string,
  modelId: string,
) => BaseLLMProvider;

// Provider registry - maps provider names to their classes
const PROVIDER_REGISTRY: Record<string, ProviderConstructor> = {
  openai: OpenAIProvider,
  anthropic: ClaudeProvider,
};

// Re-export for backward compatibility
export type { ModelMetadata };
export const MODEL_METADATA = MODELS_CONFIG;

/**
 * Get LLM provider instance for a model
 * @param modelId - The model identifier (e.g., "gpt-4o", "claude-3-sonnet-20240229")
 * @returns BaseLLMProvider instance
 * @throws Error if model is not supported or API key is missing
 */
export function getLLMProvider(modelId: string): BaseLLMProvider {
  const modelConfig = MODELS_CONFIG[modelId];

  if (!modelConfig) {
    throw new Error(
      `Model "${modelId}" is not supported. Supported models: ${Object.keys(MODELS_CONFIG).join(", ")}`,
    );
  }

  const { provider: providerName, apiKeyEnv } = modelConfig;
  const ProviderClass = PROVIDER_REGISTRY[providerName];

  if (!ProviderClass) {
    throw new Error(
      `Provider "${providerName}" is not registered. Available providers: ${Object.keys(PROVIDER_REGISTRY).join(", ")}`,
    );
  }

  const apiKey = process.env[apiKeyEnv];

  if (!apiKey) {
    throw new Error(
      `API key not found. Please set ${apiKeyEnv} environment variable.`,
    );
  }

  return new ProviderClass(apiKey, modelId);
}

/**
 * Get metadata for a model
 */
export function getModelMetadata(modelId: string): ModelMetadata | null {
  return MODEL_METADATA[modelId] || null;
}

/**
 * Get all supported models grouped by provider
 * Dynamically filters based on isAvailable flag
 */
export function getSupportedModels(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {
    openai: [],
    anthropic: [],
  };

  Object.entries(MODELS_CONFIG).forEach(([modelId, config]) => {
    if (config.isAvailable) {
      grouped[config.provider].push(modelId);
    }
  });

  return grouped;
}

/**
 * Check if a model is available (API key is set)
 */
export function isModelAvailable(modelId: string): boolean {
  const modelConfig = MODELS_CONFIG[modelId];
  if (!modelConfig) return false;

  const apiKey = process.env[modelConfig.apiKeyEnv];
  return !!apiKey;
}

/**
 * Get all available models (where API keys are configured)
 */
export function getAvailableModels(): string[] {
  return Object.keys(MODELS_CONFIG).filter(isModelAvailable);
}

/**
 * Get all available models grouped by provider
 */
export function getAvailableModelsByProvider(): Record<
  string,
  ModelMetadata[]
> {
  const available = getAvailableModels();
  const grouped: Record<string, ModelMetadata[]> = {
    openai: [],
    anthropic: [],
  };

  available.forEach((modelId) => {
    const metadata = getModelMetadata(modelId);
    if (metadata) {
      grouped[metadata.provider].push(metadata);
    }
  });

  return grouped;
}
