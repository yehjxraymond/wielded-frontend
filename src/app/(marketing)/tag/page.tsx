import { PublicLayout } from "@/components/PublicLayout";
import { wisp } from "@/lib/wisp";
import Link from "next/link";

const title = "Tags";
const description =
  "Blog written in Next.js 14 with page router, powered by Wisp CMS!";

export const metadata = {
  title,
  description,
};

export default async function Page() {
  const result = await wisp.getTags();

  return (
    <PublicLayout>
      <div className="container max-w-6xl pb-24 min-h-screen">
        <div className="max-w-xl text-center m-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-primary mt-16">
            Blog Post Tags on Wielded
          </h1>
        </div>
        <div className="my-10 max-w-6xl text-balance text-center text-xl">
          {result.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className="text-primary mr-2 inline-block"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
