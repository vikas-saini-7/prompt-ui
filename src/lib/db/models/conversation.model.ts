import mongoose, { Schema, Document } from "mongoose";

export interface Conversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<Conversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  { timestamps: true },
);

export const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model<Conversation>("Conversation", conversationSchema);
