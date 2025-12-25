import { cn } from "@/lib/utils";

export type PropertyPriceRange = "under6" | "6to9" | "over9" | "publicUnder1" | "customPrice";

interface PropertyPriceRangeSelectorProps {
  value: PropertyPriceRange | null;
  onChange: (range: PropertyPriceRange) => void;
  showSimplifiedOptions?: boolean;
}

const priceRangeOptions = [
  {
    id: "under6" as const,
    label: "6억 원 이하",
    description: "",
  },
  {
    id: "6to9" as const,
    label: "6억 원 초과, 9억 원 이하",
    description: "",
  },
  {
    id: "over9" as const,
    label: "9억 원 초과",
    description: "",
  },
  {
    id: "publicUnder1" as const,
    label: "공시가격 1억 이하 취득 주택",
    description: "재건축, 재개발 지역 아닌 지역에 한함",
  },
];

const simplifiedPriceRangeOptions = [
  {
    id: "customPrice" as const,
    label: "취득가액 (원) 입력",
    description: "",
  },
  {
    id: "publicUnder1" as const,
    label: "공시가격 1억 원 이하 취득 주택",
    description: "재건축, 재개발 아닌 지역에 한함",
  },
];

export function PropertyPriceRangeSelector({
  value,
  onChange,
  showSimplifiedOptions = false,
}: PropertyPriceRangeSelectorProps) {
  const options = showSimplifiedOptions ? simplifiedPriceRangeOptions : priceRangeOptions;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-gov-lg font-semibold text-foreground">
        주택 취득 가액은?
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
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
            {option.description && (
              <span className="text-gov-sm text-muted-foreground mt-1">
                ({option.description})
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
