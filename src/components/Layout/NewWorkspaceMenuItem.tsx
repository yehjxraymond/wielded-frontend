import { useAuth } from "@/context/AuthContext";
import { PlusSquare, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { config } from "@/config";
import { useMutation } from "@tanstack/react-query";

const postNewWorkspace = async ({
  token,
  name,
}: {
  token: string;
  name: string;
}) => {
  await axios.post(
    `${config.baseUrl}/workspace`,
    {
      name,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const useNewWorkspace = () => {
  const { token } = useAuth();
  const createWorkspaceMutation = useMutation({
    mutationFn: postNewWorkspace,
  });
  return {
    createWorkspace: (name: string) => {
      if (token) createWorkspaceMutation.mutate({ token, name });
    },
    isLoading: createWorkspaceMutation.isPending,
  };
};

export const NewWorkspaceMenuItem = () => {
  const { createWorkspace, isLoading } = useNewWorkspace();
  const [isActive, setIsActive] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const handleCreateNewWorkspace = () => {
    if (isLoading) return;
    if (workspaceName.length <= 3)
      return alert("Workspace name must be at least 4 characters long");
    createWorkspace(workspaceName);
  };
  return isActive ? (
    <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
      <Input
        className="h-6 rounded-sm focus-visible:ring-0 px-1"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
        placeholder="Workspace Name"
      />
      <PlusSquare className="ml-2 h-5 w-5" onClick={handleCreateNewWorkspace} />
      <X className="ml-2 h-5 w-5" onClick={() => setIsActive(!isActive)} />
    </div>
  ) : (
    <div
      onClick={() => setIsActive(!isActive)}
      className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
    >
      <PlusSquare className="mr-2 h-4 w-4" />
      <span>New Workspace</span>
    </div>
  );
};
