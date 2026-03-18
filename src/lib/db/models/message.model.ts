import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "user" | "ai";
  content: string;
  code?: string;
  codeLanguage?: string;
  aiModel?: string;
  tokens?: {
    input: number;
    output: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>(
  {
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
    type: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    code: String,
    codeLanguage: String,
    aiModel: String,
    tokens: {
      input: Number,
      output: Number,
    },
  },
  { timestamps: true },
);

export const MessageModel =
  mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);
