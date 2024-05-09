"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Blocks, Landmark, Link, Settings, Users } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { WorkspaceSetting } from "./WorkspaceSetting";
import { MembersSetting } from "./MembersSetting";
import { BillingSetting } from "./BillingSetting";
import { IntegrationSetting } from "./IntegrationSetting";
import { useSearchParams } from "next/navigation";
import { FeatureFlag } from "../FeatureFlag/FeatureFlag";
import { SsoSetting } from "./SsoSetting/SsoSetting";

type SettingMenu = "settings" | "members" | "billing" | "integrations" | "sso";

export const SettingsContent: FunctionComponent<{
  defaultMenu: string | null;
}> = ({ defaultMenu }) => {
  const [menuSelection, setMenuSelection] = useState<SettingMenu>(
    (defaultMenu as SettingMenu) || "settings"
  );

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
              menuSelection === "integrations" && "bg-accent-foreground"
            )}
            onClick={() => setMenuSelection("integrations")}
          >
            <Blocks className="h-5 w-5 mr-1" />
            Integrations
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
          <div
            className={cn(
              "text-sm font-semibold hover:bg-accent-foreground flex items-center px-4 py-1 cursor-pointer",
              menuSelection === "billing" && "bg-accent-foreground"
            )}
            onClick={() => setMenuSelection("billing")}
          >
            <Landmark className="h-5 w-5 mr-1" />
            Billing
          </div>
          <FeatureFlag flags={["SSO_ENABLED"]}>
            <div
              className={cn(
                "text-sm font-semibold hover:bg-accent-foreground flex items-center px-4 py-1 cursor-pointer",
                menuSelection === "sso" && "bg-accent-foreground"
              )}
              onClick={() => setMenuSelection("sso")}
            >
              <Link className="h-5 w-5 mr-1" />
              SSO
            </div>
          </FeatureFlag>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {menuSelection === "settings" && <WorkspaceSetting />}
        {menuSelection === "integrations" && <IntegrationSetting />}
        {menuSelection === "members" && <MembersSetting />}
        {menuSelection === "billing" && <BillingSetting />}
        {menuSelection === "sso" && <SsoSetting />}
      </div>
    </DialogContent>
  );
};

export const SettingsOverlaySidebarTrigger = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const settingSelectionFromUrl = searchParams.get("settings");

  useEffect(() => {
    if (settingSelectionFromUrl) {
      setIsOpen(true);
    }
  }, [settingSelectionFromUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <div className="flex items-center py-1 w-full">
          <Settings className="w-5 h-5 mr-2" /> Settings
        </div>
      </DialogTrigger>
      <SettingsContent defaultMenu={settingSelectionFromUrl} />
    </Dialog>
  );
};
