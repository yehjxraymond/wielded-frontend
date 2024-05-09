import { SharedConversationDto } from "@/components/SharedConversation";
import { config } from "@/config";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Shared Conversation on Wielded";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const getSharedConversationData = async (sharedConversationId: string) => {
  const res = await fetch(`${config.baseUrl}/share/${sharedConversationId}`, {
    next: { revalidate: 5000 },
  });
  return res.json() as Promise<SharedConversationDto>;
};

// Image generation
export default async function Image({
  params: { sharedConversationId },
}: {
  params: { sharedConversationId: string };
}) {
  // Font
  const interSemiBold = await fetch(
    new URL("Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const { name } = await getSharedConversationData(sharedConversationId);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          display: "flex",
          background: "white",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 32,
            margin: 40,
          }}
        >
          Wielded
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            fontSize: 20,
            top: 0,
            paddingTop: 170,
            paddingLeft: 250,
            paddingRight: 40,
            paddingBottom: 40,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            textAlign: "right",
          }}
        >
          Shared Conversation
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            fontSize: 64,
            top: 200,
            paddingLeft: 250,
            paddingRight: 40,
            paddingBottom: 40,
            width: "100%",
            height: 380,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            textAlign: "right",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {name}
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        // Register the Inter font
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
