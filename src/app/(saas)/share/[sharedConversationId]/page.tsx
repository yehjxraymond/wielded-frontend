import { HeaderPublic } from "@/components/HeaderPublic";
import {
  SharedConversation,
  SharedConversationDto,
} from "@/components/SharedConversation";
import { config } from "@/config";
import { Metadata } from "next";

const getSharedConversationData = async (sharedConversationId: string) => {
  const res = await fetch(`${config.baseUrl}/share/${sharedConversationId}`, {
    next: { revalidate: 5000 },
  });
  return res.json() as Promise<SharedConversationDto>;
};

export async function generateMetadata({
  params: { sharedConversationId },
}: {
  params: { sharedConversationId: string };
}): Promise<Metadata> {
  const data = await getSharedConversationData(sharedConversationId);
  let description =
    data.messages.filter((m) => m.type !== "system")[0]?.content || "";

  // Ensure that the description is less than or equal to 200 characters
  if (description.length > 200) {
    description = description.substring(0, 200) + "...";
  }

  return {
    title: data.name || "Untitled Conversation",
    description,
  };
}

export default async function ConversationPage({
  params: { sharedConversationId },
}: {
  params: { sharedConversationId: string };
}) {
  const data = await getSharedConversationData(sharedConversationId);
  return (
    <main>
      <HeaderPublic />
      <SharedConversation data={data} />
    </main>
  );
}
