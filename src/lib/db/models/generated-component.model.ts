import mongoose, { Schema, Document } from "mongoose";

export interface GeneratedComponent extends Document {
  messageId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  prompt: string;
  code: string;
  description: string;
  aiModel: string;
  language: string;
  framework?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const generatedComponentSchema = new Schema<GeneratedComponent>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    aiModel: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    framework: String,
    tags: [String],
  },
  { timestamps: true },
);

export const GeneratedComponentModel =
  mongoose.models.GeneratedComponent ||
  mongoose.model<GeneratedComponent>(
    "GeneratedComponent",
    generatedComponentSchema,
  );
