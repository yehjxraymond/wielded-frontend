import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HorizontalSelector = ({
  choices,
  selected,
  setSelected,
  className,
}: {
  choices: { label: string; value: string }[];
  selected?: string;
  setSelected: (value: string) => void;
  className?: string;
}) => {
  const isTooManyChoices = choices.length > 5;

  if (isTooManyChoices) {
    return (
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a choice" />
        </SelectTrigger>
        <SelectContent>
          {choices.map((choice, index) => (
            <SelectItem key={index} value={choice.value}>
              <span className="whitespace-nowrap text-xs">{choice.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="text-sm">
      {choices.map((choice, index) => (
        <div
          key={index}
          className={cn(
            "inline-block py-2 px-3 cursor-pointer",
            choice.value === selected ? "bg-accent-foreground" : "bg-secondary",
            index === 0 ? "rounded-l-sm" : "",
            index === choices.length - 1 ? "rounded-r-sm" : "",
            className
          )}
          onClick={() => setSelected(choice.value)}
        >
          {choice.label}
        </div>
      ))}
    </div>
  );
};
