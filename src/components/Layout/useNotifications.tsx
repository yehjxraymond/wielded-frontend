import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export interface WorkspaceInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  status: string;
  invitedBy: string;
  workspaceName: string;
}

const getWorkspaceInvites = async ({ token }: { token: string }) => {
  const response = await axios.get<WorkspaceInvite[]>(
    `${config.baseUrl}/user/invite`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const acceptWorkspaceInvite = async ({
  token,
  inviteId,
  accept,
}: {
  accept: boolean;
  token: string;
  inviteId: string;
}) => {
  const response = await axios.post<string>(
    `${config.baseUrl}/user/invite/${inviteId}`,
    { accept },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useNotifications = () => {
  const { token } = useAuth();

  const [invitesRaw, setInvites] = useState<WorkspaceInvite[]>([]);
  const invites = invitesRaw.filter(
    (invite) =>
      invite.status === "pending" && new Date(invite.expiresAt) > new Date()
  );

  const fetchWorkspaceInviteMutation = useMutation({
    mutationFn: getWorkspaceInvites,
    onSuccess: (data) => {
      setInvites(data);
    },
  });

  const acceptWorkspaceInviteMutation = useMutation({
    mutationFn: acceptWorkspaceInvite,
    onSuccess: (data) => {
      setInvites((invites) => invites.filter((invite) => invite.id !== data));
    },
  });

  const memoisedFetchInvites = useMemo(
    () => fetchWorkspaceInviteMutation.mutate,
    [fetchWorkspaceInviteMutation.mutate]
  );

  const acceptInvite = (inviteId: string, accept: boolean) => {
    if (token)
      acceptWorkspaceInviteMutation.mutate({
        token,
        inviteId,
        accept,
      });
  };

  useEffect(() => {
    if (token)
      memoisedFetchInvites({
        token,
      });
  }, [token, memoisedFetchInvites]);

  return {
    invites,
    acceptInvite,
    fetchWorkspaceInviteMutation,
    acceptWorkspaceInviteMutation,
  };
};
