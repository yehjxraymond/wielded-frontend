import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import { Menu, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { FunctionComponent, ReactNode, useState } from "react";
import { useConversationMessages } from "./useConversationMessages";

const SidebarConversations = () => {
  const conversationState = useConversation();
  if (conversationState.state !== "success") return null;
  return (
    <div className="flex flex-col gap-2 my-2">
      {conversationState.conversations.map((conversation) => (
        <Link href={`/chat/${conversation.id}`} key={conversation.id}>
          <div key={conversation.id} className="flex items-center rounded-lg">
            <MessageSquare className="w-4 h-4 mr-2" />
            <div className="flex-1">{conversation.name || "New Chat"}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const SidebarContent = () => {
  const { logout } = useAuth();

  return (
    <div className=" px-4">
      <div className="h-12 flex items-center">
        <Link href="/">
          <div className="font-semibold text-xl">wielded_</div>
        </Link>
      </div>
      <SidebarConversations />
      <div className="">
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
}> = ({ workspaceId }) => {
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState("");
  const { startConversation, messages, conversationId, continueConversation } =
    useConversationMessages(workspaceId, null);
  const handleSubmit = () => {
    if (!conversationId) {
      console.log("new conv", text);
      startConversation(text);
      setText("");
    } else {
      console.log("existing conv", text);
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
          <div className="space-y-4 max-w-2xl w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
                {message.streaming && "..."}
              </div>
            ))}
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
              <div className="cursor-pointer" onClick={handleSubmit}>
                <Send className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export const ChatInterface = () => {
  const workspaceState = useWorkspace();
  // TODO Skeleton loader
  if (workspaceState.state !== "success") return null;
  return (
    <ChatInterfaceComponent workspaceId={workspaceState.currentWorkspace} />
  );
};
