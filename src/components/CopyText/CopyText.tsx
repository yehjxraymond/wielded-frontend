import { cn } from "@/lib/utils";
import { Check, Clipboard } from "lucide-react";
import { FunctionComponent, useState } from "react";

export const CopyText: FunctionComponent<{
  text: string;
  size?: "sm" | "md";
}> = ({ text, size = "md" }) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div
      className="cursor-pointer bg-secondary p-1 rounded inline-block font-medium"
      onClick={async () => {
        navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1500);
        });
      }}
    >
      {isCopied ? (
        <div
          className={cn("flex items-center mx-2", size == "sm" && "text-sm")}
        >
          {text}
          <Check className="ml-2 inline w-4 h-4" />
        </div>
      ) : (
        <div
          className={cn("flex items-center mx-2", size == "sm" && "text-sm")}
        >
          {text}
          <Clipboard className="ml-2 w-4 h-4" />
        </div>
      )}
    </div>
  );
};
