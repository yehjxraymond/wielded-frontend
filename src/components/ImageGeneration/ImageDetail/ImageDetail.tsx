import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SidebarLayout } from "../../Layout";
import { ImageQuality, ImageSize, ImageStyle } from "../types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const fetchAllImages = async ({
  token,
  workspaceId,
  imageId,
}: {
  token: string;
  workspaceId: string;
  imageId: string;
}) => {
  const response = await axios.get<{
    id: string;
    name: string;
    prompt: string;
    revised_prompt: string;
    b64: string;
    options?: {
      size?: ImageSize;
      quality?: ImageQuality;
      style?: ImageStyle;
    };
  }>(`${config.baseUrl}/workspace/${workspaceId}/image/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const useImage = (workspaceId: string, imageId: string) => {
  const { token } = useAuth();
  const fetchImagesMutation = useMutation({
    mutationFn: fetchAllImages,
  });
  const memoisedFetchImage = useMemo(
    () => fetchImagesMutation.mutate,
    [fetchImagesMutation.mutate]
  );
  useEffect(() => {
    if (token) memoisedFetchImage({ token, workspaceId, imageId });
  }, [token, workspaceId, imageId, memoisedFetchImage]);

  return { fetchImagesMutation, image: fetchImagesMutation.data };
};

export const ImageDetailInternal: FunctionComponent<{
  workspaceId: string;
  imageId: string;
}> = ({ workspaceId, imageId }) => {
  const { image } = useImage(workspaceId, imageId);
  const [hover, setHover] = useState(false);

  const handleDownload = (event: MouseEvent) => {
    event.preventDefault();
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image?.b64}`;
    link.download = `${image?.name.split(" ").join("_") || "image"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const regenerateLink = `/image/generate?prompt=${encodeURIComponent(
    image?.prompt || ""
  )}&revisedPrompt=${encodeURIComponent(image?.revised_prompt || "")}
    ${image?.options?.size ? `&size=${image.options.size}` : ""}
    ${image?.options?.quality ? `&quality=${image.options.quality}` : ""}
    ${image?.options?.style ? `&style=${image.options.style}` : ""}
    `;
  const regenerateRevisedLink = `/image/generate?prompt=${encodeURIComponent(
    image?.revised_prompt || ""
  )}
    ${image?.options?.size ? `&size=${image.options.size}` : ""}
    ${image?.options?.quality ? `&quality=${image.options.quality}` : ""}
    ${image?.options?.style ? `&style=${image.options.style}` : ""}
    `;

  return (
    <SidebarLayout title={image?.name || "Image"}>
      <div className="container mt-12">
        {image && (
          <div className="flex flex-col lg:flex-row">
            <div
              className="basis-2/3 relative"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={(e) => handleDownload(e)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${image.b64}`}
                className={`object-cover w-full ${
                  hover ? "hover:opacity-75" : ""
                }`}
                alt={image.name}
                style={{ transition: "opacity .2s ease-in-out" }}
              />
              {hover && (
                <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 cursor-pointer">
                  <Download className="text-white h-20 w-20" />
                </div>
              )}
            </div>
            <div className="min-w-[350px] basis-1/3 px-4">
              {image.options?.style && (
                <>
                  <div className="font-semibold mt-4">Style</div>
                  <div className="text-sm">
                    {image.options.style === "vivid" ? "Artistic" : "Realistic"}
                  </div>
                </>
              )}
              {image.options?.quality && (
                <>
                  <div className="font-semibold mt-4">Quality</div>
                  <div className="text-sm">
                    {image.options.quality === "standard"
                      ? "Standard"
                      : "High Definition"}
                  </div>
                </>
              )}
              {image.options?.size && (
                <>
                  <div className="font-semibold mt-4">Size</div>
                  <div className="text-sm">
                    {image.options.size === "1024x1024"
                      ? "Square"
                      : image.options.size === "1024x1792"
                      ? "Portrait"
                      : "Landscape"}
                  </div>
                </>
              )}

              <div className="font-semibold mt-4">Prompt</div>
              <div className="text-sm">{image.prompt}</div>
              <div className="text-right">
                <Link href={regenerateLink}>
                  <Button size="sm">Regenerate Image</Button>
                </Link>
              </div>

              <div className="font-semibold mt-4">Revised Prompt</div>
              <div className="text-sm">{image.revised_prompt}</div>
              <div className="text-right">
                <Link href={regenerateRevisedLink}>
                  <Button size="sm">Regenerate Image</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export const ImageDetail: FunctionComponent<{ imageId: string }> = ({
  imageId,
}) => {
  const workspaceState = useWorkspace();
  // TODO Skeleton loader
  if (workspaceState.state !== "success") return null;
  return (
    <ImageDetailInternal
      workspaceId={workspaceState.currentWorkspace}
      imageId={imageId}
    />
  );
};
