import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";

interface ShareStatus {
  id: string; // share id
  shareSystemMessages: boolean;
  snapshot?: unknown;
  createdAt: string;
  updatedAt: string;
  conversation: {
    id: string;
  };
}

export interface SharedStatus extends ShareStatus {
  state: "shared";
}

export interface NotSharedStatus {
  state: "not_shared";
}

const shareConversationApi = async ({
  token,
  workspaceId,
  conversationId,
  shareSystemMessages,
  snapshot,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
  shareSystemMessages?: boolean;
  snapshot?: boolean;
}) => {
  const response = await axios.post(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/share`,
    { shareSystemMessages, snapshot },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const unshareConversationApi = async ({
  token,
  workspaceId,
  conversationId,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
}) => {
  const response = await axios.delete(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/share`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const getShareStatusApi = async ({
  token,
  workspaceId,
  conversationId,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
}) => {
  const response = await axios.get<ShareStatus>(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/share`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const putShareStatusApi = async ({
  token,
  workspaceId,
  conversationId,
  shareSystemMessages,
  snapshot,
}: {
  token: string;
  workspaceId: string;
  conversationId: string;
  shareSystemMessages?: boolean;
  snapshot?: boolean;
}) => {
  const response = await axios.put<ShareStatus>(
    `${config.baseUrl}/workspace/${workspaceId}/conversation/${conversationId}/share`,
    { shareSystemMessages, snapshot },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useShareConversation = (
  workspaceId: string,
  conversationId: string
) => {
  const [shareStatus, setShareStatus] = useState<
    SharedStatus | NotSharedStatus | undefined
  >();
  const { token } = useAuth();

  const shareConversationMutation = useMutation({
    mutationFn: shareConversationApi,
    onSuccess: () => {
      if (token)
        memoisedFetch({
          token,
          workspaceId,
          conversationId,
        });
    },
  });

  const unshareConversationMutation = useMutation({
    mutationFn: unshareConversationApi,
    onSuccess: () => {
      if (token)
        memoisedFetch({
          token,
          workspaceId,
          conversationId,
        });
    },
  });

  const fetchShareStatusMutation = useMutation({
    mutationFn: getShareStatusApi,
    onSuccess: (data) => {
      setShareStatus({ ...data, state: "shared" });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data.message === "Shared conversation not found") {
          setShareStatus({ state: "not_shared" });
        }
      } else {
        throw error;
      }
    },
  });

  const putShareStatusMutation = useMutation({
    mutationFn: putShareStatusApi,
    onSuccess: () => {
      if (token)
        memoisedFetch({
          token,
          workspaceId,
          conversationId,
        });
    },
  });

  const shareConversation = (
    id: string,
    shareSystemMessages?: boolean,
    snapshot?: boolean
  ) => {
    if (token)
      shareConversationMutation.mutate({
        token,
        workspaceId,
        conversationId: id,
        shareSystemMessages,
        snapshot,
      });
  };

  const unshareConversation = (id: string) => {
    if (token)
      unshareConversationMutation.mutate({
        token,
        workspaceId: conversationId,
        conversationId: id,
      });
  };

  const fetchStateStatus = (id: string) => {
    if (token)
      fetchShareStatusMutation.mutate({
        token,
        workspaceId: conversationId,
        conversationId: id,
      });
  };

  const updateShareStatus = (
    id: string,
    {
      shareSystemMessages,
      snapshot,
    }: { shareSystemMessages?: boolean; snapshot?: boolean }
  ) => {
    if (token)
      putShareStatusMutation.mutate({
        token,
        workspaceId: conversationId,
        conversationId: id,
        shareSystemMessages,
        snapshot,
      });
  };

  const memoisedFetch = useMemo(
    () => fetchShareStatusMutation.mutate,
    [fetchShareStatusMutation.mutate]
  );

  useEffect(() => {
    if (token && workspaceId && conversationId)
      memoisedFetch({
        token,
        workspaceId,
        conversationId,
      });
  }, [token, memoisedFetch, workspaceId, conversationId]);

  return {
    shareStatus,
    shareConversation,
    unshareConversation,
    fetchStateStatus,
    shareConversationMutation,
    unshareConversationMutation,
    fetchShareStatusMutation,
    updateShareStatus,
  };
};
