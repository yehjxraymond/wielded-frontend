import type { MDXComponents } from "mdx/types";
import { TocHeading } from "./context/TableOfContentContext";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <TocHeading level={1}>{children}</TocHeading>,
    h2: ({ children }) => <TocHeading level={2}>{children}</TocHeading>,
    h3: ({ children }) => <TocHeading level={3}>{children}</TocHeading>,
    ...components,
  };
}
