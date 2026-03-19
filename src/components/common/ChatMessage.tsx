"use client";

import { ChatMessage as ChatMessageType } from "@/types";
import { Bot, AlertCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface Props {
  message: ChatMessageType;
  onPreview?: (code: string) => void;
}

export default function ChatMessage({ message, onPreview }: Props) {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} min-w-0`}
    >
      <div className={`flex gap-3 max-w-2xl min-w-0 ${isUser ? "pl-12" : ""}`}>
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
            <Bot className="h-4 w-4 text-[#00E87B]" />
          </div>
        )}

        <div className={`flex flex-col gap-2 min-w-0`}>
          {isUser ? (
            <>
              <div className="rounded-lg bg-[#00E87B] px-4 py-2 w-fit">
                <p className="text-sm text-black">{message.content}</p>
              </div>

              {message.isSaving && (
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse"></div>
                  Saving...
                </div>
              )}

              {message.error && (
                <div className="bg-red-900/20 border border-red-800 rounded px-2 py-1 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{message.error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-300">{message.content}</p>
              {message.code && (
                <CodeBlock
                  code={message.code}
                  language="typescript"
                  onPreview={onPreview}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
