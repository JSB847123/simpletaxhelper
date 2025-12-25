import { cn } from "@/lib/utils";

type AcquisitionType = "purchase" | "gift" | "inheritance" | "debtGift" | "taxReduction";

interface AcquisitionTypeSelectorProps {
  value: AcquisitionType | null;
  onChange: (type: AcquisitionType) => void;
}

const acquisitionTypes = [
  {
    id: "purchase" as const,
    label: "유상취득 (매매)",
    description: "일반 매매 거래",
    icon: "🏠",
  },
  {
    id: "gift" as const,
    label: "증여",
    description: "무상 증여",
    icon: "🎁",
  },
  {
    id: "inheritance" as const,
    label: "상속",
    description: "상속 취득",
    icon: "📜",
  },
  {
    id: "debtGift" as const,
    label: "부담부증여",
    description: "채무 포함 증여",
    icon: "📋",
  },
  {
    id: "taxReduction" as const,
    label: "취득세 감면",
    description: "감면 대상 취득",
    icon: "💰",
  },
];

export function AcquisitionTypeSelector({
  value,
  onChange,
}: AcquisitionTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-gov-lg font-semibold text-foreground">
        취득 원인을 선택해 주세요
      </h2>
      <div className="space-y-3">
        {/* First 4 types in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {acquisitionTypes.slice(0, 4).map((type) => (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={cn(
                "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200 text-left",
                "hover:shadow-gov hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                value === type.id
                  ? "border-primary bg-secondary shadow-gov"
                  : "border-border bg-card"
              )}
            >
              <span className="text-2xl mb-2">{type.icon}</span>
              <span className="text-gov-base font-semibold text-foreground">
                {type.label}
              </span>
              <span className="text-gov-sm text-muted-foreground mt-1">
                {type.description}
              </span>
              {value === type.id && (
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

        {/* Tax Reduction centered below */}
        {acquisitionTypes.slice(4).map((type) => (
          <div key={type.id} className="flex justify-center">
            <button
              onClick={() => onChange(type.id)}
              className={cn(
                "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200 text-left w-full sm:w-1/2",
                "hover:shadow-gov hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                value === type.id
                  ? "border-primary bg-secondary shadow-gov"
                  : "border-border bg-card"
              )}
            >
              <span className="text-2xl mb-2">{type.icon}</span>
              <span className="text-gov-base font-semibold text-foreground">
                {type.label}
              </span>
              <span className="text-gov-sm text-muted-foreground mt-1">
                {type.description}
              </span>
              {value === type.id && (
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
          </div>
        ))}
      </div>
    </div>
  );
}
