import { GenerationResponse, APIError, ChatMessage } from "@/types";

/**
 * Abstract API service layer
 * This can be replaced with actual backend calls
 * Currently uses mock data for demonstration
 */

class APIService {
  private baseURL: string = process.env.NEXT_PUBLIC_API_URL || "";
  private timeout: number = 30000;

  /**
   * Generate component from prompt
   * @param prompt - User's component description
   * @param modelId - Selected AI model ID
   * @returns Generated code and description
   */
  async generateComponent(
    prompt: string,
    modelId: string = "gpt-4"
  ): Promise<GenerationResponse> {
    try {
      if (this.baseURL) {
        // Real API call
        return (await this.callAPI("/api/generate", {
          prompt,
          modelId,
        })) as GenerationResponse;
      } else {
        // Mock response for development
        return this.getMockResponse(prompt);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get conversation history
   * @returns List of past conversations
   */
  async getConversations() {
    try {
      if (this.baseURL) {
        return (await this.callAPI("/api/conversations")) as any;
      } else {
        return [];
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Save conversation
   * @param messages - Chat messages to save
   * @returns Saved conversation ID
   */
  async saveConversation(messages: ChatMessage[]): Promise<string> {
    try {
      if (this.baseURL) {
        const response = await this.callAPI("/api/conversations", {
          messages,
        });
        return response.id;
      } else {
        // Mock: return random ID
        return Date.now().toString();
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Internal method to make API calls
   */
  private async callAPI(endpoint: string, data?: Record<string, any>): Promise<Record<string, any>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: data ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Mock response generator for development
   */
  private getMockResponse(prompt: string): GenerationResponse {
    const mockCode = `import React from 'react';
import { Zap } from 'lucide-react';

export default function Component() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00E87B]">
            <Zap className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Generated Component
          </h2>
        </div>
        <p className="text-zinc-400 mb-6">
          This component was generated from your prompt: "${prompt}". You can copy the code and customize it as needed.
        </p>
        <button className="bg-[#00E87B] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#00E87B]/90 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}`;

    return {
      code: mockCode,
      description:
        "I've generated a component based on your description. You can copy the code, customize it, or ask for modifications.",
    };
  }

  /**
   * Error handling utility
   */
  private handleError(error: unknown): APIError {
    const apiError: APIError = {
      message: "An error occurred",
    };

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      apiError.message = "Network error. Please check your connection.";
      apiError.code = "NETWORK_ERROR";
    } else if (error instanceof Error && error.name === "AbortError") {
      apiError.message = "Request timeout. Please try again.";
      apiError.code = "TIMEOUT";
    } else if (error instanceof Error) {
      apiError.message = error.message;
      apiError.code = "UNKNOWN_ERROR";
    }

    return apiError;
  }

  /**
   * Set custom base URL for API calls
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Set custom timeout
   */
  setTimeout(ms: number): void {
    this.timeout = ms;
  }
}

export const apiService = new APIService();
