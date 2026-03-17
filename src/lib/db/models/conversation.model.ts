import { ObjectId } from "mongodb";

export interface Conversation {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const conversationCollectionName = "conversations";
