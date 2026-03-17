"use client";

import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  LogOut,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, Conversation } from "@/types";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const isReady = status !== "loading";

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
        flex flex-col
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

        {/* New Chat Button - Only show when logged in */}
        {session?.user?.email && (
          <div className="p-4 shrink-0">
            <Button
              onClick={onNewChat}
              className="w-full bg-[#00E87B] text-black hover:bg-[#00E87B]/90 font-medium"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}

        {/* History List - Only show when logged in */}
        {session?.user?.email && (
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
                      {"createdAt" in item && item.createdAt
                        ? new Date(item.createdAt as Date).toLocaleDateString()
                        : "Today"}
                    </p>
                    <p className="text-sm text-white truncate mt-1">
                      {item.title || "Untitled Conversation"}
                    </p>
                    {"preview" in item && item.preview && (
                      <p className="text-xs text-zinc-500 truncate mt-1">
                        {item.preview as string}
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
        )}

        {/* Empty state when not logged in */}
        {isReady && !session?.user?.email && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-sm text-zinc-400 text-center">
              Sign in to view and manage your conversations
            </p>
          </div>
        )}

        {/* Loading state */}
        {!isReady && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-sm text-zinc-400 text-center">
              Loading session...
            </p>
          </div>
        )}

        {/* Footer - Login or User Menu */}
        <div className="border-t border-zinc-800 shrink-0 overflow-visible">
          {!isReady ? (
            <div className="p-4">
              <Button disabled className="w-full opacity-50">
                Loading...
              </Button>
            </div>
          ) : !session?.user?.email ? (
            // Login Button - show when no user or no email
            <div className="p-4">
              <Link href="/login" className="w-full block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            // User Menu Dropdown
            <div className="p-4 relative overflow-visible" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
              >
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {session?.user?.name ||
                      session?.user?.email?.split("@")[0] ||
                      "User"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform shrink-0 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute left-[calc(100%-8px)] bottom-4 w-48 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg z-50">
                  {/* Settings */}
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 transition-colors border-b border-zinc-800"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  {/* Theme Toggle */}
                  {/* <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 transition-colors border-b border-zinc-800"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </button> */}

                  {/* Sign Out */}
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                    }}
                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
