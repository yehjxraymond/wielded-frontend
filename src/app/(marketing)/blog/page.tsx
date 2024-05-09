import { BlogPostsPreview } from "@/components/Blog/BlogPostPreview";
import { BlogPostsPagination } from "@/components/Blog/BlogPostsPagination";
import { PublicLayout } from "@/components/PublicLayout";
import { wisp } from "@/lib/wisp";

export const metadata = {
  title: "wielded AI Blog",
  description:
    "Tips on AI models like ChatGPT, Claude and Gemini Pro. Learn how to leverage AI to scale your business.",
};

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({ limit: 6, page });
  return (
    <PublicLayout>
      <div className="container">
        <div className="max-w-xl text-center m-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-primary mt-16">
            Wielded AI Blog
          </h1>
          <p className="mt-2">
            Tips on AI models like ChatGPT, Claude and Gemini Pro. Learn how to
            leverage AI to scale your business.
          </p>
        </div>
        <BlogPostsPreview posts={result.posts} />
        <BlogPostsPagination pagination={result.pagination} />
      </div>
    </PublicLayout>
  );
};

export default Page;
