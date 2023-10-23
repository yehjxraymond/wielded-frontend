import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Menu, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageBubble } from "./MessageBubble";
import { useConversationMessages } from "./useConversationMessages";

const SidebarConversations = () => {
  const conversationState = useConversation();

  if (conversationState.state !== "success") return null;

  return (
    <div className="flex flex-col gap-2 my-2 max-h-screen overflow-scroll">
      {conversationState.conversations.map((conversation) => (
        <Link href={`/chat/${conversation.id}`} key={conversation.id}>
          <div key={conversation.id} className="flex items-center rounded-lg ">
            <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">
              <MessageSquare className="w-4 h-4 inline-block" />{" "}
              {conversation.name || "New Chat"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const SidebarContent = () => {
  const { logout } = useAuth();

  return (
    <div className="px-4 max-h-screen min-h-screen flex flex-col justify-between">
      <Link href="/">
        <div className="font-semibold text-xl h-12 flex items-center">
          wielded_
        </div>
      </Link>

      <div className="flex-grow overflow-auto">
        <SidebarConversations />
      </div>
      <div className="mt-4 px-4 bg-accent mb-10 lg:mb-4">
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
          <SheetContent side="left" className="bg-accent">
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
      <div className="hidden lg:block w-1/5 bg-accent">
        <SidebarContent />
      </div>
      <div className="flex-1 min-h-screen max-h-screen overflow-y-auto relative">
        <ContentHeader />
        {children}
      </div>
    </div>
  );
};

export const ChatInterfaceComponent: FunctionComponent<{
  workspaceId: string;
  conversationId?: string;
}> = ({ workspaceId, conversationId: initialConversationId }) => {
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState("");
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
      }, 300); // delay for smooth scroll
      setIsInitialLoad(false); // update the state so the next message won't cause a scroll
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (isScrollLocked && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrollLocked]);

  const handleSubmit = () => {
    if (isPending) return;
    if (!conversationId) {
      startConversation(text);
      setText("");
    } else {
      continueConversation(text);
      setText("");
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
    <ChatLayout>
      <div className="flex flex-col max-h-screen overflow-y-auto">
        {/* mt-12 to clear header */}
        <div className="container flex flex-col items-center mt-12">
          {/* TODO Messages go here, use markdown + latex */}
          <div className="space-y-4 max-w-2xl w-full messages-container">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            <div ref={lastMessageRef}>&nbsp;</div>
          </div>
          <div className="h-24" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 w-full">
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
