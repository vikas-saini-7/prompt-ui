"use client";

import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useUI } from "@/hooks/useUI";
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
    setSelectedCode,
    setSelectedModel,
    createConversation,
    conversations,
    deleteConversation,
  } = useChat();

  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();

  const isEmpty = messages.length === 0;

  const handleNewChat = async () => {
    router.push("/");
  };

  const handleStartChat = async (prompt: string) => {
    // Create conversation first (adds to state immediately)
    const conversationId = await createConversation();
    // Redirect immediately (before API call) - this makes navigation instant
    router.push(`/c/${conversationId}`);
    // Generate component in background (will add messages to existing conversation)
    generateComponent(prompt, conversationId);
  };

  const handleGoToConversation = (id: string) => {
    setSidebarOpen(false);
    router.push(`/c/${id}`);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
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
                onClear={clearMessages}
                isLoading={isLoading}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
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
