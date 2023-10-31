import { FunctionComponent } from "react";
import { MessageBubble } from "../ChatInterface/MessageBubble";
import { Label } from "../ui/label";
import {
  SharedConversation as SharedConversationDto,
  useSharedConversation,
} from "./useSharedConversation";
import { HomeHero } from "../Home/HomeHero";
import { Separator } from "../ui/separator";

const Loading = () => <div>Loading...</div>;

const SharedConversationContent: FunctionComponent<{
  data: SharedConversationDto;
}> = ({ data }) => {
  const { name, messages } = data;
  return (
    <div>
      <div className="mt-8 mb-10">
        <Label>Shared Conversation</Label>
        <h1 className="text-3xl">{name || "Untitled Conversation"}</h1>
      </div>
      <div className="w-full flex justify-center">
        <div className="space-y-4 max-w-4xl">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </div>
      <Separator className="mt-8 my-16"/>
      <HomeHero />
    </div>
  );
};

export const SharedConversation: FunctionComponent<{
  sharedConversationId: string;
}> = ({ sharedConversationId }) => {
  const { fetchSharedConversationMutation } =
    useSharedConversation(sharedConversationId);
  return (
    <div className="container">
      {fetchSharedConversationMutation.isPending && <Loading />}
      {fetchSharedConversationMutation.isSuccess && (
        <SharedConversationContent
          data={fetchSharedConversationMutation.data}
        />
      )}
      {/* TODO Conversation not found */}
    </div>
  );
};
