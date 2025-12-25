import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContractDateSelector, ContractDatePeriod } from "./ContractDateSelector";
import { PropertyPriceRangeSelector, PropertyPriceRange } from "./PropertyPriceRangeSelector";
import { HouseCountSelector } from "./HouseCountSelector";
import { ExclusiveAreaSelector, ExclusiveAreaType } from "./ExclusiveAreaSelector";

interface PurchaseFormProps {
  onCalculate: (
    price: number,
    houseCount: number,
    contractPeriod?: ContractDatePeriod,
    exclusiveArea?: ExclusiveAreaType,
    priceRange?: PropertyPriceRange
  ) => void;
}

type FormStep = "contractDate" | "houseCount" | "exclusiveArea" | "priceRange" | "price";

export function PurchaseForm({ onCalculate }: PurchaseFormProps) {
  const [step, setStep] = useState<FormStep>("contractDate");
  const [contractPeriod, setContractPeriod] = useState<ContractDatePeriod | null>(null);
  const [houseCount, setHouseCount] = useState<number | null>(null);
  const [exclusiveArea, setExclusiveArea] = useState<ExclusiveAreaType | null>(null);
  const [priceRange, setPriceRange] = useState<PropertyPriceRange | null>(null);
  const [price, setPrice] = useState<string>("");
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

  const handleContractDateSelect = (period: ContractDatePeriod) => {
    setContractPeriod(period);
    // 특수관계인간 거래는 다음 단계로 진행하지 않음
    if (period !== "specialRelation") {
      setStep("houseCount");
    }
  };

  const handleHouseCountSelect = (count: number) => {
    setHouseCount(count);
    setStep("exclusiveArea");
  };

  const handleExclusiveAreaSelect = (area: ExclusiveAreaType) => {
    setExclusiveArea(area);
    setStep("priceRange");
  };

  const handlePriceRangeSelect = (range: PropertyPriceRange) => {
    setPriceRange(range);
    setStep("price");
  };

  const handleBack = () => {
    if (step === "houseCount") {
      setStep("contractDate");
      setHouseCount(null);
    } else if (step === "exclusiveArea") {
      setStep("houseCount");
      setExclusiveArea(null);
    } else if (step === "priceRange") {
      setStep("exclusiveArea");
      setPriceRange(null);
    } else if (step === "price") {
      setStep("priceRange");
      setPrice("");
      setError("");
    }
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

    onCalculate(numericPrice, houseCount, contractPeriod || undefined, exclusiveArea || undefined, priceRange || undefined);
  };

  const numericPrice = Number(price.replace(/,/g, "")) || 0;
  const priceInOk = numericPrice / 100000000;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step 1: Contract Date Selection */}
      {step === "contractDate" && (
        <ContractDateSelector
          value={contractPeriod}
          onChange={handleContractDateSelect}
        />
      )}

      {/* Special Relation Notice */}
      {contractPeriod === "specialRelation" && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 bg-secondary/50 border border-border rounded-xl">
            <p className="text-gov-base text-foreground text-center leading-relaxed">
              특수관계인간 거래는 주택 취득 물건지 담당자에게 관련 내용을<br />
              반드시 문의하시기 바랍니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="gov"
              size="xl"
              onClick={() => window.open("https://www.law.go.kr/법령/지방세기본법%20시행령/제2조", "_blank")}
              className="w-full"
            >
              특수관계인의 범위
            </Button>
            <Button
              variant="gov"
              size="xl"
              onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
              className="w-full"
            >
              담당자 찾기
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: House Count Selection */}
      {step === "houseCount" && contractPeriod && (
        <>
          <HouseCountSelector
            contractPeriod={contractPeriod}
            value={houseCount}
            onChange={handleHouseCountSelect}
          />
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full"
          >
            이전
          </Button>
        </>
      )}

      {/* Step 3: Exclusive Area Selection */}
      {step === "exclusiveArea" && (
        <>
          <ExclusiveAreaSelector
            value={exclusiveArea}
            onChange={handleExclusiveAreaSelect}
          />
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full"
          >
            이전
          </Button>
        </>
      )}

      {/* Step 4: Property Price Range Selection */}
      {step === "priceRange" && (
        <>
          <PropertyPriceRangeSelector
            value={priceRange}
            onChange={handlePriceRangeSelect}
            showSimplifiedOptions={
              (contractPeriod === "before" && (houseCount === 3 || houseCount === 4)) ||
              (contractPeriod === "after" && (houseCount === 2 || houseCount === 3))
            }
          />
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full"
          >
            이전
          </Button>
        </>
      )}

      {/* Step 5: Price Input */}
      {step === "price" && (
        <>
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

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-gov-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="xl"
              onClick={handleBack}
              className="w-1/3"
            >
              이전
            </Button>
            <Button
              onClick={handleSubmit}
              variant="gov"
              size="xl"
              className="w-2/3"
            >
              계산하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
