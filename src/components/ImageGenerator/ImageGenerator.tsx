import { useWorkspace } from "@/context/WorkspaceContext";
import { FunctionComponent, useState } from "react";
import { SidebarLayout } from "../Layout";
import { MessageBar } from "../MesageBar";
import { HorizontalSelector } from "@/components/ui/horizontal-selector";
import { useAuth } from "@/context/AuthContext";
import { config } from "@/config";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRandomLoadingMessage } from "./useRandomLoadingMessage";

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

const useImageGenerator = (workspaceId: string) => {
  const { token } = useAuth();
  const generateImageMutation = useMutation({
    mutationFn: postNewImage,
  });
  const generateImage = (prompt: string, options?: ImageGenerationOptions) => {
    if (token)
      generateImageMutation.mutate({ token, workspaceId, prompt, options });
  };
  return { generateImage, generateImageMutation };
};

export const ImageGeneratorInternal: FunctionComponent<{
  workspaceId: string;
}> = ({ workspaceId }) => {
  const { generateImage, generateImageMutation } =
    useImageGenerator(workspaceId);
  const [quality, setQuality] = useState<"standard" | "hd">("standard");
  const [style, setStyle] = useState<"natural" | "vivid">("vivid");
  const [aspectRatio, setAspectRatio] = useState<
    "1024x1024" | "1792x1024" | "1024x1792"
  >("1024x1024");
  const isLoading = generateImageMutation.isPending;
  const randomLoadingMessage = useRandomLoadingMessage();
  return (
    <SidebarLayout title="Generate a new image">
      {!isLoading && (
        <>
          <div className="flex flex-col max-h-dhv overflow-y-auto">
            <div className="container flex flex-col items-center mt-12 text-left">
              <div className="w-full mt-8">
                <div className="font-semibold">Quality</div>
                <HorizontalSelector
                  className="mt-2"
                  choices={[
                    { label: "Standard", value: "standard" },
                    { label: "High Definition", value: "hd" },
                  ]}
                  selected={quality}
                  setSelected={setQuality}
                />
                <div className="font-semibold mt-6">Style</div>
                <HorizontalSelector
                  className="mt-2"
                  choices={[
                    { label: "Artistic", value: "vivid" },
                    { label: "Realistic", value: "natural" },
                  ]}
                  selected={style}
                  setSelected={setStyle}
                />
                <div className="font-semibold mt-6">Aspect Ratio</div>
                <HorizontalSelector
                  className="mt-2"
                  choices={[
                    { label: "Square", value: "1024x1024" },
                    { label: "Landscape", value: "1792x1024" },
                    { label: "Portrait", value: "1024x1792" },
                  ]}
                  selected={aspectRatio}
                  setSelected={setAspectRatio}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 w-full">
            <MessageBar
              placeholder="Describe your image"
              isPending={isLoading}
              onSubmit={(prompt) =>
                generateImage(prompt, {
                  quality,
                  style,
                  size: aspectRatio,
                })
              }
            />
          </div>
        </>
      )}
      {isLoading && (
        <div className="container mt-12 flex flex-col items-center">
          <Skeleton className="w-[600px] h-[300px] mt-10" />
          <div className="mt-4 text-muted-foreground">
            {randomLoadingMessage}
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

export const ImageGenerator: FunctionComponent = () => {
  const workspaceState = useWorkspace();
  // TODO Skeleton loader
  if (workspaceState.state !== "success") return null;
  return (
    <ImageGeneratorInternal workspaceId={workspaceState.currentWorkspace} />
  );
};
