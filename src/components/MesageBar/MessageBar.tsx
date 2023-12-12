import { Send } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

export interface MessageBarProps {
  placeholder: string;
  isPending: boolean;
  onSubmit: (value: string) => void;
  initialText?: string;
}

export const MessageBar: FunctionComponent<MessageBarProps> = ({
  placeholder,
  isPending,
  onSubmit,
  initialText = "",
}) => {
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState(initialText);

  const handleSubmit = () => {
    if (isPending) return;
    onSubmit(text);
    setText("");
    setRowNum(1);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  useEffect(() => {
    const lineCount = (text.match(/\n/g) || []).length + 1;
    const lineByCharacters = text.length / 90;
    setRowNum(Math.min(15, Math.max(lineCount, lineByCharacters, 1)));
  }, [initialText, text]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center border border-input px-3 py-2 rounded-md bg-background mx-4">
          <Textarea
            className="focus-visible:ring-0 focus-visible:ring-offset-0 border-0 resize-none min-h-0"
            placeholder={placeholder}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={rowNum}
            value={text}
          />
          <div
            className={
              isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }
            onClick={handleSubmit}
          >
            <Send className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
