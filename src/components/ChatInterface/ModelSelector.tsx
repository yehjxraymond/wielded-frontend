import { FunctionComponent } from "react";
import { HorizontalSelector } from "../ui/horizontal-selector";
import { useActiveWorkspace } from "@/context/ActiveWorkspaceContext";

export const ModelSelector: FunctionComponent = () => {
  const { features, selectedChatIntegration, setSelectedChatIntegration } =
    useActiveWorkspace();
  const choices = features.chat.integrations.map((integration) => ({
    label: integration.label,
    value: integration.id,
  }));
  return (
    <>
      <div className="font-semibold">Model</div>
      <div className="my-6">
        <HorizontalSelector
          className="mt-2"
          choices={choices}
          selected={selectedChatIntegration}
          setSelected={setSelectedChatIntegration}
        />
      </div>
    </>
  );
};
