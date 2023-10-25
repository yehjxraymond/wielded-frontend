import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import {
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Send
} from "lucide-react";
import Link from "next/link";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { SettingsOverlaySidebarTrigger } from "../SettingsOverlay";
import { ThemeToggle } from "../ThemeToggle";
import { MessageBubble } from "./MessageBubble";
import { useConversationMessages } from "./useConversationMessages";

const sidebarHoverClass = "hover:bg-accent-foreground px-4";

const MAX_CONVERSATIONS = 8;
const SidebarConversations = () => {
  const conversationState = useConversation();
  const [showAll, setShowAll] = useState(false);

  if (conversationState.state !== "success") return null;

  // Get all conversations
  const { conversations } = conversationState;

  // Limit to MAX_CONVERSATIONS for sidebar and leave the rest
  const sidebarConversations = showAll
    ? conversations
    : conversations.slice(0, MAX_CONVERSATIONS);
  const remaining = conversations.length - MAX_CONVERSATIONS;

  const onClickShowMore = () => setShowAll(true);

  return (
    <div className="flex flex-col my-2 max-h-dhv">
      <div className="text-sm font-semibold px-4">Private</div>
      {sidebarConversations.map((conversation) => (
        <Link href={`/chat/${conversation.id}`} key={conversation.id}>
          <div className={cn("flex items-center", sidebarHoverClass)}>
            <div className="overflow-hidden whitespace-nowrap overflow-ellipsis py-1">
              <MessageSquare className="w-4 h-4 inline-block" />{" "}
              {conversation.name || "New Chat"}
            </div>
          </div>
        </Link>
      ))}
      {!showAll && remaining > 0 && (
        <button
          className={cn(
            "text-left font-medium text-sm mt-2",
            sidebarHoverClass
          )}
          onClick={onClickShowMore}
        >{`${remaining} more`}</button>
      )}
      {showAll && (
        <button
          className={cn(
            "text-left font-medium text-sm mt-2",
            sidebarHoverClass
          )}
          onClick={() => setShowAll(false)}
        >
          Show less
        </button>
      )}
    </div>
  );
};

const SidebarContent = () => {
  const { logout } = useAuth();

  return (
    <div className="max-h-dhv min-h-dhv flex flex-col justify-between">
      <Link href="/" className="px-4">
        <div className="font-semibold text-xl h-12 flex items-center">
          wielded_
        </div>
      </Link>
      {/* Main actions */}
      <div className="my-4">
        <div className={cn("hidden items-center py-1", sidebarHoverClass)}>
          <Search className="w-5 h-5 mr-2" /> Search
        </div>
        <div className={cn("flex", sidebarHoverClass)}>
          <SettingsOverlaySidebarTrigger />
        </div>
        <Link
          href="/"
          className={cn("flex items-center py-1", sidebarHoverClass)}
        >
          <PlusCircle className="w-5 h-5 mr-2" /> New Chat
        </Link>
      </div>

      <div className="flex-grow overflow-y-auto">
        <SidebarConversations />
      </div>
      <div className="mt-4 bg-secondary mb-10 lg:mb-4 px-4">
        <ThemeToggle />
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

const ContentHeader = () => {
  return (
    <div className="absolute flex justify-between items-center h-12 top-0 left-0 right-0 bg-background">
      <div className="lg:hidden p-2 flex flex-col">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-8 w-8" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-secondary">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden lg:block" />
      <div>{/* TODO Title */}</div>
      <div>{/* TODO Advanced Model Settings */}</div>
    </div>
  );
};

const ChatLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex justify-stretch">
      <div className="hidden lg:block w-1/5 bg-secondary">
        <SidebarContent />
      </div>
      <div className="flex-1 min-h-dhv max-h-dhv overflow-y-auto relative">
        <ContentHeader />
        {children}
      </div>
    </div>
  );
};

interface MessageBarProps {
  isPending: boolean;
  startConversation: (text: string) => void;
  continueConversation: (text: string) => void;
  conversationId?: string;
}

const MessageBar: FunctionComponent<MessageBarProps> = ({
  isPending,
  startConversation,
  continueConversation,
  conversationId,
}) => {
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (isPending) return;
    if (!conversationId) {
      startConversation(text);
      setText("");
      setRowNum(1);
    } else {
      continueConversation(text);
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

export const ChatInterfaceComponent: FunctionComponent<{
  workspaceId: string;
  conversationId?: string;
}> = ({ workspaceId, conversationId: initialConversationId }) => {
  const {
    startConversation,
    messages,
    conversationId,
    continueConversation,
    isPending,
  } = useConversationMessages(workspaceId, initialConversationId);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isScrollLocked, setScrollLocked] = useState(true);
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <ChatLayout>
      <div className="flex flex-col max-h-dhv overflow-y-auto">
        {/* mt-12 to clear header */}
        <div className="container flex flex-col items-center mt-12">
          {/* TODO Messages go here, use markdown + latex */}
          <div className="space-y-4 max-w-2xl w-full messages-container">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
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
    </ChatLayout>
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
