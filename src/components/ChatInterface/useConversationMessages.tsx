import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";

export interface MessageDto {
  id: string;
  type: "system" | "user" | "assistant" | "function";
  fileName?: string;
  content: string;
  created_at: string;
}

export interface ConversationDto {
  id: string;
  name: string;
  chatCompletionOption: object;
  visibility: "private" | "workspace" | "invited" | "public";
  created_at: string;
  updated_at: string;
}

export interface Message {
  type:
    | "system"
    | "user"
    | "assistant"
    | "function"
    | "file_upload"
    | "file_upload_system";
  content: string;
  fileName?: string;
  streaming?: boolean;
}

const processReadableStream = (
  readableStream: ReadableStream<Uint8Array>,
  onData: (chunk: string) => void,
  onEnd: () => void
) => {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder();

  reader.read().then(function processData({ done, value }) {
    if (done) {
      onEnd();
      return;
    }
    const chunk = decoder.decode(value, { stream: true });
    onData(chunk);
    reader.read().then(processData);
  });
};

const extractConversationId = (str: string) => {
  const regex = /conversation:(.+?):/;
  const match = str.match(regex);

  return match ? match[1] : null;
};

type Model =
  | "gpt-4-1106-preview" // Turbo preview
  | "gpt-4-vision-preview"
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
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-16k-0613";

export interface ChatCompletionOptions {
  model?: Model;
  frequency_penalty?: number; // Positive values decreasing the model's likelihood to repeat the same line verbatim.
  max_tokens?: number;
  presence_penalty?: number; // Number between -2.0 and 2.0. Positive values increasing the model's likelihood to talk about new topics
  temperature?: number; // between 0 and 2. Higher values like 0.8 will make the output more random. Set this or top_p
  top_p?: number; // 0.1 means only the tokens comprising the top 10% probability mass
}

export interface ConversationPayload {
  message: string;
  personaId?: string;
  files?: {
    name: string;
    content: string;
  }[];
  options?: ChatCompletionOptions;
}

export const DEFAULT_GPT3_MODEL = "gpt-3.5-turbo-1106";
export const DEFAULT_GPT4_MODEL = "gpt-4-1106-preview";

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

const fetchConversation = async ({
  token,
  workspaceId,
  conversationId,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
}) => {
  const response = await axios.get<ConversationDto>(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

interface ApiError {
  error?: string;
  message?: string;
  statusCode?: number | string;
}

// Debouncing updates to the UI to prevent crashing the browser
const useDebouncedUpdate = (updateFrequency = 100, maxLength = 250) => {
  const updateTimer = useRef<NodeJS.Timeout | null>(null);
  const updateMessages = useRef<(messages: Message[]) => void>(() => {});
  const lastBufferLength = useRef(0);

  const setUpdateMessages = useCallback(
    (callback: (messages: Message[]) => void) => {
      updateMessages.current = callback;
    },
    []
  );

  const debounceUpdate = useCallback(
    (newMessages: Message[]) => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }

      updateTimer.current = setTimeout(() => {
        lastBufferLength.current =
          newMessages[newMessages.length - 1].content.length;
        updateMessages.current(newMessages);
      }, updateFrequency);

      if (
        newMessages[newMessages.length - 1].content.length -
          lastBufferLength.current >=
        maxLength
      ) {
        clearTimeout(updateTimer.current); // reset the timer
        updateMessages.current(newMessages);
        lastBufferLength.current =
          newMessages[newMessages.length - 1].content.length;
      }
    },
    [updateFrequency, maxLength]
  );

  return { debounceUpdate, setUpdateMessages };
};

export const useConversationMessages = (
  workspaceId: string,
  initialConversationId?: string
) => {
  const conversation = useConversation();
  const { token } = useAuth();
  const [error, setError] = useState<ApiError | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [isPending, setIsPending] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string>("");
  const [chatCompletionOptions, setChatCompletionOptions] =
    useState<ChatCompletionOptions>({ model: DEFAULT_GPT4_MODEL });
  const { replace } = useRouter();
  const { debounceUpdate, setUpdateMessages } = useDebouncedUpdate(100, 250);

  useEffect(() => {
    setUpdateMessages((newMessages) => {
      setMessages(newMessages);
    });
  }, [setUpdateMessages]);

  const fetchConversationMutation = useMutation({
    mutationFn: fetchConversation,
    mutationKey: ["conversations", token, initialConversationId],
    onSuccess: (data) => {
      setChatCompletionOptions(data.chatCompletionOption);
      setConversationTitle(data.name);
    },
  });

  const fetchMessagesMutation = useMutation({
    mutationFn: fetchMessages,
    mutationKey: ["conversations", token, initialConversationId],
    onSuccess: (data) => {
      setMessages(
        data.map((message) => ({
          type: message.type,
          content: message.content,
          fileName: message.fileName,
        }))
      );
    },
    onError: (error) => {
      setError(error);
    },
  });

  const memoisedFetchMessage = useMemo(
    () => fetchMessagesMutation.mutate,
    [fetchMessagesMutation.mutate]
  );

  const memoisedFetchConversation = useMemo(
    () => fetchConversationMutation.mutate,
    [fetchConversationMutation.mutate]
  );

  useEffect(() => {
    if (token && initialConversationId) {
      memoisedFetchMessage({
        token,
        workspaceId,
        conversationId: initialConversationId,
      });
      memoisedFetchConversation({
        token,
        workspaceId,
        conversationId: initialConversationId,
      });
    }
  }, [
    token,
    memoisedFetchMessage,
    memoisedFetchConversation,
    workspaceId,
    initialConversationId,
  ]);

  const fetchAndManageResponse =
    ({
      url,
      reloadConversations,
    }: {
      url: string;
      reloadConversations?: boolean;
    }) =>
    async ({ message, personaId, files }: ConversationPayload) => {
      const previousMessages: Message[] = [...messages];
      if ((!files || files.length === 0) && message.length === 0) {
        setError({
          error: "Message cannot be empty",
          message: "Type a message or upload a file",
        });
        setIsPending(false);
        return;
      }
      if (files)
        files.forEach((file) => {
          previousMessages.push({
            type: "file_upload",
            fileName: file.name,
            content: `File uploaded: ${file.content}`,
          });
        });
      if (message && message.length > 0)
        previousMessages.push({
          type: "user",
          content: message,
        });

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
        body: JSON.stringify({
          files,
          message,
          personaId,
          options: chatCompletionOptions,
        }),
      });
      if (!response.ok) {
        const error: ApiError = await response.json();
        setError(error);
        setIsPending(false);
        setMessages((messages) => {
          const messagesWithoutStream = messages.map((message) => {
            if (message.streaming) {
              message.streaming = false;
            }
            return message;
          });
          return messagesWithoutStream.filter(
            (message) => message.content !== ""
          );
        });
        return;
      }

      let conversationIdBuffer = "";
      let buffer = "";

      processReadableStream(
        response.body as ReadableStream<Uint8Array>,
        (chunk: string) => {
          const str = chunk.toString();
          if (!conversationIdBuffer) {
            const id = extractConversationId(str);
            if (id) {
              conversationIdBuffer = id;
              setConversationId(id);
            }
          } else {
            buffer += str;
            // Use debounceUpdate instead of setMessages to update the UI
            debounceUpdate([
              ...previousMessages,
              {
                type: "assistant",
                content: buffer,
                streaming: true,
              },
            ]);
          }
        },
        () => {
          setMessages([
            ...previousMessages,
            {
              type: "assistant",
              content: buffer,
              streaming: false,
            },
          ]);
          setIsPending(false);
          setError(null);
          if (reloadConversations && conversation.state === "success")
            conversation.reloadConversations();
          replace(`/chat/${conversationIdBuffer}`);
        }
      );
    };

  const startConversation = fetchAndManageResponse({
    url: `${config.baseUrl}/workspace/${workspaceId}/conversation/start`,
    reloadConversations: true,
  });

  const continueConversation = fetchAndManageResponse({
    url: `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/continue`,
  });

  return {
    conversationTitle,
    chatCompletionOptions,
    setChatCompletionOptions,
    messages,
    conversationId,
    setConversationId,
    startConversation,
    continueConversation,
    isPending,
    error,
  };
};
