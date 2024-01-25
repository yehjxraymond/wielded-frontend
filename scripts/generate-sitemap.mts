import fs from "fs";
import { globby } from "globby";

const baseUrl = "https://wielded.com";
const url = (path: string) => `${baseUrl}/${path}`;
const date = new Date().toISOString();

const staticPaths = [
  "", // root
  "privacy",
  "terms",
  "login",
  "for-content-creator",
  "for-customer-support",
  "for-digital-marketer",
  "for-educator",
  "for-product-manager",
  "for-produce-team",
  "for-sales-team",
  "chatgpt-ui-for-azure-openai",
  "chatgpt-for-teams",
  "image-generation-with-dalle3",
  "teaching-generative-ai-for-educator",
  "creating-custom-ai-chatbot-with-persona",
  "chat-with-documents",
  "contact",
];

const urlXml = (url: string, priority = 0.8) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;

(async () => {
  const staticSitemapSegment = staticPaths
    .map((path) => urlXml(url(path), 1))
    .join("");
  const promptMdxPaths = await globby(["src/app/chatgpt-prompt/**/page.mdx"]);
  const promptSitemapSegment: string = promptMdxPaths
    .map((path) => {
      const match = path.match(/chatgpt-prompt\/(.*)\/page.mdx/);
      const slug = match?.[1] ?? "";
      const promptUrl = url(`chatgpt-prompt/${slug}`);
      return urlXml(promptUrl);
    })
    .join("");
  const articleMdxPaths = await globby(["src/app/article/**/page.mdx"]);
  const articleSitemapSegment: string = articleMdxPaths
    .map((path) => {
      const match = path.match(/article\/(.*)\/page.mdx/);
      const slug = match?.[1] ?? "";
      const articleUrl = url(`article/${slug}`);
      return urlXml(articleUrl);
    })
    .join("");

  const sitemapUrl = [
    staticSitemapSegment,
    articleSitemapSegment,
    promptSitemapSegment,
  ].join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrl}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
})();
