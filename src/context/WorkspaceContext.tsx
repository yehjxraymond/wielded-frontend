import {
  MutationStatus,
  useMutation
} from "@tanstack/react-query";
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

export interface Workspace {
  id: string;
  name: string;
  tier: string;
  hasOpenAiApiKey: boolean;
  role: "owner" | "admin" | "user";
  openAiApiKey?: string;
}

export interface WorkspaceEditable {
  name: string;
  openAiApiKey: string;
}

interface WorkspaceOthers {
  state: "idle" | "pending" | "error";
}

export interface WorkspaceSuccess {
  state: "success";
  workspaces: Workspace[];
  currentWorkspace: string;
  updateWorkspace: (data: {
    workspaceId: string;
    workspace: Partial<WorkspaceEditable>;
  }) => void;
  updateWorkspaceStatus: MutationStatus;
}

type WorkspaceContextProps = WorkspaceOthers | WorkspaceSuccess;

export const WorkspaceContext = createContext<WorkspaceContextProps>(
  {} as WorkspaceContextProps
);

const fetchWorkspaces = async (token: string) => {
  const response = await axios.get<Workspace[]>(`${config.baseUrl}/workspace`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const putWorkspace = async ({
  token,
  workspaceId,
  workspace,
}: {
  token: string;
  workspaceId: string;
  workspace: Partial<WorkspaceEditable>;
}) => {
  const response = await axios.put<Workspace>(
    `${config.baseUrl}/workspace/${workspaceId}`,
    workspace,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();

  const fetchWorkspacesMutation = useMutation({
    mutationFn: fetchWorkspaces,
    mutationKey: ["workspaces", token],
  });

  const memoisedFetch = useMemo(
    () => fetchWorkspacesMutation.mutate,
    [fetchWorkspacesMutation.mutate]
  );

  const updateWorkspaceMutation = useMutation({
    mutationFn: putWorkspace,
    mutationKey: ["workspace", token],
  });

  const updateWorkspace = (data: {
    workspaceId: string;
    workspace: Partial<WorkspaceEditable>;
  }) => {
    if (token) {
      updateWorkspaceMutation.mutate({ ...data, token });
    }
  };

  useEffect(() => {
    if (token) memoisedFetch(token);
  }, [token, memoisedFetch]);

  const getState = (): WorkspaceContextProps => {
    switch (fetchWorkspacesMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const workspaces = fetchWorkspacesMutation.data;
        // TODO move workspace selection to user profile
        const currentWorkspace = workspaces[0].id;
        return {
          state: "success",
          workspaces,
          currentWorkspace,
          updateWorkspace,
          updateWorkspaceStatus: updateWorkspaceMutation.status,
        };
      case "error":
        return { state: "error" };
    }
  };

  return (
    <WorkspaceContext.Provider value={getState()}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
