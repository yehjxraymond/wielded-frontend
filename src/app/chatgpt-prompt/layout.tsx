import { HeaderPublic } from "@/components/HeaderPublic";
import {
  TableOfContents,
  TableOfContentProvider,
} from "@/context/TableOfContentContext";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TableOfContentProvider>
      <HeaderPublic />
      <div className="container flex my-8">
        <div className="prose prose-md dark:prose-invert lg:prose-2xl w-full flex-1">{children}</div>
        <div className="min-w-[250px] hidden lg:block relative ml-10">
          <div className="fixed">
            <TableOfContents />
          </div>
        </div>
      </div>
    </TableOfContentProvider>
  );
}
