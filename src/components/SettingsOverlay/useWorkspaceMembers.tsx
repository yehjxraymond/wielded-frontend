import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export type Role = "user" | "admin" | "owner";

export interface Invite {
  id: string;
  email: string;
  role: Role;
  expiresAt: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
}

const getWorkspaceInvites = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<Invite[]>(
    `${config.baseUrl}/workspace/${workspaceId}/invite`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const postWorkspaceInvite = async ({
  token,
  workspaceId,
  email,
  role,
}: {
  token: string;
  workspaceId: string;
  email: string;
  role: Role;
}) => {
  const response = await axios.post<Invite>(
    `${config.baseUrl}/workspace/${workspaceId}/invite`,
    { email, role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useWorkspaceMembers = (workspaceId: string) => {
  const { token } = useAuth();

  const [invites, setInvites] = useState<Invite[]>([]);

  const fetchWorkspaceInviteMutation = useMutation({
    mutationFn: getWorkspaceInvites,
    onSuccess: (data) => {
      setInvites(data);
    },
  });
  const createWorkspaceInviteMutation = useMutation({
    mutationFn: postWorkspaceInvite,
    onSuccess: (data) => {
      setInvites((invites) => [...invites, data]);
    },
  });
  const memoisedFetch = useMemo(
    () => fetchWorkspaceInviteMutation.mutate,
    [fetchWorkspaceInviteMutation.mutate]
  );
  useEffect(() => {
    if (token && workspaceId)
      memoisedFetch({
        token,
        workspaceId,
      });
  }, [token, memoisedFetch, workspaceId]);

  const inviteMember = ({ email, role }: { email: string; role: Role }) => {
    if (token && workspaceId)
      createWorkspaceInviteMutation.mutate({
        token,
        workspaceId,
        email,
        role,
      });
  };

  return {
    invites,
    fetchWorkspaceInviteMutation,
    createWorkspaceInviteMutation,

    inviteMember,
    inviteMemberStatus: createWorkspaceInviteMutation.status,
    inviteMemberError: createWorkspaceInviteMutation.error,
  };
};
