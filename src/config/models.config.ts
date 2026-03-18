/**
 * Model Configuration
 * Centralized configuration for all available LLM models
 * Manage all model-related settings from here
 */

export interface ModelMetadata {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "groq";
  apiKeyEnv: string; // Environment variable name for the API key
  isAvailable: boolean; // Enable/disable models easily
}

export const MODELS_CONFIG: Record<string, ModelMetadata> = {
  // Groq Models (Free Tier Available)
  "llama-3.3-70b-versatile": {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    provider: "groq",
    apiKeyEnv: "GROQ_API_KEY",
    isAvailable: true,
  },
  "llama-3.1-8b-instant": {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "groq",
    apiKeyEnv: "GROQ_API_KEY",
    isAvailable: true,
  },
  "meta-llama/llama-4-scout-17b-16e-instruct": {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    provider: "groq",
    apiKeyEnv: "GROQ_API_KEY",
    isAvailable: true,
  },
  // OpenAI Models
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    apiKeyEnv: "OPENAI_API_KEY",
    isAvailable: false,
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    apiKeyEnv: "OPENAI_API_KEY",
    isAvailable: false,
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    apiKeyEnv: "OPENAI_API_KEY",
    isAvailable: false,
  },

  // Anthropic Claude Models
  "claude-3-5-sonnet-20241022": {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    isAvailable: false,
  },
  "claude-3-opus-20240229": {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    isAvailable: false,
  },
  "claude-3-sonnet-20240229": {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    isAvailable: false,
  },
  "claude-3-haiku-20240307": {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    isAvailable: false,
  },
};

/**
 * Get the first model ID (default model)
 */
export function getDefaultModelId(): string {
  return Object.keys(MODELS_CONFIG)[0] || "gpt-4o";
}
