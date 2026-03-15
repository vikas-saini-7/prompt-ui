"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  messages: ChatMessage[];
}

export default function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  messages,
}: Props) {
  // Group messages by conversation (for history)
  const conversationCount = Math.ceil(messages.length / 2); // Rough estimate

  return (
    <>
      {/* Overlay - Covers full viewport */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Fixed to viewport, appears over header */}
      <aside
        className={`
        fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 
        transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col overflow-hidden
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <h2 className="font-semibold text-white text-sm">History</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 flex-shrink-0">
          <Button
            onClick={onNewChat}
            className="w-full bg-[#00E87B] text-black hover:bg-[#00E87B]/90 font-medium"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 min-h-0">
          {messages.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">
              No chat history yet
            </p>
          ) : (
            // Show last user message from each conversation
            Array.from({ length: Math.min(5, conversationCount) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-colors text-left"
                >
                  <p className="text-xs text-zinc-400 truncate">
                    Conversation {conversationCount - i}
                  </p>
                  <p className="text-sm text-white truncate mt-1">
                    {messages[messages.length - (i * 2 + 1)]?.content ||
                      "Click to view"}
                  </p>
                </div>
              ),
            )
          )}
        </div>
      </aside>
    </>
  );
}
