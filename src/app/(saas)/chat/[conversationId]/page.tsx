"use client";
import { ChatInterface } from "@/components/ChatInterface";

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return (
    <main>
      <ChatInterface conversationId={params.conversationId} />
    </main>
  );
}
