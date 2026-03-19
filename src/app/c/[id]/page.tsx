"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useUI } from "@/hooks/useUI";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";
import AppNavbar from "@/components/common/AppNavbar";
import ChatContainer from "@/components/common/ChatContainer";
import PromptInput from "@/components/common/PromptInput";
import EmptyState from "@/components/common/EmptyState";
import Sidebar from "@/components/common/Sidebar";
import PreviewPanel from "@/components/common/PreviewPanel";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;
  const {
    messages,
    isLoading,
    isLoadingConversation,
    selectedCode,
    error,
    selectedModel,
    generateComponent,
    clearMessages,
    setSelectedCode,
    setSelectedModel,
    currentConversation,
    conversations,
    loadConversation,
    deleteConversation,
  } = useChat();

  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();
  const { isProfileLoading } = useProfile();
  const toast = useToast();

  // Load conversation when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  const isEmpty = messages.length === 0 && !isLoadingConversation;

  // Handle errors: Show toast for generation errors, redirect for conversation not found
  useEffect(() => {
    if (error) {
      if (error.includes("not found")) {
        // Conversation not found - redirect to home
        const timer = setTimeout(() => {
          router.push("/");
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        // Generation error - show toast
        toast.error("Generation Error", error);
      }
    }
  }, [error, router, toast]);

  const handleNewChat = async () => {
    clearMessages();
    setSidebarOpen(false);
    router.push("/");
  };

  const handleGoToConversation = async (id: string) => {
    setSidebarOpen(false);
    // Let the page's useEffect handle loading when route changes
    // This prevents double-loading when router.push triggers a re-render
    router.push(`/c/${id}`);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const wasCurrentConversation = await deleteConversation(id);
      toast.success(
        "Conversation deleted",
        "The conversation has been permanently removed.",
      );
      // If deleted conversation is current, redirect to home
      if (wasCurrentConversation) {
        router.push("/");
      }
    } catch (err) {
      toast.error(
        "Failed to delete",
        "Could not delete the conversation. Please try again.",
      );
      console.error("Error deleting conversation:", err);
    }
  };

  const handleGenerateComponent = async (prompt: string) => {
    try {
      await generateComponent(prompt, conversationId);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to generate component";
      console.error("Error generating component:", errMsg);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] overflow-hidden">
      <AppNavbar onToggleSidebar={toggleSidebar} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        conversations={conversations}
        onSelectConversation={handleGoToConversation}
        onDeleteConversation={handleDeleteConversation}
        title="Conversations"
        maxHistoryItems={10}
        currentConversationId={conversationId}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex flex-1 overflow-hidden min-w-0 transition-all duration-300 ease-out ${
            isEmpty ? "justify-center" : ""
          }`}
        >
          <div
            className={`w-full md:w-[40%] flex flex-col min-w-0 transition-all duration-300 ease-out ${
              !isEmpty ? "border-r border-zinc-800" : ""
            }`}
          >
            <div className="flex-1 overflow-y-auto min-h-0">
              {isEmpty ? (
                <EmptyState
                  title="Start Chatting"
                  description="Describe a UI component and watch it come to life"
                />
              ) : (
                <div className="px-3 sm:px-4 pt-4 pb-2">
                  <ChatContainer
                    messages={messages}
                    isLoading={isLoading}
                    isLoadingConversation={isLoadingConversation}
                    onPreview={setSelectedCode}
                  />
                </div>
              )}

              {error && (
                <div className="px-3 sm:px-4 py-2">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`bg-[#0F0F0F] px-3 sm:px-4 py-4 shrink-0 ${!isEmpty ? "border-t border-zinc-800" : ""}`}
            >
              <PromptInput
                onSubmit={handleGenerateComponent}
                isLoading={isLoading}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                isProfileLoading={isProfileLoading}
              />
            </div>
          </div>

          {!isEmpty && (
            <div className="hidden md:flex w-[60%] border-l border-zinc-800 flex-col bg-zinc-950 min-w-0 transition-all duration-300">
              <PreviewPanel code={selectedCode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
