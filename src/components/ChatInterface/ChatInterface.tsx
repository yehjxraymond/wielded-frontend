import { Textarea } from "@/components/ui/textarea";
import { useConversation } from "@/context/ConversationContext";
import { usePersona } from "@/context/PersonaContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { AlertCircle, Send } from "lucide-react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { SidebarLayout } from "../Layout";
import { MessageBubble } from "./MessageBubble";
import { PersonaSelector } from "./PersonaSelector";
import { ShareSubmenu } from "./ShareSubmenu";
import {
  ConversationPayload,
  useConversationMessages,
} from "./useConversationMessages";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import WelcomeModal from "./WelcomeModal/WelcomeModal";
import { ModelSelector } from "./ModelSelector";

interface MessageBarProps {
  isPending: boolean;
  startConversation: (opts: ConversationPayload) => void;
  continueConversation: (opts: ConversationPayload) => void;
  conversationId?: string;
}

const MessageBar: FunctionComponent<MessageBarProps> = ({
  isPending,
  startConversation,
  continueConversation,
  conversationId,
}) => {
  const persona = usePersona();
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (isPending) return;
    const personaText =
      persona.state === "success" ? persona.selectedPersona?.content : "";
    if (!conversationId) {
      startConversation({ message: text, persona: personaText });
      setText("");
      setRowNum(1);
    } else {
      continueConversation({ message: text });
      setText("");
      setRowNum(1);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lineCount = (e.target.value.match(/\n/g) || []).length + 1;
    setRowNum(Math.min(10, Math.max(lineCount, 1)));
    setText(e.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center border border-input px-3 py-2 rounded-md bg-background mx-4">
          <Textarea
            className="focus-visible:ring-0 focus-visible:ring-offset-0 border-0 resize-none min-h-0"
            placeholder="Send a message"
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={rowNum}
            value={text}
          />
          <div
            className={
              isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }
            onClick={handleSubmit}
          >
            <Send className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RectificationMessage: FunctionComponent<{
  error?: string;
  message?: string;
  statusCode?: string | number;
}> = ({ error, message, statusCode }) => {
  if (message === "Missing API Key")
    return (
      <div>
        <AlertTitle>API for Workspace is not set</AlertTitle>
        <AlertDescription>
          <p>An OpenAI API Key has not been set for the workspace</p>
          <p>Please set the API Key in the workspace settings and try again.</p>
          <p>
            If you are not the workspace administrator, please contact your
            administrator to do so.
          </p>
        </AlertDescription>
      </div>
    );
  if (statusCode === "invalid_api_key")
    return (
      <div>
        <AlertTitle>Invalid API Key in Workspace</AlertTitle>
        <AlertDescription>
          <p>The API key you have entered is invalid.</p>
          <p>Please set the API Key in the workspace settings and try again.</p>
          <p>
            If you are not the workspace administrator, please contact your
            administrator to do so.
          </p>
        </AlertDescription>
      </div>
    );
  if (message?.includes("429")) {
    return (
      <div>
        <AlertTitle>Limit reached</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </div>
    );
  }
  if (error || message)
    return (
      <div>
        <AlertTitle>{error}</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </div>
    );
  return (
    <div>
      <AlertTitle>An unknown error has occurred.</AlertTitle>
      <AlertDescription>
        <p>
          Please try again later or seek help from support to rectify this
          problem.
        </p>
      </AlertDescription>
    </div>
  );
};
const ConversationalError: FunctionComponent<{
  error?: string;
  message?: string;
  statusCode?: string | number;
}> = ({ error, message, statusCode }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <RectificationMessage
        error={error}
        message={message}
        statusCode={statusCode}
      />
    </Alert>
  );
};

export const ChatInterfaceComponent: FunctionComponent<{
  workspaceId: string;
  conversationId?: string;
}> = ({ workspaceId, conversationId: initialConversationId }) => {
  const conversation = useConversation();
  const {
    conversationTitle,
    startConversation,
    messages: messagesWithSystemMessage,
    conversationId,
    continueConversation,
    isPending,
    error,
    chatCompletionOptions,
    setChatCompletionOptions,
  } = useConversationMessages(workspaceId, initialConversationId);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isScrollLocked, setScrollLocked] = useState(true);
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const messages = messagesWithSystemMessage.filter(
    (message) => message.type !== "system"
  );

  useEffect(() => {
    const currentLastMessage = lastMessageRef.current;
    scrollObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setScrollLocked(entry.isIntersecting);
      },
      { threshold: 1 }
    );

    if (lastMessageRef.current) {
      scrollObserverRef.current.observe(lastMessageRef.current);
    }

    return () => {
      if (scrollObserverRef.current && currentLastMessage) {
        scrollObserverRef.current.unobserve(currentLastMessage);
      }
    };
  }, [messages]);

  useEffect(() => {
    if (isInitialLoad && messages.length > 0) {
      setTimeout(() => {
        const container = document.querySelector(".messages-container");
        if (container && container.lastChild) {
          (container.lastChild as any).scrollIntoView({ behavior: "smooth" });
        }
      }, 50); // delay for smooth scroll
      setIsInitialLoad(false); // update the state so the next message won't cause a scroll
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && isScrollLocked && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrollLocked, isInitialLoad]);

  const title = conversationTitle || "Start a new conversation";

  return (
    <SidebarLayout
      title={title}
      submenu={
        initialConversationId && (
          <>
            <ShareSubmenu
              workspaceId={workspaceId}
              conversationId={initialConversationId}
            />
          </>
        )
      }
    >
      <WelcomeModal />
      <div className="flex flex-col max-h-dhv overflow-y-auto">
        <div className="container flex flex-col items-center mt-12">
          {messages.length === 0 && (
            <div className="text-center w-full">
              <div className="w-full mt-8 text-left">
                <ModelSelector
                  chatCompletionOptions={chatCompletionOptions}
                  setChatCompletionOptions={setChatCompletionOptions}
                />
                <PersonaSelector />
              </div>
            </div>
          )}
          <div className="space-y-4 max-w-2xl w-full messages-container">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {error && <ConversationalError {...error} />}
          </div>
          <div ref={lastMessageRef} className="inline-block" />
          <div className="h-24" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <MessageBar
          {...{
            isPending,
            startConversation,
            continueConversation,
            conversationId,
          }}
        />
      </div>
    </SidebarLayout>
  );
};

export const ChatInterface: FunctionComponent<{ conversationId?: string }> = ({
  conversationId,
}) => {
  const workspaceState = useWorkspace();
  // TODO Skeleton loader
  if (workspaceState.state !== "success") return null;
  return (
    <ChatInterfaceComponent
      workspaceId={workspaceState.currentWorkspace}
      conversationId={conversationId}
    />
  );
};
