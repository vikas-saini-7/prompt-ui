"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { ChatMessage, Conversation } from "@/types";
import { apiService } from "@/lib/api/api-service";

interface ChatContextType {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
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
  createConversation: () => Promise<string>;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

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

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function ChatProvider({
  children,
  initialConversationId,
}: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | undefined
  >(initialConversationId);

  // Get current conversation
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId,
  );

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);

      // Update current conversation messages
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...(conv.messages || []), message],
                updatedAt: new Date(),
              }
            : conv,
        ),
      );
    },
    [currentConversationId],
  );

  const addMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      setMessages((prev) => [...prev, ...newMessages]);

      // Update current conversation messages
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...(conv.messages || []), ...newMessages],
                updatedAt: new Date(),
              }
            : conv,
        ),
      );
    },
    [currentConversationId],
  );

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

  const createConversation = useCallback(async (): Promise<string> => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newId);

    return newId;
  }, []);

  const loadConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((c) => c.id === id);
      if (conversation) {
        setCurrentConversationId(id);
        const msgs = conversation.messages || [];
        setMessages(msgs);

        // Find the last AI message with code and set it as preview
        const lastCodeMessage = msgs.findLast(
          (msg) => msg.type === "ai" && msg.code,
        );
        setSelectedCode(lastCodeMessage?.code);

        setError(undefined);
      }
    },
    [conversations],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(undefined);
        setMessages([]);
        setSelectedCode(undefined);
      }
    },
    [currentConversationId],
  );

  const generateComponent = useCallback(
    async (prompt: string, conversationId?: string) => {
      try {
        setError(undefined);
        setIsLoading(true);

        // Determine target conversation ID
        let targetConvId = conversationId || currentConversationId;

        // Create conversation if none exists
        if (!targetConvId) {
          const newId = await createConversation();
          targetConvId = newId;
        }

        // Ensure current conversation is set to target
        if (targetConvId !== currentConversationId) {
          setCurrentConversationId(targetConvId);
        }

        // Create messages
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "user",
          content: prompt,
          timestamp: new Date(),
        };

        // Add messages directly to state with the correct conversation ID
        setMessages((prev) => [...prev, userMessage]);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId
              ? {
                  ...conv,
                  messages: [...(conv.messages || []), userMessage],
                  updatedAt: new Date(),
                }
              : conv,
          ),
        );

        // Call API
        const response = await apiService.generateComponent(
          prompt,
          selectedModel,
        );

        // Create AI message
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: response.description || "Component generated successfully",
          code: response.code,
          timestamp: new Date(),
        };

        // Add AI message
        setMessages((prev) => [...prev, aiMessage]);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId
              ? {
                  ...conv,
                  messages: [...(conv.messages || []), aiMessage],
                  updatedAt: new Date(),
                }
              : conv,
          ),
        );

        setSelectedCode(response.code);

        // Update title if this is the first message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId && (conv.messages?.length || 0) <= 2
              ? {
                  ...conv,
                  title:
                    prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
                }
              : conv,
          ),
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to generate component";
        setError(errorMsg);
        console.error("Generation error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedModel, currentConversationId, createConversation],
  );

  const saveConversation = useCallback(async (): Promise<string | null> => {
    try {
      if (!currentConversationId) return null;
      const id = await apiService.saveConversation(messages);
      return id;
    } catch (err) {
      console.error("Failed to save conversation:", err);
      return null;
    }
  }, [messages, currentConversationId]);

  // Load initial conversation if provided
  useEffect(() => {
    if (initialConversationId) {
      loadConversation(initialConversationId);
    }
  }, [initialConversationId, loadConversation]);

  const value: ChatContextType = {
    messages,
    isLoading,
    selectedCode,
    error,
    selectedModel,
    conversations,
    currentConversation,
    addMessage,
    addMessages,
    clearMessages,
    setLoading: setIsLoading,
    setSelectedCode,
    setError,
    setSelectedModel,
    setConversationTitle,
    createConversation,
    loadConversation,
    deleteConversation,
    generateComponent,
    saveConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
