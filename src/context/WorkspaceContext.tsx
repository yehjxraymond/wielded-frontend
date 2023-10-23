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

export interface Workspace {
  id: string;
  name: string;
  tier: string;
  openAiApiKey: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceOthers {
  state: "idle" | "pending" | "error";
}

interface WorkspaceSuccess {
  state: "success";
  workspaces: Workspace[];
  currentWorkspace: string;
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
        return { state: "success", workspaces, currentWorkspace };
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
