import { BlogPostContent } from "@/components/Blog/BlogPostContent";
import { PublicLayout } from "@/components/PublicLayout";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RelatedPosts } from "@/components/Blog/RelatedPosts";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  const result = await wisp.getPost(slug);
  if (!result || !result.post) {
    return {
      title: "Blog post not found",
    };
  }

  const { title, description, image } = result.post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
interface Params {
  slug: string;
}

const Page = async ({ params: { slug } }: { params: Params }) => {
  const result = await wisp.getPost(slug);
  const { posts: relatedPosts } = await wisp.getRelatedPosts({
    slug,
    limit: 5,
  });

  if (!result || !result.post) {
    return notFound();
  }

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-4xl">
        <BlogPostContent post={result.post} />
        <CtaSeparator source="blog-post" className="border shadow rounded-lg py-10 sm:py-20" title="Stop choosing between GPT-4o and Claude" subtitle="Leverage both for maximum productivity on Wielded's AI workspace." />
        <RelatedPosts posts={relatedPosts} />
        <Link href="/blog" className="no-underline">
          <div className="my-10 text-sm">← Back to blog</div>
        </Link>
      </div>
    </PublicLayout>
  );
};

export default Page;
