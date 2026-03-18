import React from "react";

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
  language?: string;
  framework?: string;
  tags?: string[];
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
  provider?: "openai" | "anthropic";
  isAvailable?: boolean;
}

export interface InputOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
