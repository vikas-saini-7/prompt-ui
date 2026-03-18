import mongoose, { Schema, Document } from "mongoose";
import { getDefaultModelId } from "@/config/models.config";

export interface UserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  defaultModel: string;
  theme: "dark" | "light";
  autoSaveConversations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<UserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    defaultModel: {
      type: String,
      default: () => getDefaultModelId(),
    },
    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },
    autoSaveConversations: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const UserSettingsModel =
  mongoose.models.UserSettings ||
  mongoose.model<UserSettings>("UserSettings", userSettingsSchema);
