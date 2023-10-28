import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
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

type Model =
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"
  | "gpt-4-32k-0613"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k-0613";

export interface ConversationPayload {
  message: string;
  persona?: string;
  options?: {
    model?: Model;
    frequency_penalty?: number; // Positive values decreasing the model's likelihood to repeat the same line verbatim.
    max_tokens?: number;
    presence_penalty?: number; // Number between -2.0 and 2.0. Positive values increasing the model's likelihood to talk about new topics
    temperature?: number; // between 0 and 2. Higher values like 0.8 will make the output more random. Set this or top_p
    top_p?: number; // 0.1 means only the tokens comprising the top 10% probability mass
  };
}

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
  const { replace } = useRouter();

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
    async ({ message, persona }: ConversationPayload) => {
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
        body: JSON.stringify({ message, persona }),
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
        replace(`/chat/${conversationIdBuffer}`);
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
