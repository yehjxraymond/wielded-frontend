import { TableOfContents, TableOfContentProvider } from "@/context/TableOfContentContext";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TableOfContentProvider>
      <div className="fixed bg-white">
        <TableOfContents />
      </div>
      <div className="prose dark:prose-invert prose-2xl">{children}</div>
    </TableOfContentProvider>
  );
}
