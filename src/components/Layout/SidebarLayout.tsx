import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useConversation } from "@/context/ConversationContext";
import { cn } from "@/lib/utils";
import {
  Bell,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Trash,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { FunctionComponent, ReactNode, useState } from "react";
import { SettingsOverlaySidebarTrigger } from "../SettingsOverlay";
import { ThemeToggle } from "../ThemeToggle";
import { WorkspaceInvite, useNotifications } from "./useNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const sidebarHoverClass = "hover:bg-accent-foreground px-4";

const MAX_CONVERSATIONS = 8;
const SidebarConversations = () => {
  const conversationState = useConversation();
  const [showAll, setShowAll] = useState(false);

  if (conversationState.state !== "success") return null;

  // Get all conversations
  const { conversations, deleteConversation } = conversationState;

  const onDelete = (id: string) => {
    window.confirm("Are you sure you want to delete this conversation?") &&
      deleteConversation(id);
  };

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
          <div
            className={cn(
              "flex items-center justify-between group relative",
              sidebarHoverClass
            )}
          >
            <div className="overflow-hidden whitespace-nowrap text-ellipsis group-hover:text-clip py-1 group-hover:mr-8 duration-100 w-full">
              <MessageSquare className="w-4 h-4 inline mr-1 group-hover:hidden" />
              {conversation.name || "New Chat"}
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition ease-in-out duration-100">
              <Trash
                className="w-4 h-4 inline-block text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(conversation.id);
                }}
              />
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

const NotificationContent: FunctionComponent<{
  invites: WorkspaceInvite[];
  acceptInvite: (inviteId: string, accept: boolean) => void;
}> = ({ invites, acceptInvite }) => {
  const handleAcceptInvite = (inviteId: string) => {
    acceptInvite(inviteId, true);
  };

  const handleDeclineInvite = (inviteId: string) => {
    window.confirm("Are you sure you want to decline this invite?") &&
      acceptInvite(inviteId, false);
  };
  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <div key={invite.id}>
          <div className="font-semibold">Workspace Invitation</div>
          <div className="text-sm mt-2">
            {invite.email} has invited you to the following workspace:{" "}
            {invite.workspaceName}.
          </div>
          <div className="flex mt-4 justify-end space-x-2">
            <Button size="sm" onClick={() => handleDeclineInvite(invite.id)}>
              Decline
            </Button>
            <Button size="sm" onClick={() => handleAcceptInvite(invite.id)}>
              Accept
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SidebarContent = () => {
  const { logout } = useAuth();
  const { invites, acceptInvite } = useNotifications();

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
        {invites.length > 0 && (
          <Popover>
            <PopoverTrigger
              className={cn("flex items-center py-1 w-full", sidebarHoverClass)}
            >
              <Bell className="w-5 h-5 mr-2" /> Notifications
            </PopoverTrigger>
            <PopoverContent>
              <NotificationContent
                invites={invites}
                acceptInvite={acceptInvite}
              />
            </PopoverContent>
          </Popover>
        )}
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

const ContentHeader: FunctionComponent<{
  title?: string;
  submenu?: ReactNode;
}> = ({ title, submenu }) => {
  return (
    <>
      <div className="absolute flex justify-between items-center h-12 top-0 left-0 right-0 bg-background z-20">
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
        <div className="mr-4 flex items-center">{submenu}</div>
      </div>
    </>
  );
};

export const SidebarLayout: FunctionComponent<{
  children: ReactNode;
  title?: string;
  submenu?: ReactNode;
}> = ({ children, title, submenu }) => {
  return (
    <div className="flex justify-stretch">
      <div className="hidden lg:block w-1/5 bg-secondary">
        <SidebarContent />
      </div>
      <div className="flex-1 min-h-dhv max-h-dhv overflow-y-auto relative">
        <ContentHeader title={title} submenu={submenu} />
        {children}
      </div>
    </div>
  );
};
