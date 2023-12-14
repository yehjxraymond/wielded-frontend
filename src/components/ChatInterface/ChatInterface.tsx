import { usePersona } from "@/context/PersonaContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { SidebarLayout } from "../Layout";
import { MessageBar } from "../MesageBar";
import { MessageBubble } from "./MessageBubble";
import { ModelSelector } from "./ModelSelector";
import { PersonaSelector } from "./PersonaSelector";
import { ShareSubmenu } from "./ShareSubmenu";
import WelcomeModal from "./WelcomeModal/WelcomeModal";
import {
  ConversationPayload,
  useConversationMessages,
} from "./useConversationMessages";
import { ConversationalError } from "./ConversationalError";
import { LearnMoreOverlay } from "../LearnMoreOverlay";

interface MessageBarProps {
  isPending: boolean;
  startConversation: (opts: ConversationPayload) => void;
  continueConversation: (opts: ConversationPayload) => void;
  conversationId?: string;
}

const MessageBarWithPersona: FunctionComponent<MessageBarProps> = ({
  isPending,
  startConversation,
  continueConversation,
  conversationId,
}) => {
  const persona = usePersona();

  const handleSubmit = (text: string) => {
    if (isPending) return;
    const personaText =
      persona.state === "success"
        ? persona.selectedPersonaFullInstructions
        : "";
    if (!conversationId) {
      startConversation({ message: text, persona: personaText });
    } else {
      continueConversation({ message: text });
    }
  };

  return (
    <MessageBar
      isPending={isPending}
      onSubmit={handleSubmit}
      placeholder="Send a message"
    />
  );
};

export const ChatInterfaceComponent: FunctionComponent<{
  workspaceId: string;
  conversationId?: string;
}> = ({ workspaceId, conversationId: initialConversationId }) => {
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
              <div className="w-full text-left">
                <LearnMoreOverlay
                  title="Learn more about Chat"
                  videoUrl="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=K4bnEK2WJs2seLa-"
                  className="mb-4"
                />
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
        <MessageBarWithPersona
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
