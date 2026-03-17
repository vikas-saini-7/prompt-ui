"use client";

import { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";
import Loader from "./Loader";

interface Props {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export default function ChatContainer({ messages, isLoading = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <Loader />}
      <div ref={scrollRef} />
    </div>
  );
}
