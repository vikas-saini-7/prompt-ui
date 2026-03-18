/**
 * Base LLM Provider Abstract Class
 * All LLM providers must implement this interface
 * Ensures consistent API across different providers
 */

export interface StreamChunk {
  type: "content" | "error" | "done";
  content?: string;
  error?: string;
}

export abstract class BaseLLMProvider {
  protected apiKey: string;
  protected modelId: string;

  constructor(apiKey: string, modelId: string) {
    this.apiKey = apiKey;
    this.modelId = modelId;

    if (!apiKey) {
      throw new Error(`API key not provided for model: ${modelId}`);
    }
  }

  /**
   * Generate code from prompt and stream the response
   * Must be implemented by each provider
   */
  abstract generateCodeStream(
    prompt: string,
  ): AsyncGenerator<StreamChunk, void, unknown>;

  /**
   * Validate that the provider can be used
   */
  abstract validateProvider(): Promise<boolean>;

  /**
   * Get cost per 1M tokens (for tracking purposes)
   */
  abstract getCost(): {
    inputCost: number;
    outputCost: number;
    currency: string;
  };

  /**
   * Format prompt for code generation
   */
  protected formatPrompt(prompt: string): string {
    return `You are a React component code generator. Generate a complete, production-ready React component (TSX) based on this description. Include Tailwind CSS styling. The component should be self-contained, ready to use, and follow React best practices.

Description: ${prompt}

Requirements:
- Write only React/TypeScript code
- Use Tailwind CSS for styling
- Include proper imports
- Make it visually appealing and functional
- Return only the code, no explanations

Component code:`;
  }
}
