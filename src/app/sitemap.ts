import { MetadataRoute } from "next";
import { join } from "path";
import { globby } from "globby";

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
  const articlePaths = await globby(["src/app/article/**/page.mdx"]);
  const articleSitemap: MetadataRoute.Sitemap = articlePaths.map((path) => {
    const slug = path.replace("src/app/article/", "").replace("/page.mdx", "");
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
