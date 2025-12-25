import { cn } from "@/lib/utils";
import type { ContractDatePeriod } from "./ContractDateSelector";

interface HouseCountSelectorProps {
  contractPeriod: ContractDatePeriod;
  value: number | null;
  onChange: (count: number) => void;
}

const houseCountOptionsBefore = [
  { value: 1, label: "1~2주택", description: "취득하는 주택 수 포함" },
  { value: 3, label: "3주택", description: "취득하는 주택 수 포함" },
  { value: 4, label: "4주택 이상", description: "취득하는 주택 수 포함" },
];

const houseCountOptionsAfter = [
  { value: 1, label: "1주택", description: "취득하는 주택 수 포함" },
  { value: 2, label: "2주택", description: "취득하는 주택 수 포함" },
  { value: 3, label: "3주택 이상", description: "취득하는 주택 수 포함" },
];

export function HouseCountSelector({
  contractPeriod,
  value,
  onChange,
}: HouseCountSelectorProps) {
  const options =
    contractPeriod === "before"
      ? houseCountOptionsBefore
      : houseCountOptionsAfter;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-gov-lg font-semibold text-foreground">
        주택 수는? (취득하는 주택 수 포함)
      </h2>
      <div className={cn(
        "grid gap-3",
        contractPeriod === "after" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
      )}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
              "hover:shadow-gov hover:border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === option.value
                ? "border-primary bg-secondary shadow-gov"
                : "border-border bg-card"
            )}
          >
            <span className="text-gov-lg font-bold text-foreground">
              {option.label}
            </span>
            <span className="text-2xs text-muted-foreground mt-1">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
