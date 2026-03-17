import { ObjectId } from "mongodb";

export interface UserSettings {
  _id?: ObjectId;
  userId: ObjectId;
  defaultModel: string;
  theme: "dark" | "light";
  autoSaveConversations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const userSettingsCollectionName = "userSettings";
