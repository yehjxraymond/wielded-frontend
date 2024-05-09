import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { wisp } from "@/lib/wisp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getTags();
  return [
    {
      url: urlJoin(config.deploymentUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result.tags.map((tag) => {
      return {
        url: urlJoin(config.deploymentUrl, "tag", tag.name),
        lastModified: new Date(),
        priority: 0.8,
      };
    }),
  ];
}
