import { useActiveWorkspace } from "@/context/ActiveWorkspaceContext";
import { usePersona } from "@/context/PersonaContext";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { SidebarLayout } from "../Layout";
import { LearnMoreOverlay } from "../LearnMoreOverlay";
import { FullPageLoader } from "../Loader";
import { MessageBar } from "../MesageBar";
import { ConversationalError } from "./ConversationalError";
import { MessageBubble } from "./MessageBubble";
import { ModelSelector } from "./ModelSelector";
import { PersonaSelector } from "./PersonaSelector";
import { ShareSubmenu } from "./ShareSubmenu";
import { UnconfiguredWorkspace } from "./UnconfiguredWorkspace";
import WelcomeModal from "./WelcomeModal/WelcomeModal";
import {
  ConversationPayload,
  useConversationMessages,
} from "./useConversationMessages";

interface MessageBarProps {
  isPending: boolean;
  personaIdFromConversation?: string;
  startConversation: (opts: ConversationPayload) => void;
  continueConversation: (opts: ConversationPayload) => void;
  conversationId?: string;
}

const MessageBarWithPersona: FunctionComponent<MessageBarProps> = ({
  isPending,
  startConversation,
  continueConversation,
  conversationId,
  personaIdFromConversation,
}) => {
  const persona = usePersona();
  const { features } = useActiveWorkspace();
  const acceptVoice = features.audio.enabled;

  const handleSubmit = ({
    text,
    files,
  }: {
    text: string;
    files?: {
      name: string;
      content: string;
    }[];
  }) => {
    if (isPending) return;
    const personaId =
      persona.state === "success" ? persona.selectedPersona?.id : "";
    if (!conversationId) {
      startConversation({ message: text, personaId, files });
    } else {
      continueConversation({ message: text, files });
    }
  };

  const activePersona =
    persona.state === "success"
      ? personaIdFromConversation
        ? persona.personas.find((p) => p.id === personaIdFromConversation)
        : persona.selectedPersona
      : undefined;

  return (
    <MessageBar
      acceptFiles
      isPending={isPending}
      isNewConversation={!conversationId}
      onSubmit={handleSubmit}
      placeholder="Send a message"
      persona={activePersona}
      acceptVoice={acceptVoice}
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
    isFetchingConversation,
    error,
    fetchMessagesMutation,
    personaIdFromConversation,
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

  if (isFetchingConversation) return <FullPageLoader />;

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
                  disabled
                />
                <ModelSelector />
                <PersonaSelector />
              </div>
            </div>
          )}
          <div className="space-y-4 max-w-2xl w-full messages-container">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {error && <ConversationalError {...error} />}
            {fetchMessagesMutation.error && (
              <ConversationalError
                message={fetchMessagesMutation.error.message}
              />
            )}
          </div>
          <div ref={lastMessageRef} className="inline-block" />
          <div className="h-24" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <MessageBarWithPersona
          {...{
            personaIdFromConversation,
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
  const { activeWorkspaceId, features, isFetching } = useActiveWorkspace();
  const isWorkspaceConfigured = features.chat.integrations.length > 0;

  if (!activeWorkspaceId || isFetching) return <FullPageLoader />;
  if (!isWorkspaceConfigured) return <UnconfiguredWorkspace />;

  return (
    <ChatInterfaceComponent
      workspaceId={activeWorkspaceId}
      conversationId={conversationId}
    />
  );
};
