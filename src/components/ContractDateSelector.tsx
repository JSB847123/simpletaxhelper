import { cn } from "@/lib/utils";

export type ContractDatePeriod = "before" | "after" | "specialRelation";

interface ContractDateSelectorProps {
  value: ContractDatePeriod | null;
  onChange: (period: ContractDatePeriod) => void;
}

const contractDateOptions = [
  {
    id: "before" as const,
    label: "2025년 10월 16일 이전",
    description: "10월 15일까지",
    subtext: "계약금 증빙 내역 가능",
  },
  {
    id: "after" as const,
    label: "2025년 10월 16일부터 그 이후",
    description: "10월 16일 이후",
    subtext: "",
  },
  {
    id: "specialRelation" as const,
    label: "특수관계인간 거래",
    description: "",
    subtext: "",
  },
];

export function ContractDateSelector({
  value,
  onChange,
}: ContractDateSelectorProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-gov-lg font-semibold text-foreground">
        계약일을 선택하시오
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {contractDateOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:shadow-gov hover:border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === option.id
                ? "border-primary bg-secondary shadow-gov"
                : "border-border bg-card"
            )}
          >
            <span className="text-gov-base font-semibold text-foreground">
              {option.label}
            </span>
            <span className="text-gov-sm text-muted-foreground mt-1">
              {option.description}
            </span>
            {option.subtext && (
              <span className="text-gov-xs text-muted-foreground mt-1 italic">
                ({option.subtext})
              </span>
            )}
            {value === option.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
