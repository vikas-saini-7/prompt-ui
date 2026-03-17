"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, Conversation } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  messages?: ChatMessage[];
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  title?: string;
  maxHistoryItems?: number;
  currentConversationId?: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  messages = [],
  conversations = [],
  onSelectConversation,
  onDeleteConversation,
  title = "History",
  maxHistoryItems = 10,
  currentConversationId,
}: Props) {
  // Use conversations if provided, otherwise group messages
  const items =
    conversations.length > 0
      ? conversations.slice(0, maxHistoryItems)
      : messages.length > 0
        ? Array.from({
            length: Math.min(maxHistoryItems, Math.ceil(messages.length / 2)),
          }).map((_, i) => ({
            id: `conv-${i}`,
            title: `Conversation ${Math.ceil(messages.length / 2) - i}`,
            preview:
              messages[messages.length - (i * 2 + 1)]?.content ||
              "Click to view",
          }))
        : [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 
        transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col overflow-hidden
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
          <h2 className="font-semibold text-white text-sm">{title}</h2>
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
        <div className="p-4 shrink-0">
          <Button
            onClick={onNewChat}
            className="w-full bg-[#00E87B] text-black hover:bg-[#00E87B]/90 font-medium"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 min-h-0">
          {items.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">
              No conversations yet
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`group relative p-3 rounded-lg transition-colors text-left ${
                  currentConversationId === item.id
                    ? "bg-[#00E87B]/10 border border-[#00E87B]"
                    : "bg-zinc-900 hover:bg-zinc-800 border border-transparent"
                }`}
              >
                <button
                  onClick={() => onSelectConversation?.(item.id)}
                  className="w-full text-left"
                >
                  <p className="text-xs text-zinc-400 truncate">
                    {(item as any).createdAt
                      ? new Date((item as any).createdAt).toLocaleDateString()
                      : "Today"}
                  </p>
                  <p className="text-sm text-white truncate mt-1">
                    {item.title || "Untitled Conversation"}
                  </p>
                  {(item as any).preview && (
                    <p className="text-xs text-zinc-500 truncate mt-1">
                      {(item as any).preview}
                    </p>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation?.(item.id);
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/30 rounded"
                  title="Delete conversation"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
