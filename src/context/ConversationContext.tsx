import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
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
  reloadConversations: () => void;
  deleteConversation: (id: string) => void;
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

const deleteConversationApi = async ({
  token,
  workspaceId,
  conversationId,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
}) => {
  await axios.delete(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const workspace = useWorkspace();

  const currentWorkspaceId =
    (workspace.state === "success" && workspace.currentWorkspace) || "NA";

  const fetchConversationsMutation = useMutation({
    mutationFn: fetchConversations,
    mutationKey: ["conversations", token, currentWorkspaceId],
  });

  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversationApi,
    onSuccess: () => reloadConversations()
  });

  const memoisedFetch = useMemo(
    () => fetchConversationsMutation.mutate,
    [fetchConversationsMutation.mutate]
  );

  const reloadConversations = () => {
    if (token && currentWorkspaceId !== "NA")
      memoisedFetch({
        token,
        workspaceId: currentWorkspaceId,
      });
  };

  const deleteConversation = (id: string) => {
    if (token && currentWorkspaceId !== "NA")
      deleteConversationMutation.mutate({
        token,
        workspaceId: currentWorkspaceId,
        conversationId: id,
      });
  };

  useEffect(() => {
    if (token && currentWorkspaceId !== "NA")
      memoisedFetch({
        token,
        workspaceId: currentWorkspaceId,
      });
  }, [token, memoisedFetch, currentWorkspaceId]);

  const getState = (): ConversationContextProps => {
    switch (fetchConversationsMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const conversations = fetchConversationsMutation.data;
        return {
          state: "success",
          conversations,
          reloadConversations,
          deleteConversation,
        };
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
