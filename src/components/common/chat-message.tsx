"use client";

import { ChatMessage as ChatMessageType } from "@/types";
import { Bot } from "lucide-react";
import CodeBlock from "./code-block";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} min-w-0`}
    >
      <div className={`flex gap-3 max-w-2xl min-w-0 ${isUser ? "pl-12" : ""}`}>
        {!isUser && (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900">
            <Bot className="h-4 w-4 text-[#00E87B]" />
          </div>
        )}

        <div className={`flex flex-col gap-2 min-w-0`}>
          {isUser ? (
            <div className="rounded-lg bg-[#00E87B] px-4 py-2 w-fit">
              <p className="text-sm text-black">{message.content}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-300">{message.content}</p>
              {message.code && <CodeBlock code={message.code} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
