"use server";

import connectDB from "@/lib/db/mongodb";
import {
  MessageModel,
  ConversationModel,
  GeneratedComponentModel,
} from "@/lib/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function saveMessage(
  conversationId: string,
  type: "user" | "ai",
  content: string,
  options?: {
    code?: string;
    codeLanguage?: string;
    tokens?: { input: number; output: number };
  },
): Promise<string> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Verify that the conversation belongs to the user
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Create and save the message
    const newMessage = await MessageModel.create({
      conversationId,
      userId,
      type,
      content,
      code: options?.code,
      codeLanguage: options?.codeLanguage,
      tokens: options?.tokens,
    });

    return newMessage._id.toString();
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function getMessages(conversationId: string): Promise<
  Array<{
    id: string;
    type: "user" | "ai";
    content: string;
    code?: string;
    codeLanguage?: string;
    tokens?: { input: number; output: number };
    createdAt: string;
  }>
> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("USER_NOT_AUTHENTICATED");
    }

    const userId = session.user.id;

    // Verify that the conversation belongs to the user
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new Error("CONVERSATION_NOT_FOUND");
    }

    // Fetch all messages for the conversation
    const messages = await MessageModel.find({ conversationId }).sort({
      createdAt: 1,
    });
    // Map to frontend format
    return messages.map((msg) => ({
      id: msg._id.toString(),
      type: msg.type,
      content: msg.content,
      code: msg.code,
      codeLanguage: msg.codeLanguage,
      tokens:
        msg.tokens &&
        msg.tokens.input !== undefined &&
        msg.tokens.output !== undefined
          ? { input: msg.tokens.input, output: msg.tokens.output }
          : undefined,
      createdAt: msg.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Find the message and verify ownership
    const message = await MessageModel.findOne({ _id: messageId, userId });

    if (!message) {
      throw new Error("Message not found or unauthorized");
    }

    await MessageModel.findByIdAndDelete(messageId);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

export async function saveGeneratedComponent(
  conversationId: string,
  messageId: string,
  componentData: {
    prompt: string;
    code: string;
    description?: string;
    aiModel?: string;
    language?: string;
    framework?: string;
    tags?: string[];
  },
): Promise<string> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Verify that the conversation belongs to the user
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Create and save the generated component
    const newComponent = await GeneratedComponentModel.create({
      messageId,
      conversationId,
      userId,
      prompt: componentData.prompt,
      code: componentData.code,
      description: componentData.description,
      aiModel: componentData.aiModel,
      language: componentData.language,
      framework: componentData.framework,
      tags: componentData.tags,
    });

    return newComponent._id.toString();
  } catch (error) {
    console.error("Error saving generated component:", error);
    throw error;
  }
}

export async function getGeneratedComponents(conversationId: string): Promise<
  Array<{
    id: string;
    messageId: string;
    prompt: string;
    code: string;
    description?: string;
    aiModel?: string;
    language?: string;
    framework?: string;
    tags?: string[];
    createdAt: string;
  }>
> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Verify that the conversation belongs to the user
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Fetch all generated components for the conversation
    const components = await GeneratedComponentModel.find({
      conversationId,
    }).sort({ createdAt: -1 });

    // Map to frontend format
    return components.map((comp) => ({
      id: comp._id.toString(),
      messageId: comp.messageId.toString(),
      prompt: comp.prompt,
      code: comp.code,
      description: comp.description,
      aiModel: comp.aiModel,
      language: comp.language,
      framework: comp.framework,
      tags: comp.tags,
      createdAt: comp.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching generated components:", error);
    throw error;
  }
}
