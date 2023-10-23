import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Send, MessageSquare } from "lucide-react";
import { FunctionComponent, ReactNode, useState } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useConversation } from "@/context/ConversationContext";

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

export const ChatInterface = () => {
  const workspaceState = useWorkspace();
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "agent",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris augue neque gravida in fermentum et sollicitudin ac. Neque ornare aenean euismod elementum nisi quis eleifend. Non diam phasellus vestibulum lorem sed risus ultricies tristique nulla. Egestas maecenas pharetra convallis posuere morbi leo. Cursus in hac habitasse platea dictumst quisque sagittis. At risus viverra adipiscing at in tellus. Posuere lorem ipsum dolor sit amet consectetur. Ornare arcu dui vivamus arcu felis bibendum ut tristique et. Elementum nisi quis eleifend quam. Est sit amet facilisis magna etiam tempor orci. Augue eget arcu dictum varius duis at consectetur lorem donec. Dictum sit amet justo donec enim diam vulputate ut. Volutpat commodo sed egestas egestas fringilla phasellus. Orci ac auctor augue mauris augue. Placerat orci nulla pellentesque dignissim enim sit. Nulla facilisi morbi tempus iaculis urna id volutpat. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu. Feugiat pretium nibh ipsum consequat nisl vel pretium. Dolor sit amet consectetur adipiscing elit ut aliquam.

      A scelerisque purus semper eget duis at. Amet facilisis magna etiam tempor orci eu lobortis. Amet facilisis magna etiam tempor. Integer enim neque volutpat ac. Tortor consequat id porta nibh venenatis cras sed. Scelerisque eu ultrices vitae auctor eu. Ornare arcu odio ut sem nulla pharetra diam. Eget egestas purus viverra accumsan in. Molestie at elementum eu facilisis sed odio morbi quis. Auctor elit sed vulputate mi sit amet. Viverra justo nec ultrices dui sapien eget mi proin sed. Gravida rutrum quisque non tellus orci ac. Ipsum a arcu cursus vitae congue mauris rhoncus. In nibh mauris cursus mattis molestie a iaculis at erat. Quisque id diam vel quam elementum pulvinar etiam. Tristique senectus et netus et malesuada fames ac turpis egestas.
      
      Lorem ipsum dolor sit amet consectetur adipiscing. Pulvinar neque laoreet suspendisse interdum consectetur libero. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Est ullamcorper eget nulla facilisi. Erat pellentesque adipiscing commodo elit at. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Sed elementum tempus egestas sed sed risus pretium. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Senectus et netus et malesuada. Sit amet justo donec enim diam vulputate ut pharetra. Purus gravida quis blandit turpis cursus in hac. Elementum curabitur vitae nunc sed.
      
      Suspendisse sed nisi lacus sed viverra tellus in hac habitasse. Sagittis purus sit amet volutpat consequat mauris nunc congue nisi. Elementum tempus egestas sed sed risus pretium quam. Pulvinar sapien et ligula ullamcorper. Ultrices in iaculis nunc sed augue. Feugiat nibh sed pulvinar proin. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. At imperdiet dui accumsan sit amet nulla facilisi. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Augue lacus viverra vitae congue eu consequat ac. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget. At consectetur lorem donec massa. Facilisis gravida neque convallis a cras semper. Pulvinar etiam non quam lacus suspendisse faucibus. Massa vitae tortor condimentum lacinia quis vel eros. Etiam erat velit scelerisque in.
      
      Eget egestas purus viverra accumsan in nisl nisi scelerisque. Turpis egestas maecenas pharetra convallis posuere morbi leo. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Egestas tellus rutrum tellus pellentesque eu tincidunt. Dolor sit amet consectetur adipiscing elit duis. Sit amet commodo nulla facilisi nullam vehicula ipsum. Amet nulla facilisi morbi tempus iaculis urna. Varius quam quisque id diam vel. Amet porttitor eget dolor morbi non arcu risus quis varius. Enim neque volutpat ac tincidunt vitae. Sit amet tellus cras adipiscing enim eu turpis. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Lacus laoreet non curabitur gravida arcu. Ante in nibh mauris cursus. Mauris a diam maecenas sed enim ut sem. Quam nulla porttitor massa id. Ut lectus arcu bibendum at varius vel pharetra.`,
    },
  ]);
  const handleSubmit = () => {
    console.log("submit", text);
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
        <div className="container flex flex-col items-center">
          {/* TODO Messages go here, use markdown + latex */}
          <div className="space-y-4 max-w-2xl w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
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
