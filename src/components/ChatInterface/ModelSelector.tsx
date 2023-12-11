import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import {
    ChatCompletionOptions,
    DEFAULT_GPT3_MODEL,
    DEFAULT_GPT4_MODEL,
} from "./useConversationMessages";

export const ModelSelector: FunctionComponent<{
  chatCompletionOptions: ChatCompletionOptions;
  setChatCompletionOptions: (opts: ChatCompletionOptions) => void;
}> = ({ chatCompletionOptions, setChatCompletionOptions }) => {
  const isGpt3 = chatCompletionOptions.model === DEFAULT_GPT3_MODEL;
  return (
    <>
      <div className="font-semibold">Model</div>
      <div className="my-6">
        <div className="text-sm">
          <div
            className={cn(
              "inline-block py-2 px-3 rounded-l-md cursor-pointer",
              isGpt3 ? "bg-accent-foreground" : "bg-secondary"
            )}
            onClick={() =>
              setChatCompletionOptions({
                ...chatCompletionOptions,
                model: DEFAULT_GPT3_MODEL,
              })
            }
          >
            GPT-3.5
          </div>
          <div
            className={cn(
              "inline-block py-2 px-3 rounded-r-md cursor-pointer",
              !isGpt3 ? "bg-accent-foreground" : "bg-secondary"
            )}
            onClick={() =>
              setChatCompletionOptions({
                ...chatCompletionOptions,
                model: DEFAULT_GPT4_MODEL,
              })
            }
          >
            GPT-4
          </div>
        </div>
      </div>
    </>
  );
};
