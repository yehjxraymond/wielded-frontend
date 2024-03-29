import { MutationStatus, useMutation } from "@tanstack/react-query";
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
import { useUser } from "./UserContext";

export interface Workspace {
  id: string;
  name: string;
  tier: string;
  role: "owner" | "admin" | "user";
}

export interface WorkspaceEditable {
  name: string;
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
  setActiveWorkspace: (workspaceId: string) => void;
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

const postActiveWorkspace = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.post<Workspace>(
    `${config.baseUrl}/user/active-workspace`,
    { active_workspace_id: workspaceId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
  const user = useUser();
  const userProfileState = user.state;

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

  const updateActiveWorkspaceMutation = useMutation({
    mutationFn: postActiveWorkspace,
    mutationKey: ["activeWorkspace", token],
    onSuccess: () => {
      window.location.reload();
    },
  });

  const updateWorkspace = (data: {
    workspaceId: string;
    workspace: Partial<WorkspaceEditable>;
  }) => {
    if (token) {
      updateWorkspaceMutation.mutate({ ...data, token });
    }
  };

  const setActiveWorkspace = (workspaceId: string) => {
    if (token) {
      updateActiveWorkspaceMutation.mutate({ workspaceId, token });
    }
  };

  useEffect(() => {
    if (token && userProfileState === "success") memoisedFetch(token);
  }, [token, memoisedFetch, userProfileState]);

  const getState = (): WorkspaceContextProps => {
    switch (fetchWorkspacesMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const workspaces = fetchWorkspacesMutation.data;
        const userActiveWorkspace =
          user.state === "success" ? user.activeWorkspace : null;
        const currentWorkspace =
          userActiveWorkspace !== null &&
          workspaces.findIndex((w) => w.id === userActiveWorkspace) >= 0
            ? userActiveWorkspace
            : workspaces[0].id;
        return {
          state: "success",
          workspaces,
          currentWorkspace,
          updateWorkspace,
          updateWorkspaceStatus: updateWorkspaceMutation.status,
          setActiveWorkspace,
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
