import { MetadataRoute } from "next";
import { join } from "path";
import { globby } from "globby";
import { readFileSync } from "fs";
import { fetchArticlePaths } from "@/lib/fetchArticles";

const baseUrl = "https://wielded.com";
const url = (path: string) => join(baseUrl, path);

// TODO sitemap for generated conversations
const staticSitemap: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: url("login"),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articlePaths = await fetchArticlePaths();
  const articleSitemap: MetadataRoute.Sitemap = articlePaths.map((path) => {
    const match = path.match(/article\/(.*)\/page.mdx/);
    const slug = match?.[1] ?? "unknown";
    const articlePath = url(`article/${slug}`);
    return {
      url: articlePath,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticSitemap, ...articleSitemap];
}
