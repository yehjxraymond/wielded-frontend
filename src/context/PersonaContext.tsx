import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { config } from "../config";
import { useAuth } from "./AuthContext";
import { useWorkspace } from "./WorkspaceContext";

interface Persona {
  id: string;
  name: string | null;
  description: string | null;
  content: string;
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
  createPersona: (persona: Partial<Persona>) => void;
  updatePersona: (persona: Partial<Persona>) => void;
  selectedPersona: Persona | undefined;
  selectPersona: (personaId: string | undefined) => void;
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

const postPersona = async ({
  token,
  workspaceId,
  persona,
}: {
  token: string;
  workspaceId: string;
  persona: Partial<Persona>;
}) => {
  const response = await axios.post<Persona>(
    `${config.baseUrl}/workspace/${workspaceId}/persona`,
    persona,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const putPersona = async ({
  token,
  workspaceId,
  persona,
}: {
  token: string;
  workspaceId: string;
  persona: Partial<Persona>;
}) => {
  const response = await axios.put<Persona>(
    `${config.baseUrl}/workspace/${workspaceId}/persona/${persona.id}`,
    persona,
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    string | undefined
  >(undefined);

  const currentWorkspaceId =
    (workspace.state === "success" && workspace.currentWorkspace) || "NA";

  const createPersonaMutation = useMutation({
    mutationFn: postPersona,
    mutationKey: ["personas", token, currentWorkspaceId],
    onSuccess: () => {
      reloadPersonas();
    },
  });

  const updatePersonaMutation = useMutation({
    mutationFn: putPersona,
    mutationKey: ["personas", token, currentWorkspaceId],
    onSuccess: () => {
      reloadPersonas();
    },
  });

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

  const createPersona = async (persona: Partial<Persona>) => {
    if (token && currentWorkspaceId !== "NA")
      createPersonaMutation.mutate({
        token,
        workspaceId: currentWorkspaceId,
        persona,
      });
  };

  const updatePersona = async (persona: Partial<Persona>) => {
    if (token && currentWorkspaceId !== "NA")
      updatePersonaMutation.mutate({
        token,
        workspaceId: currentWorkspaceId,
        persona,
      });
  };

  useEffect(() => {
    if (token && currentWorkspaceId !== "NA")
      memoisedFetch({
        token,
        workspaceId: currentWorkspaceId,
      });
  }, [token, memoisedFetch, currentWorkspaceId]);

  const selectedPersona = fetchPersonasMutation.data?.find(
    (persona) => persona.id === selectedPersonaId
  );

  const selectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
  };

  const getState = (): PersonaContextProps => {
    switch (fetchPersonasMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const personas = fetchPersonasMutation.data;
        return {
          state: "success",
          personas,
          reloadPersonas,
          createPersona,
          updatePersona,
          selectedPersona,
          selectPersona,
        };
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
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
};
