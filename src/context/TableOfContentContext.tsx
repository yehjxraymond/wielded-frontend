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
  }, [addToTableOfContent, children]);

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
      <h3>Table of Contents</h3>
      {tableOfContentItems.map((item) => (
        <Link
          href={`#${reactNodeHash(item.content)}`}
          key={item.id}
          className={item.id === activeId ? "bg-black" : ""}
        >
          {item.content} - {item.level}
        </Link>
      ))}
    </div>
  );
};
