import { useActiveWorkspace } from "@/context/ActiveWorkspaceContext";
import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export interface UseVoiceUploadProps {
  personaId?: string;
  onVoiceTranscribed: (text: string) => void;
}

const postAudio = betterAxiosError(
  async ({
    formData,
    workspaceId,
  }: {
    formData: FormData;
    workspaceId: string;
  }) => {
    const { data } = await authenticatedAxios.post<{ text: string }>(
      `/workspace/${workspaceId}/conversation/upload-audio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.text;
  }
);

export const useVoiceUpload = ({
  onVoiceTranscribed,
  personaId,
}: UseVoiceUploadProps) => {
  const { features, activeWorkspaceId } = useActiveWorkspace();
  const uploadAudioMutation = useMutation({
    mutationFn: postAudio,
    onSuccess: (text) => {
      onVoiceTranscribed(text);
    },
  });
  const voiceIntegrationId =
    features.audio.integrations && features.audio.integrations.length > 0
      ? features.audio.integrations[0].id
      : "";
  const mutateUploadAudio = uploadAudioMutation.mutate;
  const uploadAudio = useCallback(
    (blob: Blob) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      const file = new File([blob], "audio.webm", {
        type: blob.type,
        lastModified: Date.now(),
      });
      const formData = new FormData();
      formData.append("files", file);
      formData.append("integrationId", voiceIntegrationId);
      if (personaId) formData.append("personaId", personaId);
      mutateUploadAudio({ formData, workspaceId: activeWorkspaceId });
    },
    [personaId, mutateUploadAudio, activeWorkspaceId, voiceIntegrationId]
  );
  return {
    uploadAudioMutation,
    uploadAudio,
  };
};
