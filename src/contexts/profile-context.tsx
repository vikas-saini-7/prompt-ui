"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  getUserSettings,
  updateDefaultModel,
  updateUserTheme,
  updateAutoSaveConversations,
} from "@/actions/user-settings.actions";
import { getDefaultModelId } from "@/config/models.config";

export interface UserProfile {
  defaultModel: string;
  theme: "dark" | "light";
  autoSaveConversations: boolean;
}

interface ProfileContextType {
  // State
  profile: UserProfile;
  isProfileLoading: boolean;
  isProfileLoaded: boolean;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setDefaultModel: (modelId: string) => Promise<void>;
  setTheme: (theme: "dark" | "light") => Promise<void>;
  setAutoSaveConversations: (autoSave: boolean) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined,
);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>({
    defaultModel: getDefaultModelId(),
    theme: "dark",
    autoSaveConversations: true,
  });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsProfileLoading(true);
        const userSettings = await getUserSettings();
        setProfile({
          defaultModel: userSettings.defaultModel,
          theme: userSettings.theme,
          autoSaveConversations: userSettings.autoSaveConversations,
        });
        setIsProfileLoaded(true);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        // Keep defaults if loading fails
        setIsProfileLoaded(true);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const setDefaultModel = useCallback(async (modelId: string) => {
    setProfile((prev) => ({ ...prev, defaultModel: modelId }));
    try {
      await updateDefaultModel(modelId);
    } catch (error) {
      console.error("Failed to update default model:", error);
      throw error;
    }
  }, []);

  const setTheme = useCallback(async (theme: "dark" | "light") => {
    setProfile((prev) => ({ ...prev, theme }));
    try {
      await updateUserTheme(theme);
    } catch (error) {
      console.error("Failed to update theme:", error);
      throw error;
    }
  }, []);

  const setAutoSaveConversations = useCallback(async (autoSave: boolean) => {
    setProfile((prev) => ({ ...prev, autoSaveConversations: autoSave }));
    try {
      await updateAutoSaveConversations(autoSave);
    } catch (error) {
      console.error("Failed to update auto-save setting:", error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    try {
      if (updates.defaultModel) {
        await updateDefaultModel(updates.defaultModel);
      }
      if (updates.theme) {
        await updateUserTheme(updates.theme);
      }
      if (updates.autoSaveConversations !== undefined) {
        await updateAutoSaveConversations(updates.autoSaveConversations);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }, []);

  const value: ProfileContextType = {
    profile,
    isProfileLoading,
    isProfileLoaded,
    updateProfile,
    setDefaultModel,
    setTheme,
    setAutoSaveConversations,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
