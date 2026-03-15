export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  code?: string;
  timestamp: Date;
}

export interface GenerationResponse {
  code: string;
  description?: string;
}

export interface APIError {
  message: string;
  code?: string;
}
