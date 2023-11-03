export default function MdxLayout(props: any) {
  // { children }: { children: React.ReactNode }
  // Create any shared layout or styles here
  return (
    <div className="prose dark:prose-invert max-w-prose">{props.children}</div>
  );
}
