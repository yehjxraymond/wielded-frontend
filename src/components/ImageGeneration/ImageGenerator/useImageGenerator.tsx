import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ImageGenerationOptions {
  quality: "standard" | "hd";
  style: "natural" | "vivid";
  size: "1024x1024" | "1792x1024" | "1024x1792";
}

const postNewImage = async ({
  token,
  workspaceId,
  prompt,
  options,
}: {
  token: string;
  workspaceId: string;
  prompt: string;
  options?: ImageGenerationOptions;
}) => {
  const response = await axios.post<{
    id: string;
    name: string;
    prompt: string;
    revised_prompt: string;
    b64: string;
  }>(
    `${config.baseUrl}/workspace/${workspaceId}/image`,
    { prompt, options },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useImageGenerator = (workspaceId: string) => {
  const { token } = useAuth();
  const { replace } = useRouter();

  const generateImageMutation = useMutation({
    mutationFn: postNewImage,
    onSuccess: (data) => {
      replace(`/image/${data.id}`);
    },
  });
  const generateImage = (prompt: string, options?: ImageGenerationOptions) => {
    if (token)
      generateImageMutation.mutate({ token, workspaceId, prompt, options });
  };
  return { generateImage, generateImageMutation };
};
