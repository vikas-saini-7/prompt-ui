"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { ChatMessage, Conversation } from "@/types";
import {
  createConversation as createConversationAction,
  deleteConversation as deleteConversationAction,
  getConversations,
} from "@/actions/conversation.actions";
import {
  saveMessage,
  getMessages,
  saveGeneratedComponent,
} from "@/actions/message.actions";
import {
  streamCodeGeneration,
  formatStreamedCode,
} from "@/lib/streaming-utils";
import { useProfile } from "@/hooks/useProfile";

interface ChatContextType {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingConversation: boolean;
  selectedCode?: string;
  error?: string;
  selectedModel: string;
  conversations: Conversation[];
  currentConversation?: Conversation;

  // Actions
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedCode: (code?: string) => void;
  setError: (error?: string) => void;
  setSelectedModel: (model: string) => void;
  setConversationTitle: (title: string) => void;

  // Conversation Management
  createConversation: (title?: string) => Promise<string>;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<boolean>;

  // Advanced
  generateComponent: (prompt: string, conversationId?: string) => Promise<void>;
  saveConversation: () => Promise<string | null>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

interface ChatProviderProps {
  children: ReactNode;
  initialConversationId?: string;
}

export function ChatProvider({
  children,
  initialConversationId,
}: ChatProviderProps) {
  const { profile, setDefaultModel } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | undefined
  >(initialConversationId);

  // Wrapper function to save model changes to database
  const handleModelChange = useCallback(
    async (modelId: string) => {
      try {
        await setDefaultModel(modelId);
      } catch (error) {
        console.error("Failed to save model preference:", error);
      }
    },
    [setDefaultModel],
  );

  // Get current conversation
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId,
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...newMessages]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSelectedCode(undefined);
    setError(undefined);
  }, []);

  const setConversationTitle = useCallback(
    (title: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId ? { ...conv, title } : conv,
        ),
      );
    },
    [currentConversationId],
  );

  const createConversation = useCallback(
    async (title?: string): Promise<string> => {
      try {
        // Create conversation in database via server action
        const conversationId = await createConversationAction(
          title || "New Conversation",
        );

        // Add to local state
        const newConversation: Conversation = {
          id: conversationId,
          title: title || "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(conversationId);

        return conversationId;
      } catch (err) {
        console.error("Error creating conversation:", err);
        throw err;
      }
    },
    [],
  );

  const loadConversation = useCallback(async (id: string) => {
    try {
      setIsLoadingConversation(true);
      setCurrentConversationId(id);
      setError(undefined);

      // Fetch messages from database
      // This also validates that the conversation exists and belongs to the user
      const dbMessages = await getMessages(id);

      // Convert DB messages to ChatMessage format
      const chatMessages: ChatMessage[] = dbMessages.map((msg) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        code: msg.code,
        timestamp: new Date(msg.createdAt),
      }));

      setMessages(chatMessages);

      // Find the last AI message with code and set it as preview
      const lastCodeMessage = chatMessages.findLast(
        (msg) => msg.type === "ai" && msg.code,
      );
      setSelectedCode(lastCodeMessage?.code);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error loading conversation messages:", errorMessage);

      // Set specific error messages based on error type
      let displayError = "Failed to load conversation";
      if (errorMessage.includes("USER_NOT_AUTHENTICATED")) {
        displayError = "Your session has expired. Please login again.";
      } else if (errorMessage.includes("CONVERSATION_NOT_FOUND")) {
        displayError = "Conversation not found or you don't have access to it.";
      }

      setError(displayError);
      setMessages([]);
      setSelectedCode(undefined);
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        // Delete from database via server action
        await deleteConversationAction(id);

        // Check if this is the current conversation
        const isCurrentConversation = currentConversationId === id;

        // Delete from local state
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (isCurrentConversation) {
          setCurrentConversationId(undefined);
          setMessages([]);
          setSelectedCode(undefined);
        }

        return isCurrentConversation;
      } catch (err) {
        console.error("Error deleting conversation:", err);
        throw err;
      }
    },
    [currentConversationId],
  );

  const generateComponent = useCallback(
    async (prompt: string, conversationId?: string) => {
      try {
        setError(undefined);
        setIsLoading(true);

        // Validate profile is available before proceeding
        if (!profile || !profile.defaultModel) {
          throw new Error(
            "Profile or default model not loaded. Please refresh and try again.",
          );
        }

        // Determine target conversation ID
        let targetConvId = conversationId || currentConversationId;

        // Create conversation if none exists
        if (!targetConvId) {
          try {
            targetConvId = await createConversation();
            if (!targetConvId) {
              throw new Error("Failed to create conversation - no ID returned");
            }
          } catch (createError) {
            const errorMsg =
              createError instanceof Error
                ? createError.message
                : "Failed to create conversation";
            setError(errorMsg);
            throw createError;
          }
        }

        // Ensure current conversation is set to target
        if (targetConvId !== currentConversationId) {
          setCurrentConversationId(targetConvId);
        }

        // Create user message object
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "user",
          content: prompt,
          timestamp: new Date(),
        };

        // Save user message to database
        let userMessageId: string;
        try {
          userMessageId = await saveMessage(targetConvId, "user", prompt);
          if (!userMessageId) {
            throw new Error("Failed to save user message - no ID returned");
          }
        } catch (saveError) {
          const errorMsg =
            saveError instanceof Error
              ? saveError.message
              : "Failed to save user message";
          setError(errorMsg);
          throw saveError;
        }

        // Update message ID with DB ID
        userMessage.id = userMessageId;

        // Add user message to UI
        addMessage(userMessage);

        // Stream code generation
        let generatedCode = "";
        const generatedDescription =
          "Component generated using AI. Copy the code and customize as needed.";

        try {
          generatedCode = await streamCodeGeneration(
            prompt,
            profile.defaultModel,
            {
              onChunk: (chunk) => {
                // Accumulate and update preview with generated code
                generatedCode += chunk;
                const formattedCode = formatStreamedCode(generatedCode);
                setSelectedCode(formattedCode);
              },
              onStart: () => {
                // Generation started, loader will show
              },
              onComplete: () => {
                // Message will be added after this callback
              },
              onError: (errorMsg) => {
                throw new Error(errorMsg);
              },
            },
          );
        } catch (streamError) {
          const errorMsg =
            streamError instanceof Error
              ? streamError.message
              : "Failed to generate code";
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        // Format final code
        const finalCode = formatStreamedCode(generatedCode);

        // Save the generated component message
        let aiMessageId: string;
        try {
          aiMessageId = await saveMessage(
            targetConvId,
            "ai",
            generatedDescription,
            {
              code: finalCode,
              codeLanguage: "jsx",
            },
          );
          if (!aiMessageId) {
            throw new Error("Failed to save AI message - no ID returned");
          }
        } catch (saveError) {
          const errorMsg =
            saveError instanceof Error
              ? saveError.message
              : "Failed to save generated message";
          setError(errorMsg);
          throw saveError;
        }

        // Add AI message with final code to UI
        const finalAiMessage: ChatMessage = {
          id: aiMessageId,
          type: "ai",
          content: generatedDescription,
          code: finalCode,
          timestamp: new Date(),
        };
        addMessage(finalAiMessage);

        // Save generated component to database
        try {
          await saveGeneratedComponent(targetConvId, aiMessageId, {
            prompt,
            code: finalCode,
            description: generatedDescription,
            aiModel: profile.defaultModel,
            language: "jsx",
            framework: "react",
            tags: ["generated"],
          });
        } catch (componentError) {
          // Log but don't fail - component metadata saving is not critical
          console.error("Failed to save component metadata:", componentError);
        }

        // Set final preview code
        setSelectedCode(finalCode);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to generate component";
        setError(errorMsg);
        console.error("Generation error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [profile, currentConversationId, createConversation, addMessage],
  );

  const saveConversation = useCallback(async (): Promise<string | null> => {
    try {
      if (!currentConversationId) return null;
      // Conversation already auto-saves when messages are added
      return currentConversationId;
    } catch (err) {
      console.error("Failed to save conversation:", err);
      return null;
    }
  }, [currentConversationId]);

  // Load initial conversation if provided
  useEffect(() => {
    if (initialConversationId) {
      loadConversation(initialConversationId);
    }
  }, [initialConversationId, loadConversation]);

  // Load user conversations on mount
  useEffect(() => {
    const loadUserConversations = async () => {
      try {
        const userConversations = await getConversations();
        const mappedConversations: Conversation[] = userConversations.map(
          (conv) => ({
            id: conv.id,
            title: conv.title,
            messages: [],
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          }),
        );
        setConversations(mappedConversations);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    loadUserConversations();
  }, []);

  const value: ChatContextType = {
    messages,
    isLoading,
    isLoadingConversation,
    selectedCode,
    error,
    selectedModel: profile.defaultModel,
    conversations,
    currentConversation,
    addMessage,
    addMessages,
    clearMessages,
    setLoading: setIsLoading,
    setSelectedCode,
    setError,
    setSelectedModel: handleModelChange,
    setConversationTitle,
    createConversation,
    loadConversation,
    deleteConversation,
    generateComponent,
    saveConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
