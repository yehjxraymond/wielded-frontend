import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Readable } from "stream";

export interface Message {
  role: "system" | "user" | "assistant" | "function";
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

export const useConversationMessages = (
  workspaceId: string,
  initialConversationId: string | null
) => {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId
  );
  const [isPending, setIsPending] = useState(false);

  const startConversation = async (message: string) => {
    const previousMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];

    setMessages([
      ...previousMessages,
      { role: "assistant", content: "", streaming: true },
    ]);

    setIsPending(true);

    const response = await fetch(
      `${config.baseUrl}/workspace/${workspaceId}/conversation/start`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );
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
            role: "assistant",
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
          role: "assistant",
          content: buffer,
          streaming: false,
        },
      ]);
      setIsPending(false);
    });
  };

  return { messages, conversationId, setConversationId, startConversation };
};
