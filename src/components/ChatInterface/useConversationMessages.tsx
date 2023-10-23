import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Readable } from "stream";

export interface MessageDto {
  id: string;
  type: "system" | "user" | "assistant" | "function";
  content: string;
  created_at: string;
}

export interface Message {
  type: "system" | "user" | "assistant" | "function";
  content: string;
  streaming?: boolean;
}

const readableStreamToStream = (readableStream: ReadableStream) => {
  const reader = readableStream.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
        return;
      }
      this.push(value);
    },
  });
  return stream;
};

const extractConversationId = (str: string) => {
  const regex = /conversation:(.+?):/;
  const match = str.match(regex);

  return match ? match[1] : null;
};

const fetchMessages = async ({
  token,
  workspaceId,
  conversationId,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
}) => {
  const response = await axios.get<MessageDto[]>(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const useConversationMessages = (
  workspaceId: string,
  initialConversationId?: string
) => {
  const conversation = useConversation();
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [isPending, setIsPending] = useState(false);

  const fetchMessagesMutation = useMutation({
    mutationFn: fetchMessages,
    mutationKey: ["conversations", token, initialConversationId],
    onSuccess: (data) => {
      setMessages(
        data.map((message) => ({
          type: message.type,
          content: message.content,
        }))
      );
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const memoisedFetch = useMemo(
    () => fetchMessagesMutation.mutate,
    [fetchMessagesMutation.mutate]
  );

  useEffect(() => {
    if (token && initialConversationId)
      memoisedFetch({
        token,
        workspaceId,
        conversationId: initialConversationId,
      });
  }, [token, memoisedFetch, workspaceId, initialConversationId]);

  const fetchAndManageResponse =
    ({
      url,
      reloadConversations,
    }: {
      url: string;
      reloadConversations?: boolean;
    }) =>
    async (message: string) => {
      const previousMessages: Message[] = [
        ...messages,
        {
          type: "user",
          content: message,
        },
      ];

      setMessages([
        ...previousMessages,
        { type: "assistant", content: "", streaming: true },
      ]);

      setIsPending(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        setError(response.statusText);
        setIsPending(false);
        return;
      }

      const stream = readableStreamToStream(response.body as ReadableStream);

      let conversationIdBuffer = "";
      let buffer = "";

      stream.on("data", (chunk: Buffer) => {
        const str = chunk.toString();
        if (!conversationIdBuffer) {
          const id = extractConversationId(str);
          if (id) {
            conversationIdBuffer = id;
            setConversationId(id);
          }
        } else {
          buffer += str;

          setMessages([
            ...previousMessages,
            {
              type: "assistant",
              content: buffer,
              streaming: true,
            },
          ]);
        }
      });

      stream.on("end", () => {
        setMessages([
          ...previousMessages,
          {
            type: "assistant",
            content: buffer,
            streaming: false,
          },
        ]);
        setIsPending(false);
        if (reloadConversations && conversation.state === "success")
          conversation.reloadConversations();
      });
    };

  const startConversation = fetchAndManageResponse({
    url: `${config.baseUrl}/workspace/${workspaceId}/conversation/start`,
    reloadConversations: true,
  });

  const continueConversation = fetchAndManageResponse({
    url: `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/continue`,
  });

  return {
    messages,
    conversationId,
    setConversationId,
    startConversation,
    continueConversation,
    isPending,
    error,
  };
};
