import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export interface UseVoiceUploadProps {
  personaId?: string;
  onVoiceTranscribed: (text: string) => void;
}

const postAudio = betterAxiosError(async (formData: FormData) => {
  const { data } = await authenticatedAxios.post<{ text: string }>(
    "/file-loader/upload-audio",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.text;
});

export const useVoiceUpload = ({
  onVoiceTranscribed,
  personaId,
}: UseVoiceUploadProps) => {
  const uploadAudioMutation = useMutation({
    mutationFn: postAudio,
    onSuccess: (text) => {
      onVoiceTranscribed(text);
    },
  });
  const mutateUploadAudio = uploadAudioMutation.mutate;
  const uploadAudio = useCallback(
    (blob: Blob) => {
      const file = new File([blob], "audio.webm", {
        type: blob.type,
        lastModified: Date.now(),
      });
      const formData = new FormData();
      formData.append("files", file);
      if (personaId) formData.append("personaId", personaId);
      mutateUploadAudio(formData);
    },
    [personaId, mutateUploadAudio]
  );
  return {
    uploadAudioMutation,
    uploadAudio,
  };
};
