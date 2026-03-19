/**
 * Groq Provider
 * Free/fast inference for open-source models (Llama, Mixtral)
 * Uses OpenAI-compatible API
 */

import { BaseLLMProvider, StreamChunk } from "../base-provider";

export class GroqProvider extends BaseLLMProvider {
  private baseUrl = "https://api.groq.com/openai/v1";

  async validateProvider(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
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
    // Groq offers free tier with rate limits
    // No per-token costs for free tier
    return {
      inputCost: 0,
      outputCost: 0,
      currency: "USD",
      note: "Free tier with rate limits",
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
          `Groq API error: ${error.error?.message || response.statusText}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body from Groq");
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
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content || "";

                if (content) {
                  yield {
                    type: "content",
                    content,
                  };
                }
              } catch {
                // Ignore parse errors for keep-alive messages
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error during streaming";
      throw new Error(`Groq streaming error: ${errorMessage}`);
    }
  }
}
