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

export interface Conversation {
  id: string;
  title: string;
  messages?: ChatMessage[];
  preview?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Model {
  id: string;
  name: string;
}

export interface InputOption {
  id: string;
  label: string;
  icon: unknown;
}
