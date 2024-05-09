import { BlogPostContent } from "@/components/Blog/BlogPostContent";
import { HeaderPublic } from "@/components/HeaderPublic";
import { PublicLayout } from "@/components/PublicLayout";
import { wisp } from "@/lib/wisp";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  if (!result || !result.post) {
    return notFound();
  }

  return (
    <PublicLayout>
      <div className="container mx-auto">
        <BlogPostContent post={result.post} />
      </div>
    </PublicLayout>
  );
};

export default Page;
