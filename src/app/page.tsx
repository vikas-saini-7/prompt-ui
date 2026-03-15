"use client";

import { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import AppNavbar from "@/components/common/app-navbar";
import ChatContainer from "@/components/common/chat-container";
import PromptInput from "@/components/common/prompt-input";
import EmptyState from "@/components/common/empty-state";
import Sidebar from "@/components/common/sidebar";
import PreviewPanel from "@/components/common/preview-panel";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | undefined>(
    undefined,
  );

  const handleGenerateComponent = async (prompt: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockCode = `import React from 'react';
import { Zap } from 'lucide-react';

export default function Component() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00E87B]">
            <Zap className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Generated Component
          </h2>
        </div>
        <p className="text-zinc-400 mb-6">
          This component was generated from your prompt. You can copy the code and customize it as needed.
        </p>
        <button className="bg-[#00E87B] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#00E87B]/90 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}`;

      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I've generated a component based on your description. You can copy the code, customize it, or ask for modifications.",
        code: mockCode,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSelectedCode(mockCode);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setSelectedCode(undefined);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedCode(undefined);
    setSidebarOpen(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] overflow-hidden">
      <AppNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar - Fixed overlay */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        messages={messages}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat and Preview Container */}
        <div
          className={`flex flex-1 overflow-hidden min-w-0 ${isEmpty ? "justify-center" : ""}`}
        >
          {/* Chat Section - Takes 40% on desktop, full on mobile */}
          <div
            className={`w-full md:w-[40%] flex flex-col min-w-0 ${!isEmpty ? "border-r border-zinc-800" : ""}`}
          >
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isEmpty ? (
                <EmptyState />
              ) : (
                <div className="px-3 sm:px-4 pt-4 pb-2">
                  <ChatContainer messages={messages} isLoading={isLoading} />
                </div>
              )}
            </div>

            {/* Input Container */}
            <div
              className={`bg-[#0F0F0F] px-3 sm:px-4 py-4 flex-shrink-0 ${!isEmpty ? "border-t border-zinc-800" : ""}`}
            >
              <PromptInput
                onSubmit={handleGenerateComponent}
                onClear={handleClearChat}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Preview Section - Only visible on desktop when conversation has started */}
          {!isEmpty && (
            <div className="hidden md:flex w-[60%] border-l border-zinc-800 flex-col bg-zinc-950 min-w-0 transition-all duration-300">
              <PreviewPanel code={selectedCode} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
