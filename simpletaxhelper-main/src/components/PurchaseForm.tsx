import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PurchaseFormProps {
  onCalculate: (price: number, houseCount: number) => void;
}

const houseCountOptions = [
  { value: 1, label: "1주택", description: "취득 주택 포함" },
  { value: 2, label: "2주택", description: "취득 주택 포함" },
  { value: 3, label: "3주택", description: "취득 주택 포함" },
  { value: 4, label: "4주택 이상", description: "취득 주택 포함" },
];

export function PurchaseForm({ onCalculate }: PurchaseFormProps) {
  const [price, setPrice] = useState<string>("");
  const [houseCount, setHouseCount] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";
    return Number(numericValue).toLocaleString("ko-KR");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
    setError("");
  };

  const handleSubmit = () => {
    const numericPrice = Number(price.replace(/,/g, ""));
    
    if (!numericPrice || numericPrice <= 0) {
      setError("취득가액을 입력해 주세요.");
      return;
    }
    
    if (!houseCount) {
      setError("보유 주택 수를 선택해 주세요.");
      return;
    }

    onCalculate(numericPrice, houseCount);
  };

  const numericPrice = Number(price.replace(/,/g, "")) || 0;
  const priceInOk = numericPrice / 100000000;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <label className="block text-gov-base font-semibold text-foreground">
          취득가액 (원)
        </label>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="예: 500,000,000"
            className={cn(
              "w-full h-14 px-4 text-gov-lg border-2 rounded-xl",
              "bg-card text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "transition-all duration-200",
              error && !price ? "border-destructive" : "border-border"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gov-base text-muted-foreground">
            원
          </span>
        </div>
        {numericPrice > 0 && (
          <p className="text-gov-sm text-muted-foreground">
            ≈ {priceInOk.toFixed(2)}억 원
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-gov-base font-semibold text-foreground">
          보유 주택 수 (취득 주택 포함)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {houseCountOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setHouseCount(option.value);
                setError("");
              }}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                "hover:shadow-gov hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                houseCount === option.value
                  ? "border-primary bg-secondary shadow-gov"
                  : "border-border bg-card",
                error && !houseCount ? "border-destructive/50" : ""
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

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-gov-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        variant="gov"
        size="xl"
        className="w-full"
      >
        계산하기
      </Button>
    </div>
  );
}
