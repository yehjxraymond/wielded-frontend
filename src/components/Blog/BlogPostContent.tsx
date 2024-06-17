"use client";
import { GetPostResult } from "@/lib/wisp";
import Link from "next/link";
import sanitize from "sanitize-html";

export const PostContent = ({ content }: { content: string }) => {
  return (
    <div
      className="blog-content mx-auto"
      dangerouslySetInnerHTML={{
        __html: sanitize(content, {
          allowedTags: [
            "b",
            "i",
            "em",
            "strong",
            "a",
            "img",
            "h1",
            "h2",
            "h3",
            "code",
            "pre",
            "p",
            "li",
            "ul",
            "ol",
            "blockquote",
            // tables
            "td",
            "th",
            "table",
            "tr",
            "tbody",
            "thead",
            "tfoot",
          ],
        }),
      }}
    ></div>
  );
};

export const BlogPostContent = ({ post }: { post: GetPostResult["post"] }) => {
  if (!post) return null;
  const { title, createdAt, content, tags } = post;
  return (
    <div>
      <div className="prose lg:prose-xl dark:prose-invert mx-auto lg:prose-h1:text-4xl mb-10 lg:mt-20">
        <h1>{title}</h1>
        <PostContent content={content} />

        <div className="mt-10 opacity-40 text-sm">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className="text-primary mr-2"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className="text-sm opacity-40 mt-4">
          {Intl.DateTimeFormat("en-US").format(new Date(createdAt))}
        </div>
        <Link href="/blog" className="no-underline">
          <div className="my-10 text-sm">← Back to blog</div>
        </Link>
      </div>
    </div>
  );
};
