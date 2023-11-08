import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Settings, Users } from "lucide-react";
import { useState } from "react";
import { WorkspaceSetting } from "./WorkspaceSetting";
import { MembersSetting } from "./MembersSetting";

type SettingMenu = "settings" | "members";

export const SettingsContent = () => {
  const [menuSelection, setMenuSelection] = useState<SettingMenu>("settings");

  return (
    <DialogContent className="max-w-5xl flex p-0 h-[600px]">
      <div className="w-1/5 bg-secondary">
        <div>
          <div className="text-xs font-semibold mb-4 mt-4 mx-4">Workspace</div>
          <div
            className={cn(
              "text-sm font-semibold hover:bg-accent-foreground flex items-center px-4 py-1 cursor-pointer",
              menuSelection === "settings" && "bg-accent-foreground"
            )}
            onClick={() => setMenuSelection("settings")}
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </div>
          <div
            className={cn(
              "text-sm font-semibold hover:bg-accent-foreground flex items-center px-4 py-1 cursor-pointer",
              menuSelection === "members" && "bg-accent-foreground"
            )}
            onClick={() => setMenuSelection("members")}
          >
            <Users className="h-5 w-5 mr-1" />
            Members
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {menuSelection === "settings" && <WorkspaceSetting />}
        {menuSelection === "members" && <MembersSetting />}
      </div>
    </DialogContent>
  );
};

export const SettingsOverlaySidebarTrigger = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="flex items-center py-1 w-full">
          <Settings className="w-5 h-5 mr-2" /> Settings
        </div>
      </DialogTrigger>
      <SettingsContent />
    </Dialog>
  );
};
