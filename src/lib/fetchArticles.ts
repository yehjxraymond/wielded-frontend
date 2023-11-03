import { globby } from "globby";

export const fetchArticlePaths = async () => {
  const articlePaths = await globby(["**/article/**/page.mdx"]);
  return articlePaths;
};
