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

interface Persona {
  id: string;
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
interface PersonaOthers {
  state: "idle" | "pending" | "error";
}

export interface PersonaSuccess {
  state: "success";
  personas: Persona[];
  reloadPersonas: () => void;
}

type PersonaContextProps = PersonaSuccess | PersonaOthers;
export const PersonaContext = createContext<PersonaContextProps>(
  {} as PersonaContextProps
);

const fetchPersonas = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<Persona[]>(
    `${config.baseUrl}/workspace/${workspaceId}/persona`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const PersonaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const workspace = useWorkspace();

  const currentWorkspaceId =
    (workspace.state === "success" && workspace.currentWorkspace) || "NA";

  const fetchPersonasMutation = useMutation({
    mutationFn: fetchPersonas,
    mutationKey: ["personas", token, currentWorkspaceId],
  });

  const memoisedFetch = useMemo(
    () => fetchPersonasMutation.mutate,
    [fetchPersonasMutation.mutate]
  );

  const reloadPersonas = () => {
    if (token && currentWorkspaceId !== "NA")
      memoisedFetch({
        token,
        workspaceId: currentWorkspaceId,
      });
  };

  useEffect(() => {
    if (token && currentWorkspaceId !== "NA")
      memoisedFetch({
        token,
        workspaceId: currentWorkspaceId,
      });
  }, [token, memoisedFetch, currentWorkspaceId]);

  const getState = (): PersonaContextProps => {
    switch (fetchPersonasMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const personas = fetchPersonasMutation.data;
        return { state: "success", personas, reloadPersonas };
      case "error":
        return { state: "error" };
    }
  };

  return (
    <PersonaContext.Provider value={getState()}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error(
      "usePersona must be used within a PersonaProvider"
    );
  }
  return context;
};
