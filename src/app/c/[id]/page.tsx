"use client";

import { useParams } from "next/navigation";
import ConversationContent from "./conversation-content";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;

  return <ConversationContent conversationId={conversationId} />;
}
