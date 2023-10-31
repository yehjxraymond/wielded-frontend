import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Share2 } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Button } from "../ui/button";
import {
  NotSharedStatus,
  SharedStatus,
  useShareConversation,
} from "./useShareConversation";

interface ShareContentProps {
  status: SharedStatus | NotSharedStatus;
  onToggleShare: () => void;
  onTogglePersona: () => void;
  onToggleSnapshot: () => void;
}

const ShareContent: FunctionComponent<ShareContentProps> = ({
  status,
  onToggleShare,
  onTogglePersona,
  onToggleSnapshot,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const isShared = status.state === "shared";
  const isShowingPersona = isShared ? status.shareSystemMessages : false;
  const isShowingNewMessages = isShared ? !status.snapshot : false;
  const shareLink = isShared
    ? `${window.location.origin}/share/${status.id}`
    : undefined;

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      });
    }
  };

  return (
    <>
      <h3 className="font-semibold mb-6">Publish to Web</h3>
      <div className="flex justify-between items-center">
        <Label htmlFor="publish-to-web">Publish</Label>
        <Switch
          id="publish-to-web"
          onCheckedChange={onToggleShare}
          checked={isShared}
        />
      </div>

      {isShared && (
        <>
          <div className="flex justify-between items-center mt-2">
            <Label htmlFor="publish-to-web">Hide persona</Label>
            <Switch
              id="publish-to-web"
              onCheckedChange={onTogglePersona}
              checked={!isShowingPersona}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Label htmlFor="publish-to-web">Hide new messages</Label>
            <Switch
              id="publish-to-web"
              onCheckedChange={onToggleSnapshot}
              checked={!isShowingNewMessages}
            />
          </div>
          <div className="mt-4 flex">
            <Input
              onClick={(e) => {
                const inputValue = e.target as HTMLInputElement;
                inputValue.select();
              }}
              value={shareLink}
              className="text-xs rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button onClick={copyShareLink} className="rounded-l-none">
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

const ShareContentLoading = () => {
  return <div>Loading...</div>;
};

export const ShareSubmenu: FunctionComponent<{
  workspaceId: string;
  conversationId: string;
}> = ({ workspaceId, conversationId }) => {
  const share = useShareConversation(workspaceId, conversationId);
  const onToggleShare = () => {
    if (share.shareStatus === undefined) return;
    if (share.shareStatus.state === "shared") {
      share.unshareConversation(conversationId);
    } else {
      share.shareConversation(conversationId, false, true);
    }
  };

  // TODO Debounce and group persona and snapshot toggles
  const onTogglePersona = () => {
    if (share.shareStatus === undefined) return;
    if (share.shareStatus.state === "shared") {
      share.updateShareStatus(conversationId, {
        shareSystemMessages: !share.shareStatus.shareSystemMessages,
        snapshot: !!share.shareStatus.snapshot,
      });
    }
  };
  const onToggleSnapshot = () => {
    if (share.shareStatus === undefined) return;
    if (share.shareStatus.state === "shared") {
      share.updateShareStatus(conversationId, {
        shareSystemMessages: share.shareStatus.shareSystemMessages,
        snapshot: !share.shareStatus.snapshot,
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Share2 className="w-6 h-6" />
      </PopoverTrigger>
      <PopoverContent className="mr-1 w-96">
        {share.shareStatus === undefined ? (
          <ShareContentLoading />
        ) : (
          <ShareContent
            status={share.shareStatus}
            onToggleShare={onToggleShare}
            onTogglePersona={onTogglePersona}
            onToggleSnapshot={onToggleSnapshot}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};
