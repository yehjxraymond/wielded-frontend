import { config } from "@/config";
import { useActiveWorkspace } from "@/context/ActiveWorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export interface MessageDto {
  id: string;
  type: "system" | "user" | "assistant" | "function";
  fileName?: string;
  content: string;
  created_at: string;
}

export type ChatCompletionOptions = {
  [key: string]: object;
};

export interface ConversationDto {
  id: string;
  name: string;
  chatCompletionOption: ChatCompletionOptions | null;
  integrationId: string | null;
  personaId?: string;
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

export interface ConversationPayload {
  message: string;
  personaId?: string;
  files?: {
    name: string;
    content: string;
  }[];
  options?: ChatCompletionOptions;
}

const fetchMessages = betterAxiosError(
  async ({
    workspaceId,
    conversationId,
  }: {
    workspaceId: string;
    conversationId: string;
  }) => {
    const response = await authenticatedAxios.get<MessageDto[]>(
      `/workspace/${workspaceId}/conversation/${conversationId}/messages`
    );
    return response.data;
  }
);

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
  const { selectedChatIntegration: selectedChatIntegrationFromContext } =
    useActiveWorkspace();
  const [chatIntegrationOverride, setChatIntegrationOverride] = useState<
    string | null
  >(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [isPending, setIsPending] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string>("");
  const [personaIdFromConversation, setPersonaIdFromConversation] =
    useState<string>();
  const [chatCompletionOptions, setChatCompletionOptions] =
    useState<ChatCompletionOptions | null>(null);
  const { replace } = useRouter();
  const { debounceUpdate, setUpdateMessages } = useDebouncedUpdate(100, 250);
  const selectedChatIntegration =
    chatIntegrationOverride || selectedChatIntegrationFromContext;

  useEffect(() => {
    setUpdateMessages((newMessages) => {
      setMessages(newMessages);
    });
  }, [setUpdateMessages]);

  const fetchConversationMutation = useMutation({
    mutationFn: fetchConversation,
    mutationKey: ["conversations", token, initialConversationId],
    onSuccess: (data) => {
      setPersonaIdFromConversation(data.personaId);
      setChatCompletionOptions(data.chatCompletionOption);
      setConversationTitle(data.name);
      if (data.integrationId) {
        setChatIntegrationOverride(data.integrationId);
      }
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
      if (error.message === "Conversation not found in this workspace")
        replace("/");
    },
  });

  const memoisedFetchMessage = fetchMessagesMutation.mutate;
  const memoisedFetchConversation = fetchConversationMutation.mutate;

  useEffect(() => {
    if (token && initialConversationId) {
      memoisedFetchMessage({
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
      integrationId,
    }: {
      url: string;
      integrationId?: string;
      reloadConversations?: boolean;
    }) =>
    async ({ message, personaId, files }: ConversationPayload) => {
      if (!integrationId) {
        setError({
          error: "No chat model selected",
          message:
            "Please select a chat model to start/continue the conversation",
        });
        return;
      }
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
          integrationId,
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
          debounceUpdate([
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
    integrationId: selectedChatIntegration,
  });

  const continueConversation = fetchAndManageResponse({
    url: `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/continue`,
    integrationId: selectedChatIntegration,
  });

  return {
    fetchMessagesMutation,
    conversationTitle,
    chatCompletionOptions,
    setChatCompletionOptions,
    messages,
    conversationId,
    personaIdFromConversation,
    setConversationId,
    startConversation,
    continueConversation,
    isFetchingConversation: fetchConversationMutation.isPending,
    isPending,
    error,
  };
};
