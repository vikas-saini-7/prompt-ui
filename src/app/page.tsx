"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

export default function Home() {
  const router = useRouter();
  const {
    messages,
    isLoading,
    selectedCode,
    error,
    selectedModel,
    generateComponent,
    clearMessages,
    setSelectedModel,
    createConversation,
    conversations,
    deleteConversation,
    isLoadingConversations,
  } = useChat();

  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();
  const { isProfileLoading } = useProfile();
  const toast = useToast();

  // Clear messages when navigating to home
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const isEmpty = messages.length === 0;

  const handleNewChat = async () => {
    setSidebarOpen(false);
    router.push("/");
  };

  const handleStartChat = async (prompt: string) => {
    try {
      // Extract title from prompt: first sentence or first 50 chars, whichever comes first
      const titleEndIndex = Math.min(
        prompt.search(/[.!?\n]/) > 0 ? prompt.search(/[.!?\n]/) : prompt.length,
        50,
      );
      const conversationTitle = prompt.substring(0, titleEndIndex).trim();

      // Create conversation with title from prompt
      const conversationId = await createConversation(conversationTitle);
      if (!conversationId) {
        throw new Error("Failed to create conversation - no ID returned");
      }

      // Redirect to conversation page
      router.push(`/c/${conversationId}`);

      // Generate component after a short delay to ensure page transition
      // This ensures smooth navigation and that profile is loaded on target page
      setTimeout(() => {
        generateComponent(prompt, conversationId).catch((genError) => {
          // Log generation error but don't re-throw
          // User is already on the conversation page
          const genErrorMsg =
            genError instanceof Error
              ? genError.message
              : "Failed to generate component";
          console.error("Generation error:", genErrorMsg);
          // Toast will be shown via context when error state is set
        });
      }, 100);
    } catch (error) {
      // Error creating conversation or during setup
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to create conversation";
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat", errorMsg);
    }
  };

  const handleGoToConversation = (id: string) => {
    setSidebarOpen(false);
    router.push(`/c/${id}`);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      toast.success(
        "Conversation deleted",
        "The conversation has been permanently removed.",
      );
    } catch (err) {
      toast.error(
        "Failed to delete",
        "Could not delete the conversation. Please try again.",
      );
      console.error("Error deleting conversation:", err);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] overflow-hidden">
      <AppNavbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar with Conversations */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        conversations={conversations}
        onSelectConversation={handleGoToConversation}
        onDeleteConversation={handleDeleteConversation}
        title="Conversations"
        maxHistoryItems={10}
        isLoadingConversations={isLoadingConversations}
      />

      {/* Main Content - Identical structure to conversation page */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex flex-1 overflow-hidden min-w-0 transition-all duration-300 ease-out"
          style={{
            justifyContent: isEmpty ? "center" : "flex-start",
          }}
        >
          <div
            className={`flex flex-col min-w-0 transition-all duration-300 ease-out ${
              isEmpty ? "w-full md:w-[40%]" : "w-full md:w-[40%]"
            }`}
          >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    title="Welcome to Prompt UI"
                    description="Start a new conversation by describing a UI component you want to generate"
                  />
                </div>
              ) : (
                <div className="px-3 sm:px-4 pt-4 pb-2">
                  <ChatContainer messages={messages} isLoading={isLoading} />
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

            {/* Input Area */}
            <div
              className={`bg-[#0F0F0F] px-3 sm:px-4 py-4 shrink-0 ${!isEmpty ? "border-t border-zinc-800" : ""}`}
            >
              <PromptInput
                onSubmit={handleStartChat}
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
