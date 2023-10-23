import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "./useConversationMessages";

import { codeLanguageSubset } from "@/constants";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const MessageBubble: FunctionComponent<{
  message: Message;
}> = ({ message }) => {
  return (
    <div
      className={cn(
        "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap overflow-x-scroll",
        message.type === "user"
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
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
      >
        {message.streaming ? `${message.content}...` : message.content}
      </ReactMarkdown>
    </div>
  );
};
