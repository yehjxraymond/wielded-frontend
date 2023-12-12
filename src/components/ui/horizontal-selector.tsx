import { cn } from "@/lib/utils";

export const HorizontalSelector = <T extends unknown>({
  choices,
  selected,
  setSelected,
  className,
}: {
  choices: { label: string; value: T }[];
  selected: T;
  setSelected: (value: T) => void;
  className?: string;
}) => {
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
