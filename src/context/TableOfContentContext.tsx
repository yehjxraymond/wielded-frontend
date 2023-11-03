"use client";
import {
  createContext,
  useState,
  useContext,
  FunctionComponent,
  ReactNode,
  useEffect,
} from "react";
import { createHash } from "crypto";

interface TableOfContentItem {
  level: number;
  content: ReactNode;
  id: string;
}

interface TableOfContentContextProps {
  tableOfContentItems: TableOfContentItem[];
  addToTableOfContent: (content: ReactNode, id: string, level: number) => void;
}

export const TableOfContentContext = createContext<TableOfContentContextProps>({
  tableOfContentItems: [],
  addToTableOfContent: () => {},
});

export const TableOfContentProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [tableOfContentItems, settableOfContentItems] = useState<
    TableOfContentItem[]
  >([]);

  const addToTableOfContent = (
    content: ReactNode,
    id: string,
    level: number
  ) => {
    settableOfContentItems((prevItems) => {
      if (prevItems.some((item) => item.id === id)) {
        return prevItems;
      }
      return [...prevItems, { content, id, level }];
    });
  };

  return (
    <TableOfContentContext.Provider
      value={{ tableOfContentItems, addToTableOfContent }}
    >
      {children}
    </TableOfContentContext.Provider>
  );
};

export const useTableOfContent = () => useContext(TableOfContentContext);

const hash = (str: string) => createHash("md5").update(str).digest("hex");

// transform a node to a deterministic hash string of length 10
const reactNodeHash = (node: ReactNode): string => {
  if (typeof node === "string") {
    return hash(node);
  }
  if (Array.isArray(node)) {
    return hash(node.map(reactNodeHash).join(""));
  }
  if (typeof node === "object" && node !== null) {
    return hash(
      Object.entries(node)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}:${reactNodeHash(value)}`)
        .join("")
    );
  }
  return "";
};

export const TocHeading: FunctionComponent<{
  level: number;
  children: ReactNode;
}> = ({ level, children }) => {
  const { addToTableOfContent } = useTableOfContent();
  useEffect(() => {
    addToTableOfContent(children, reactNodeHash(children), level);
  }, [addToTableOfContent, children, level]);

  switch (level) {
    case 1:
      return <h1 id={reactNodeHash(children)}>{children}</h1>;
    case 2:
      return <h2 id={reactNodeHash(children)}>{children}</h2>;
    case 3:
      return <h3 id={reactNodeHash(children)}>{children}</h3>;
    // Supported up to h3
    default:
      return <p>{children}</p>;
  }
};

import Link from "next/link";
import { cn } from "@/lib/utils";

export const TableOfContents = () => {
  const { tableOfContentItems } = useTableOfContent();
  const [activeId, setActiveId] = useState<string | null>(null);
  // add scroll event listener when component is mounted
  useEffect(() => {
    const handleScroll = () => {
      const current = tableOfContentItems.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.8;
      });
      if (current) setActiveId(current.id);
    };

    window.addEventListener("scroll", handleScroll);

    // clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tableOfContentItems, setActiveId]);

  return (
    <div>
      <div className="font-semibold text-xl">Table of Contents</div>
      <div className="space-y-1 mt-2">
        {tableOfContentItems.map((item) => {
          const isHighlighted = activeId
            ? item.id === activeId
            : item.id === tableOfContentItems[0].id;
          return (
            <div
              key={item.id}
              className={cn(
                item.level === 2 && "ml-4",
                item.level === 3 && "ml-8"
              )}
            >
              <Link
                href={`#${reactNodeHash(item.content)}`}
                className={cn(
                  "text-lg",
                  isHighlighted ? "font-medium" : "text-accent-foreground"
                )}
              >
                {item.content}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
