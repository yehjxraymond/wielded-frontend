"use client";

import { ImageDetail } from "@/components/ImageGeneration/ImageDetail";

export default function ImagePage({ params }: { params: { imageId: string } }) {
  return (
    <main>
      <ImageDetail imageId={params.imageId} />
    </main>
  );
}
