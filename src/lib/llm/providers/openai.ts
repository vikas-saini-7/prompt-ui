/**
 * OpenAI GPT-4 and GPT-3.5 Provider
 * Supports streaming responses for real-time code generation
 */

import { BaseLLMProvider, StreamChunk } from "../base-provider";

export class OpenAIProvider extends BaseLLMProvider {
  private baseUrl = "https://api.openai.com/v1";

  async validateProvider(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${this.modelId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  getCost() {
    // Cost per 1M tokens as of March 2024
    const costs: Record<string, { input: number; output: number }> = {
      "gpt-4o": { input: 5, output: 15 },
      "gpt-4-turbo": { input: 10, output: 30 },
      "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
    };

    const cost = costs[this.modelId] || costs["gpt-4o"];
    return {
      inputCost: cost.input,
      outputCost: cost.output,
      currency: "USD",
    };
  }

  async *generateCodeStream(prompt: string): AsyncGenerator<StreamChunk> {
    const formattedPrompt = this.formatPrompt(prompt);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            {
              role: "system",
              content:
                "You are an expert React/TypeScript component generator. Generate clean, production-ready code.",
            },
            {
              role: "user",
              content: formattedPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API error: ${error.error?.message || response.statusText}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body from OpenAI");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines[lines.length - 1];

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();

            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                yield { type: "done" };
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const chunk = parsed.choices[0]?.delta?.content || "";

                if (chunk) {
                  yield {
                    type: "content",
                    content: chunk,
                  };
                }
              } catch {
                // Ignore parse errors for keep-alive messages
              }
            }
          }
        }

        // Handle any remaining buffer
        if (buffer.startsWith("data: ")) {
          const data = buffer.slice(6);
          if (data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.choices[0]?.delta?.content || "";
              if (chunk) {
                yield {
                  type: "content",
                  content: chunk,
                };
              }
            } catch {
              // Ignore
            }
          }
        }

        yield { type: "done" };
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate code from OpenAI";
      yield {
        type: "error",
        error: errorMessage,
      };
    }
  }
}
