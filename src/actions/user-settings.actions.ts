"use server";

import connectDB from "@/lib/db/mongodb";
import { UserSettingsModel } from "@/lib/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getDefaultModelId } from "@/config/models.config";

export async function getUserSettings() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    let userSettings = await UserSettingsModel.findOne({ userId });

    // If user doesn't have settings yet, create default settings
    if (!userSettings) {
      userSettings = await UserSettingsModel.create({
        userId,
        defaultModel: getDefaultModelId(),
        theme: "dark",
        autoSaveConversations: true,
      });
    }

    return {
      defaultModel: userSettings.defaultModel,
      theme: userSettings.theme,
      autoSaveConversations: userSettings.autoSaveConversations,
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    // Return default settings if there's an error
    return {
      defaultModel: getDefaultModelId(),
      theme: "dark" as const,
      autoSaveConversations: true,
    };
  }
}

export async function updateDefaultModel(modelId: string) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const updatedSettings = await UserSettingsModel.findOneAndUpdate(
      { userId },
      { defaultModel: modelId },
      { upsert: true, returnDocument: "after" },
    );

    return {
      success: true,
      defaultModel: updatedSettings.defaultModel,
    };
  } catch (error) {
    console.error("Error updating default model:", error);
    throw error;
  }
}

export async function updateUserTheme(theme: "dark" | "light") {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const updatedSettings = await UserSettingsModel.findOneAndUpdate(
      { userId },
      { theme },
      { upsert: true, returnDocument: "after" },
    );

    return {
      success: true,
      theme: updatedSettings.theme,
    };
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
}

export async function updateAutoSaveConversations(autoSave: boolean) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const updatedSettings = await UserSettingsModel.findOneAndUpdate(
      { userId },
      { autoSaveConversations: autoSave },
      { upsert: true, returnDocument: "after" },
    );

    return {
      success: true,
      autoSaveConversations: updatedSettings.autoSaveConversations,
    };
  } catch (error) {
    console.error("Error updating auto-save setting:", error);
    throw error;
  }
}
