import { codeLanguageSubset } from "@/constants";
import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Message } from "../useConversationMessages";
import { code } from "./CodeBlock";
import { File } from "lucide-react";

const p: Components["p"] = (props) => {
  return <p className="whitespace-pre-wrap">{props?.children}</p>;
};

export const MessageBubble: FunctionComponent<{
  message: Message;
}> = ({ message }) => {
  const isFile =
    message.type === "file_upload" || message.type === "file_upload_system";
  return (
    <div
      className={cn(
        "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm overflow-x-auto prose dark:prose-invert",
        message.type === "user" || isFile
          ? "ml-auto bg-primary text-primary-foreground prose-strong:text-primary-foreground"
          : "bg-muted"
      )}
    >
      {isFile && (
        <div className="flex items-center">
          <File className="h-4 w-4 mr-2" />
          {message.fileName}
        </div>
      )}
      {!isFile && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, [remarkMath]]}
          rehypePlugins={[
            rehypeKatex,
            [
              rehypeHighlight,
              {
                detect: true,
                ignoreMissing: true,
                subset: codeLanguageSubset,
              },
            ],
          ]}
          components={{ code, p }}
        >
          {message.streaming ? `${message.content}...` : message.content}
        </ReactMarkdown>
      )}
    </div>
  );
};
