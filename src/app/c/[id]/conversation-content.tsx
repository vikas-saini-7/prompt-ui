"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useUI } from "@/lib/hooks/useUI";
import AppNavbar from "@/components/common/app-navbar";
import ChatContainer from "@/components/common/chat-container";
import PromptInput from "@/components/common/prompt-input";
import EmptyState from "@/components/common/empty-state";
import Sidebar from "@/components/common/sidebar";
import PreviewPanel from "@/components/common/preview-panel";

interface Props {
  conversationId: string;
}

export default function ConversationContent({ conversationId }: Props) {
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
    currentConversation,
    conversations,
    loadConversation,
    deleteConversation,
  } = useChat();

  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();

  // Load conversation when conversation ID changes
  useEffect(() => {
    loadConversation(conversationId);
  }, [conversationId, loadConversation]);

  const isEmpty = messages.length === 0;

  const handleNewChat = async () => {
    clearMessages();
    setSidebarOpen(false);
    router.push("/");
  };

  const handleGoToConversation = (id: string) => {
    loadConversation(id);
    setSidebarOpen(false);
    router.push(`/c/${id}`);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    // If deleted conversation is current, redirect to home
    if (id === conversationId) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] overflow-hidden">
      <AppNavbar
        onToggleSidebar={toggleSidebar}
        title={currentConversation?.title || "Prompt UI"}
        subtitle="AI Component Generator"
      />

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
          className={`flex flex-1 overflow-hidden min-w-0 ${isEmpty ? "justify-center" : ""}`}
        >
          <div
            className={`w-full md:w-[40%] flex flex-col min-w-0 ${!isEmpty ? "border-r border-zinc-800" : ""}`}
          >
            <div className="flex-1 overflow-y-auto min-h-0">
              {isEmpty ? (
                <EmptyState
                  title="Start Chatting"
                  description="Describe a UI component and watch it come to life"
                />
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

            <div
              className={`bg-[#0F0F0F] px-3 sm:px-4 py-4 shrink-0 ${!isEmpty ? "border-t border-zinc-800" : ""}`}
            >
              <PromptInput
                onSubmit={generateComponent}
                onClear={() => setSelectedCode(undefined)}
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
