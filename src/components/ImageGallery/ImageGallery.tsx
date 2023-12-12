import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, useEffect, useMemo } from "react";
import { SidebarLayout } from "../Layout";
import Link from "next/link";

interface ImageGenerationOptions {
  quality: "standard" | "hd";
  style: "natural" | "vivid";
  size: "1024x1024" | "1792x1024" | "1024x1792";
}

const fetchAllImages = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<
    {
      id: string;
      name: string;
      prompt: string;
      revised_prompt: string;
      b64: string;
    }[]
  >(`${config.baseUrl}/workspace/${workspaceId}/image`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const useGalleryImages = (workspaceId: string) => {
  const { token } = useAuth();
  const fetchImagesMutation = useMutation({
    mutationFn: fetchAllImages,
  });
  const memoisedFetchImage = useMemo(
    () => fetchImagesMutation.mutate,
    [fetchImagesMutation.mutate]
  );
  useEffect(() => {
    if (token) memoisedFetchImage({ token, workspaceId });
  }, [token, workspaceId, memoisedFetchImage]);

  return { fetchImagesMutation, images: fetchImagesMutation.data };
};

export const ImageGeneratorInternal: FunctionComponent<{
  workspaceId: string;
}> = ({ workspaceId }) => {
  const { images } = useGalleryImages(workspaceId);

  return (
    <SidebarLayout title="Gallery">
      <div className="container items-center mt-12 text-left">
        {images && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.name}>
                <Link href={`/image/${image.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${image.b64}`}
                    className="object-cover w-full h-[250px] grayscale hover:grayscale-0 transition-all cursor-pointer"
                    alt={image.name}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export const ImageGallery: FunctionComponent = () => {
  const workspaceState = useWorkspace();
  // TODO Skeleton loader
  if (workspaceState.state !== "success") return null;
  return (
    <ImageGeneratorInternal workspaceId={workspaceState.currentWorkspace} />
  );
};
