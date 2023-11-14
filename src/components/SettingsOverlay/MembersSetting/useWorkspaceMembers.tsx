import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
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

export interface Member {
  membershipId: string;
  userId: string;
  role: Role;
  created_at: string;
  email: string;
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

const getWorkspaceMembers = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<Member[]>(
    `${config.baseUrl}/workspace/${workspaceId}/member`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const deleteWorkspaceMember = async ({
  token,
  workspaceId,
  membershipId,
}: {
  token: string;
  workspaceId: string;
  membershipId: string;
}) => {
  const response = await axios.delete(
    `${config.baseUrl}/workspace/${workspaceId}/member/${membershipId}`,
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
  try {
    const response = await axios.post<Invite>(
      `${config.baseUrl}/workspace/${workspaceId}/invite`,
      { email, role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      const data = e.response?.data;
      if (data.message) {
        throw new Error(data.message);
      }
    }
    throw e;
  }
};

const deleteWorkspaceInvite = async ({
  token,
  workspaceId,
  inviteId,
}: {
  token: string;
  workspaceId: string;
  inviteId: string;
}) => {
  const response = await axios.delete(
    `${config.baseUrl}/workspace/${workspaceId}/invite/${inviteId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useWorkspaceMembers = (workspaceId: string) => {
  const { token } = useAuth();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const fetchWorkspaceInviteMutation = useMutation({
    mutationFn: getWorkspaceInvites,
    onSuccess: (data) => {
      setInvites(data);
    },
  });
  const fetchWorkspaceMemberMutation = useMutation({
    mutationFn: getWorkspaceMembers,
    onSuccess: (data) => {
      setMembers(data);
    },
  });
  const createWorkspaceInviteMutation = useMutation({
    mutationFn: postWorkspaceInvite,
    onSuccess: (data) => {
      setInvites((invites) => [...invites, data]);
    },
  });
  const deleteWorkspaceInviteMutation = useMutation({
    mutationFn: deleteWorkspaceInvite,
    onSuccess: (data) => {
      setInvites((invites) => invites.filter((i) => i.id !== data));
    },
  });
  const deleteWorkspaceMemberMutation = useMutation({
    mutationFn: deleteWorkspaceMember,
    onSuccess: (data) => {
      setMembers((members) => members.filter((m) => m.membershipId !== data));
    },
  });
  const memoisedFetchInvites = useMemo(
    () => fetchWorkspaceInviteMutation.mutate,
    [fetchWorkspaceInviteMutation.mutate]
  );
  useEffect(() => {
    if (token && workspaceId)
      memoisedFetchInvites({
        token,
        workspaceId,
      });
  }, [token, memoisedFetchInvites, workspaceId]);

  const memoisedFetchMembers = useMemo(
    () => fetchWorkspaceMemberMutation.mutate,
    [fetchWorkspaceMemberMutation.mutate]
  );
  useEffect(() => {
    if (token && workspaceId)
      memoisedFetchMembers({
        token,
        workspaceId,
      });
  }, [token, memoisedFetchMembers, workspaceId]);

  const inviteMember = ({ email, role }: { email: string; role: Role }) => {
    if (token && workspaceId)
      createWorkspaceInviteMutation.mutate({
        token,
        workspaceId,
        email,
        role,
      });
  };
  const cancelInvite = (inviteId: string) => {
    if (token && workspaceId)
      deleteWorkspaceInviteMutation.mutate({
        token,
        workspaceId,
        inviteId,
      });
  };
  const removeMember = (membershipId: string) => {
    if (token && workspaceId)
      deleteWorkspaceMemberMutation.mutate({
        token,
        workspaceId,
        membershipId,
      });
  };

  return {
    invites,
    fetchWorkspaceInviteMutation,
    createWorkspaceInviteMutation,
    deleteWorkspaceInviteMutation,
    inviteMember,
    inviteMemberStatus: createWorkspaceInviteMutation.status,
    inviteMemberError: createWorkspaceInviteMutation.error,
    cancelInvite,

    members,
    removeMember,
    fetchWorkspaceMemberMutation,
  };
};
