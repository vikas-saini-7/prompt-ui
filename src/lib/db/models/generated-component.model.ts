import { ObjectId } from "mongodb";

export interface GeneratedComponent {
  _id?: ObjectId;
  messageId: ObjectId;
  conversationId: ObjectId;
  userId: ObjectId;
  prompt: string;
  code: string;
  description: string;
  model: string;
  language: string;
  framework?: string;
  tags?: string[];
  createdAt: Date;
}

export const generatedComponentCollectionName = "generatedComponents";
