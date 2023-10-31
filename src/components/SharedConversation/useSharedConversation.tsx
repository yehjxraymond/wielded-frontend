import { config } from "@/config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo } from "react";

interface SharedMessage {
  id: string;
  type: "user" | "system" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedConversation {
  id: string;
  name?: string;
  shareSystemMessages?: boolean;
  createdAt: string;
  updatedAt: string;
  messages: SharedMessage[];
}

const getShareStatusApi = async ({
  sharedConversationId,
}: {
  sharedConversationId: string;
}) => {
  const response = await axios.get<SharedConversation>(
    `${config.baseUrl}/share/${sharedConversationId}`
  );
  return response.data;
};

export const useSharedConversation = (sharedConversationId: string) => {
  const fetchSharedConversationMutation = useMutation({
    mutationFn: getShareStatusApi,
  });

  const memoisedFetch = useMemo(
    () => fetchSharedConversationMutation.mutate,
    [fetchSharedConversationMutation.mutate]
  );

  useEffect(() => {
    if (sharedConversationId)
      memoisedFetch({
        sharedConversationId,
      });
  }, [memoisedFetch, sharedConversationId]);

  return {
    fetchSharedConversationMutation,
  };
};
