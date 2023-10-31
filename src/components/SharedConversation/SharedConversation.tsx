import { FunctionComponent } from "react";
import {
  useSharedConversation,
  SharedConversation as SharedConversationDto,
} from "./useSharedConversation";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { MessageBubble } from "../ChatInterface/MessageBubble";

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
      <div className="space-y-4 w-full">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>
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
    </div>
  );
};
