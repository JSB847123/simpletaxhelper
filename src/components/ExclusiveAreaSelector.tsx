import { cn } from "@/lib/utils";

export type ExclusiveAreaType = "over85" | "under85";

interface ExclusiveAreaSelectorProps {
  value: ExclusiveAreaType | null;
  onChange: (area: ExclusiveAreaType) => void;
}

const areaOptions = [
  {
    id: "under85" as const,
    label: "85㎡ 이하",
    description: "",
  },
  {
    id: "over85" as const,
    label: "85㎡ 초과",
    description: "",
  },
];

export function ExclusiveAreaSelector({
  value,
  onChange,
}: ExclusiveAreaSelectorProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-gov-lg font-semibold text-foreground">
        전용면적은?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areaOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 text-center",
              "hover:shadow-gov hover:border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === option.id
                ? "border-primary bg-secondary shadow-gov"
                : "border-border bg-card"
            )}
          >
            <span className="text-gov-lg font-bold text-foreground">
              {option.label}
            </span>
            {option.description && (
              <span className="text-gov-sm text-muted-foreground mt-1">
                {option.description}
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
