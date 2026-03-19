"use server";

import connectDB from "@/lib/db/mongodb";
import { ConversationModel } from "@/lib/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function createConversation(
  title: string = "New Conversation",
  description?: string,
): Promise<string> {
  try {
    await connectDB();

    // Extract user ID from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Create a new conversation in the database
    const newConversation = await ConversationModel.create({
      userId,
      title,
      description,
    });

    // Return the conversation ID as a string
    return newConversation._id.toString();
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}

export async function getConversations(): Promise<
  Array<{
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log("[getConversations-AUTH] Session check:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
    });

    if (!session || !session.user || !session.user.id) {
      console.error("[getConversations-ERROR] Authentication failed");
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Fetch all conversations for the user
    console.log(
      "[getConversations-FETCH] Fetching conversations for userId:",
      userId,
    );
    const conversations = await ConversationModel.find({ userId }).sort({
      createdAt: -1,
    });

    console.log("[getConversations-RESULT] Fetch result:", {
      count: conversations.length,
      conversationIds: conversations.map((c) => c._id.toString()),
    });

    // Map to frontend format
    const result = conversations.map((conv) => ({
      id: conv._id.toString(),
      title: conv.title,
      description: conv.description,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    console.log(
      "[getConversations-SUCCESS] Successfully fetched and mapped conversations:",
      {
        count: result.length,
      },
    );

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error(
      "[getConversations-ERROR-CATCH] Error fetching conversations:",
      {
        errorMsg,
        errorStack,
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
      },
    );
    throw error;
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Delete conversation only if it belongs to the user
    const result = await ConversationModel.findOneAndDelete({
      _id: conversationId,
      userId,
    });

    if (!result) {
      throw new Error("Conversation not found or unauthorized");
    }

    console.log("Conversation deleted:", conversationId);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}
