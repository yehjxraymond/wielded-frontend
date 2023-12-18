import { HorizontalSelector } from "@/components/ui/horizontal-selector";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useSearchParams } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import { SidebarLayout } from "../../Layout";
import { MessageBar } from "../../MesageBar";
import { Skeleton } from "../../ui/skeleton";
import { ImageQuality, ImageSize, ImageStyle } from "../types";
import { useImageGenerator } from "./useImageGenerator";
import { useRandomLoadingMessage } from "./useRandomLoadingMessage";
import { ConversationalError } from "@/components/ChatInterface/ConversationalError";
import { LearnMoreOverlay } from "@/components/LearnMoreOverlay";

export const ImageGeneratorInternal: FunctionComponent<{
  workspaceId: string;
}> = ({ workspaceId }) => {
  const searchParams = useSearchParams();

  const { generateImage, generateImageMutation } =
    useImageGenerator(workspaceId);
  const [quality, setQuality] = useState<ImageQuality>("standard");
  const [style, setStyle] = useState<ImageStyle>("vivid");
  const [aspectRatio, setAspectRatio] = useState<ImageSize>("1024x1024");
  const isLoading = generateImageMutation.isPending;
  const randomLoadingMessage = useRandomLoadingMessage();
  const error = generateImageMutation.error;

  useEffect(() => {
    const queryQuality = searchParams.get("quality");
    const queryStyle = searchParams.get("style");
    const queryAspectRatio = searchParams.get("size");

    console.log(queryQuality, queryQuality?.length);

    if (queryQuality && ["standard", "hd"].includes(queryQuality)) {
      setQuality(queryQuality as ImageQuality);
    }

    if (queryStyle && ["vivid", "natural"].includes(queryStyle)) {
      setStyle(queryStyle as ImageStyle);
    }

    if (
      queryAspectRatio &&
      ["1024x1024", "1792x1024", "1024x1792"].includes(queryAspectRatio)
    ) {
      setAspectRatio(queryAspectRatio as ImageSize);
    }
  }, [searchParams]);

  return (
    <SidebarLayout title="Generate a new image">
      {!isLoading && (
        <>
          <div className="flex flex-col max-h-dhv overflow-y-auto">
            <div className="container flex flex-col items-center mt-12 text-left">
              <div className="w-full">
                <LearnMoreOverlay
                  title="Learn more about Image Generator"
                  videoUrl="https://www.youtube-nocookie.com/embed/rP7_STmtiHc?si=R40ravuRXInibtSl"
                  className="mb-4"
                />
                {error && (
                  <div className="my-4">
                    <ConversationalError
                      error={error.error}
                      message={error.message}
                      statusCode={error.statusCode}
                    />
                  </div>
                )}
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
              initialText={searchParams.get("prompt") || ""}
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
