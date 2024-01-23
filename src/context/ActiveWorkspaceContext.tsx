import { humanReadableChatLabels } from "@/components/SettingsOverlay/IntegrationSetting/humanReadableNames";
import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useQuery } from "@tanstack/react-query";
import localForage from "localforage";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWorkspace } from "./WorkspaceContext";

export interface Integration {
  id: string;
  workspaceId: string;
  provider: "azure_open_ai" | "open_ai" | "aws_bedrock" | "claude";
  type: "chat" | "image";
  model: string;
  createdAt: string;
  updatedAt: string;
}

interface ActiveWorkspaceContextProps {
  activeWorkspaceId?: string;
  integrations: Integration[];
  features: Feature;
  selectedChatIntegration?: string;
  setSelectedChatIntegration: (integrationId: string) => void;
}

export const ActiveWorkspaceContext =
  createContext<ActiveWorkspaceContextProps>({} as ActiveWorkspaceContextProps);

const getIntegrations = betterAxiosError(
  async ({ workspaceId }: { workspaceId: string }) => {
    const { data } = await authenticatedAxios.get<Integration[]>(
      `/workspace/${workspaceId}/integration`
    );
    return data;
  }
);

export interface Feature {
  chat: {
    enabled: boolean;
    integrations: (Integration & { label: string })[];
  };
}

const integrationsToFeatures = (integrations: Integration[] = []): Feature => {
  const hasMultipleOpenAiProviders =
    integrations.some(
      (integration) => integration.provider === "azure_open_ai"
    ) && integrations.some((integration) => integration.provider === "open_ai");
  const hasMultipleAnthropicProviders =
    integrations.some(
      (integration) =>
        integration.provider === "aws_bedrock" &&
        integration.model.startsWith("anthropic")
    ) && integrations.some((integration) => integration.provider === "claude");

  const chatIntegrations = integrations
    .filter((integration) => integration.type === "chat")
    .sort((a, b) => {
      return a.provider < b.provider ? 1 : -1;
    })
    .map((integration) => ({
      ...integration,
      label: humanReadableChatLabels({
        model: integration.model,
        provider: integration.provider,
        hasMultipleAnthropicProviders,
        hasMultipleOpenAiProviders,
      }),
    }));
  return {
    chat: {
      enabled: chatIntegrations.length > 0,
      integrations: chatIntegrations,
    },
  };
};

interface ChatIntegrationStorage {
  [workspaceId: string]: string;
}

export const ActiveWorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const workspaceContext = useWorkspace();
  const workspaceId =
    workspaceContext.state === "success"
      ? workspaceContext.currentWorkspace
      : "";
  const integrationQuery = useQuery({
    queryKey: ["integrations", { workspaceId }],
    queryFn: () => getIntegrations({ workspaceId }),
    enabled: workspaceId !== "",
  });
  const [selectedChatIntegration, setSelectedChatIntegrationState] = useState<
    string | undefined
  >();
  useEffect(() => {
    localForage
      .getItem<ChatIntegrationStorage>("default_chat_integration")
      .then((value) => {
        if (value && value[workspaceId]) {
          setSelectedChatIntegrationState(value[workspaceId]);
        }
      });
  }, [workspaceId]);
  useEffect(() => {
    if (
      integrationQuery.data &&
      integrationQuery.data.length > 0 &&
      !selectedChatIntegration
    ) {
      setSelectedChatIntegrationState(integrationQuery.data[0].id);
    }
  }, [integrationQuery.data, selectedChatIntegration]);
  const setSelectedChatIntegration = (integrationId: string) => {
    setSelectedChatIntegrationState(integrationId);
    localForage
      .getItem<ChatIntegrationStorage>("default_chat_integration")
      .then((value) => {
        localForage.setItem("default_chat_integration", {
          ...value,
          [workspaceId]: integrationId,
        });
      });
  };
  const value = {
    activeWorkspaceId: workspaceId === "" ? undefined : workspaceId,
    integrations: integrationQuery.data || [],
    features: integrationsToFeatures(integrationQuery.data),
    selectedChatIntegration,
    setSelectedChatIntegration,
  };
  return (
    <ActiveWorkspaceContext.Provider value={value}>
      {children}
    </ActiveWorkspaceContext.Provider>
  );
};

export const useActiveWorkspace = () => {
  const context = useContext(ActiveWorkspaceContext);
  if (!context) {
    throw new Error(
      "useActiveWorkspace must be used within a ActiveWorkspaceContext"
    );
  }
  return context;
};
