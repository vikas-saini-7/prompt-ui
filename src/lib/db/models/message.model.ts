import { ObjectId } from "mongodb";

export interface Message {
  _id?: ObjectId;
  conversationId: ObjectId;
  userId: ObjectId;
  type: "user" | "ai";
  content: string;
  code?: string;
  codeLanguage?: string;
  model?: string;
  tokens?: {
    input: number;
    output: number;
  };
  timestamp: Date;
}

export const messageCollectionName = "messages";
