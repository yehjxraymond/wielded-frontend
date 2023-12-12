import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface ImageGenerationOptions {
  quality: "standard" | "hd";
  style: "natural" | "vivid";
  size: "1024x1024" | "1792x1024" | "1024x1792";
}

class ApiError extends Error {
  error?: string;
  statusCode?: string;

  constructor(message: string, error: string, statusCode: string) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
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
  try {
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
  } catch (e) {
    if (e instanceof AxiosError) {
      const data = e.response?.data;
      if (data.message) {
        throw new ApiError(data.message, data.error, data.statusCode);
      }
    }
    throw e;
  }
};

export const useImageGenerator = (workspaceId: string) => {
  const { token } = useAuth();
  const { replace } = useRouter();

  const generateImageMutation = useMutation<
    {
      id: string;
      name: string;
      prompt: string;
      revised_prompt: string;
      b64: string;
    },
    ApiError,
    {
      token: string;
      workspaceId: string;
      prompt: string;
      options?: ImageGenerationOptions | undefined;
    }
  >({
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
