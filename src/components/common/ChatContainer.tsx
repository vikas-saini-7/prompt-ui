"use client";

import { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";
import Loader from "./Loader";
import SkeletonLoader from "./SkeletonLoader";

interface Props {
  messages: ChatMessageType[];
  isLoading?: boolean;
  isLoadingConversation?: boolean;
  onPreview?: (code: string) => void;
}

export default function ChatContainer({
  messages,
  isLoading = false,
  isLoadingConversation = false,
  onPreview,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    // Scroll to bottom only when messages change, not when loading state changes
    const scrollAndReset = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Use requestAnimationFrame to batch scroll at optimal time
    requestAnimationFrame(scrollAndReset);
  }, [messages.length]);

  // Show skeleton when loading conversation (including when switching between conversations)
  if (isLoadingConversation) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onPreview={onPreview} />
      ))}
      {isLoading && <Loader />}
      <div ref={scrollRef} />
    </div>
  );
}
