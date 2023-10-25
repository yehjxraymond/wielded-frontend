import { Check, Clipboard } from "lucide-react";
import React, { FunctionComponent, useRef, useState } from "react";
import { Components } from "react-markdown";

export const CodeBlock = ({
  lang,
  codeChildren,
}: {
  lang: string;
  codeChildren: React.ReactNode | React.ReactNode[];
}) => {
  const codeRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-background rounded-md my-2">
      <CodeBar lang={lang} codeRef={codeRef} />
      <div className="p-4 overflow-y-auto">
        <code
          ref={codeRef}
          className={`!whitespace-pre hljs language-${lang} text-foreground`}
        >
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

const CodeBarInternal: FunctionComponent<{
  lang: string;
  codeRef: React.RefObject<HTMLElement>;
}> = ({ lang, codeRef }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  return (
    <div className="flex items-center relative bg-accent text-accent-foreground px-4 py-2 text-xs font-sans rounded-t-md">
      <span>{lang}</span>
      <button
        className="flex ml-auto gap-2"
        aria-label="copy codeblock"
        onClick={async () => {
          const codeString = codeRef.current?.textContent;
          if (codeString)
            navigator.clipboard.writeText(codeString).then(() => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1500);
            });
        }}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
          </>
        ) : (
          <>
            <Clipboard className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
export const CodeBar = React.memo(CodeBarInternal);

export const code: Components["code"] = (props) => {
  const { className, children } = props;
  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1];
  const isInlineCode = !className;

  // TODO Fix issue with <div> in <p>: https://github.com/remarkjs/react-markdown/issues/184
  return isInlineCode ? (
    <code className="italic">{children}</code>
  ) : (
    <CodeBlock lang={lang || "text"} codeChildren={children} />
  );
};
