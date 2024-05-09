import { BlogPostsPreview } from "@/components/Blog/BlogPostPreview";
import { BlogPostsPagination } from "@/components/Blog/BlogPostsPagination";
import { PublicLayout } from "@/components/PublicLayout";
import { wisp } from "@/lib/wisp";

interface Params {
  slug: string;
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  return {
    title: `#${slug}`,
    description: `Posts tagged with #${slug}`,
  };
}

const Page = async ({
  params: { slug },
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({ limit: 6, tags: [slug], page });
  return (
    <PublicLayout>
      <div className="container">
        <div className="max-w-xl text-center m-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-primary mt-16">
            Blog Posts tagged with #{slug}
          </h1>
          <p className="mt-2">
            Tips on AI models like ChatGPT, Claude and Gemini Pro. Learn how to
            leverage AI to scale your business.
          </p>
        </div>
        <BlogPostsPreview posts={result.posts} />
        <BlogPostsPagination
          pagination={result.pagination}
          basePath={`/tag/${slug}/?page=`}
        />
      </div>
    </PublicLayout>
  );
};

export default Page;
