/**
 * Anthropic Claude Provider
 * Supports streaming responses via Server-Sent Events
 */

import { BaseLLMProvider, StreamChunk } from "../base-provider";

export class ClaudeProvider extends BaseLLMProvider {
  private baseUrl = "https://api.anthropic.com/v1";

  async validateProvider(): Promise<boolean> {
    try {
      // Claude doesn't have a models list endpoint, so we verify with a simple message
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: this.modelId,
          max_tokens: 10,
          messages: [
            {
              role: "user",
              content: "ping",
            },
          ],
        }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  getCost() {
    // Cost per 1M tokens as of March 2024
    const costs: Record<string, { input: number; output: number }> = {
      "claude-3-5-sonnet-20241022": { input: 3, output: 15 },
      "claude-3-opus-20240229": { input: 15, output: 75 },
      "claude-3-sonnet-20240229": { input: 3, output: 15 },
      "claude-3-haiku-20240307": { input: 0.8, output: 4 },
    };

    const cost = costs[this.modelId] || costs["claude-3-5-sonnet-20241022"];
    return {
      inputCost: cost.input,
      outputCost: cost.output,
      currency: "USD",
    };
  }

  async *generateCodeStream(prompt: string): AsyncGenerator<StreamChunk> {
    const formattedPrompt = this.formatPrompt(prompt);

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: this.modelId,
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: formattedPrompt,
            },
          ],
          system:
            "You are an expert React/TypeScript component generator. Generate clean, production-ready code.",
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Claude API error: ${error.error?.message || response.statusText}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body from Claude");
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
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "content_block_delta") {
                  const chunk = data.delta?.text || "";
                  if (chunk) {
                    yield {
                      type: "content",
                      content: chunk,
                    };
                  }
                } else if (data.type === "message_stop") {
                  yield { type: "done" };
                  return;
                }
              } catch {
                // Ignore parse errors
              }
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
          : "Failed to generate code from Claude";
      yield {
        type: "error",
        error: errorMessage,
      };
    }
  }
}
