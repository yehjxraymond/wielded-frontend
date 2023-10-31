"use client";
import { HeaderPublic } from "@/components/HeaderPublic";
import { SharedConversation } from "@/components/SharedConversation";

export default function ConversationPage({
  params,
}: {
  params: { sharedConversationId: string };
}) {
  return (
    <main>
      <HeaderPublic />
      <SharedConversation sharedConversationId={params.sharedConversationId} />
    </main>
  );
}
