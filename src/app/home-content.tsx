"use client";

import { useRouter } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useUI } from "@/lib/hooks/useUI";
import AppNavbar from "@/components/common/app-navbar";
import ChatContainer from "@/components/common/chat-container";
import PromptInput from "@/components/common/prompt-input";
import EmptyState from "@/components/common/empty-state";
import Sidebar from "@/components/common/sidebar";
import PreviewPanel from "@/components/common/preview-panel";

export default function HomeContent() {
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
  } = useChat();

  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();

  const isEmpty = messages.length === 0;

  const handleNewChat = async () => {
    router.push("/");
  };

  const handleStartChat = async (prompt: string) => {
    // Create conversation first
    const conversationId = await createConversation();
    // Generate component message in that conversation (pass the ID explicitly)
    await generateComponent(prompt, conversationId);
    // Then redirect to the conversation
    router.push(`/c/${conversationId}`);
  };

  const handleGoToConversation = (id: string) => {
    router.push(`/c/${id}`);
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
        title="Conversations"
        maxHistoryItems={10}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden min-w-0 justify-center items-center flex-col">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 flex-1">
            <EmptyState
              title="Welcome to Prompt UI"
              description="Start a new conversation by describing a UI component you want to generate"
            />
          </div>

          <div className="w-full max-w-xl px-4 pb-8">
            <PromptInput
              onSubmit={handleStartChat}
              onClear={clearMessages}
              isLoading={isLoading}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
