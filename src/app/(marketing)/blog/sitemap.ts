import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { wisp } from "@/lib/wisp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getPosts();
  return [
    {
      url: urlJoin(config.deploymentUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result.posts.map((post) => {
      return {
        url: urlJoin(config.deploymentUrl, "blog", post.slug),
        lastModified: new Date(post.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}
