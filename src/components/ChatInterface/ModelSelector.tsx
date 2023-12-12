import { FunctionComponent } from "react";
import {
  ChatCompletionOptions,
  DEFAULT_GPT3_MODEL,
  DEFAULT_GPT4_MODEL,
} from "./useConversationMessages";
import { HorizontalSelector } from "../ui/horizontal-selector";

export const ModelSelector: FunctionComponent<{
  chatCompletionOptions: ChatCompletionOptions;
  setChatCompletionOptions: (opts: ChatCompletionOptions) => void;
}> = ({ chatCompletionOptions, setChatCompletionOptions }) => {
  return (
    <>
      <div className="font-semibold">Model</div>
      <div className="my-6">
        <HorizontalSelector
          className="mt-2"
          choices={[
            {
              label: "GPT-3.5",
              value: DEFAULT_GPT3_MODEL,
            },
            {
              label: "GPT-4",
              value: DEFAULT_GPT4_MODEL,
            },
          ]}
          selected={chatCompletionOptions.model || DEFAULT_GPT4_MODEL}
          setSelected={(model) =>
            setChatCompletionOptions({
              ...chatCompletionOptions,
              model: model as any,
            })
          }
        />
      </div>
    </>
  );
};
