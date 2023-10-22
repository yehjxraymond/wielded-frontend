import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { config } from "../config";
import { useAuth } from "./AuthContext";
import { useWorkspace } from "./WorkspaceContext";

interface Conversation {
  id: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}
interface ConversationOthers {
  state: "idle" | "pending" | "error";
}

interface ConversationSuccess {
  state: "success";
  conversations: Conversation[];
}

type ConversationContextProps = ConversationSuccess | ConversationOthers;
export const ConversationContext = createContext<ConversationContextProps>(
  {} as ConversationContextProps
);

const fetchConversations = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<Conversation[]>(
    `${config.baseUrl}/workspace/${workspaceId}/conversation`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const workspace = useWorkspace();

  const fetchConversationsMutation = useMutation({
    mutationFn: fetchConversations,
    mutationKey: ["conversations", token, workspace],
  });

  useEffect(() => {
    if (token && workspace.state === "success")
      fetchConversationsMutation.mutate({
        token,
        workspaceId: workspace.currentWorkspace,
      });
  }, [token, workspace, fetchConversationsMutation]);

  const getState = (): ConversationContextProps => {
    switch (fetchConversationsMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const conversations = fetchConversationsMutation.data;
        return { state: "success", conversations };
      case "error":
        return { state: "error" };
    }
  };

  return (
    <ConversationContext.Provider value={getState()}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};
