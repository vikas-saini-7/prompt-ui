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
    return `You are a React component code generator. Your task is to generate a complete, production-ready React component.

USER REQUEST: ${prompt}

CRITICAL REQUIREMENTS:
1. Generate ONLY valid JSX/JavaScript code - no markdown, no explanations, no comments
2. Use React hooks (useState, useEffect) for interactivity
3. Style with inline styles or standard CSS classes
4. Create a self-contained component that's ready to use immediately
5. If you create a named component function, end with the component name on its own line
6. Alternative: Return a direct JSX expression wrapped in parentheses like: (<div>test</div>)
7. Ensure all braces, parentheses, and tags are properly closed
8. No TypeScript types needed - use plain JavaScript
9. Import statements should be omitted

RESPONSE FORMAT:
Return ONLY the component code. Nothing else.

Component Code:`;
  }
}
