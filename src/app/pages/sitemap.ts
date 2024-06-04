import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

const staticPaths = [
  "privacy",
  "terms",
  "contact",
  "chat-with-documents",
  "chatgpt-for-teams",
  "chatgpt-ui-for-azure-openai",
  "creating-custom-ai-chatbot-with-persona",
  "image-generation-with-dalle3",
  "multi-model-ai-lab-for-education",
  "teaching-generative-ai-for-educator",
  "ai-content-mastery-course",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = staticPaths.map((path) => ({
    url: urlJoin(config.deploymentUrl, path),
    lastModified: new Date(),
    priority: 0.9,
  }));
  return paths;
}
