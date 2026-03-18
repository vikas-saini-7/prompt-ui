/**
 * Streaming Utilities
 * Client-side helpers for handling Server-Sent Events from LLM API
 */

export interface StreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  onStart?: () => void;
}

/**
 * Stream code generation from API endpoint
 * Accumulates chunks and calls callbacks as they arrive
 *
 * Usage:
 * const result = await streamCodeGeneration(prompt, modelId, {
 *   onChunk: (chunk) => setCode(prev => prev + chunk),
 *   onComplete: () => console.log("Done!"),
 *   onError: (error) => console.error(error)
 * });
 */
export async function streamCodeGeneration(
  prompt: string,
  modelId: string,
  options: StreamOptions = {},
): Promise<string> {
  const { onChunk, onComplete, onError, onStart } = options;

  let fullCode = "";

  try {
    onStart?.();

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, modelId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");

        // Keep the last incomplete message in buffer
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "content") {
                const chunk = data.content || "";
                fullCode += chunk;
                onChunk?.(chunk);
              } else if (data.type === "error") {
                throw new Error(data.error);
              } else if (data.type === "done") {
                onComplete?.();
                return fullCode;
              }
            } catch (parseError) {
              if (parseError instanceof SyntaxError) {
                // Ignore JSON parse errors from keep-alive messages
                continue;
              }
              throw parseError;
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.startsWith("data: ")) {
        try {
          const data = JSON.parse(buffer.slice(6));

          if (data.type === "content") {
            const chunk = data.content || "";
            fullCode += chunk;
            onChunk?.(chunk);
          } else if (data.type === "error") {
            throw new Error(data.error);
          }
        } catch (parseError) {
          if (!(parseError instanceof SyntaxError)) {
            throw parseError;
          }
        }
      }

      onComplete?.();
      return fullCode;
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError?.(errorMsg);
    throw error;
  }
}

/**
 * Format streaming chunks for display
 * Handles line breaks and code block markers
 */
export function formatStreamedCode(code: string): string {
  return code
    .trim()
    .replace(/^```[a-z]*\n?/, "") // Remove opening code fence
    .replace(/\n?```$/, ""); // Remove closing code fence
}

/**
 * Parse error messages from stream
 */
export function parseStreamError(error: string): {
  message: string;
  type: "auth" | "rate_limit" | "provider" | "other";
} {
  const lowerError = error.toLowerCase();

  if (lowerError.includes("unauthorized") || lowerError.includes("forbidden")) {
    return { message: error, type: "auth" };
  }

  if (lowerError.includes("rate limit")) {
    return { message: error, type: "rate_limit" };
  }

  if (
    lowerError.includes("api") ||
    lowerError.includes("provider") ||
    lowerError.includes("authentication")
  ) {
    return { message: error, type: "provider" };
  }

  return { message: error, type: "other" };
}
