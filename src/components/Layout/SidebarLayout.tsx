import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { cn } from "@/lib/utils";
import {
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { FunctionComponent, ReactNode, useState } from "react";
import { SettingsOverlaySidebarTrigger } from "../SettingsOverlay";
import { ThemeToggle } from "../ThemeToggle";

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
          href="/persona"
          className={cn("flex items-center py-1", sidebarHoverClass)}
        >
          <UserCircle className="w-5 h-5 mr-2" /> Personas
        </Link>
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

const ContentHeader: FunctionComponent<{ title?: string }> = ({ title }) => {
  return (
    <>
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
        {title ? <div className="font-medium">{title}</div> : <div />}
        <div>{/* TODO Advanced Model Settings */}</div>
      </div>
    </>
  );
};

export const SidebarLayout: FunctionComponent<{
  children: ReactNode;
  title?: string;
}> = ({ children, title }) => {
  return (
    <div className="flex justify-stretch">
      <div className="hidden lg:block w-1/5 bg-secondary">
        <SidebarContent />
      </div>
      <div className="flex-1 min-h-dhv max-h-dhv overflow-y-auto relative">
        <ContentHeader title={title} />
        {children}
      </div>
    </div>
  );
};
