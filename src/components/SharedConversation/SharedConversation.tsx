"use client";
import { FunctionComponent } from "react";
import { MessageBubble } from "../ChatInterface/MessageBubble";
import { HomeHero } from "../Home/HomeHero";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export interface SharedMessage {
  id: string;
  type: "user" | "system" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedConversationDto {
  id: string;
  name?: string;
  shareSystemMessages?: boolean;
  createdAt: string;
  updatedAt: string;
  messages: SharedMessage[];
}

export const SharedConversation: FunctionComponent<{
  data: SharedConversationDto;
}> = ({ data }) => {
  const { name, messages } = data;
  return (
    <div className="container">
      <div className="mt-8 mb-10">
        <Label>Shared Conversation</Label>
        <h1 className="text-3xl">{name || "Untitled Conversation"}</h1>
      </div>
      <div className="w-full flex justify-center">
        <div className="space-y-4 max-w-4xl w-full">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </div>
      <Separator className="mt-8 my-16" />
      <HomeHero />
    </div>
  );
};
