import { useState } from "react";
import { AcquisitionTypeSelector } from "@/components/AcquisitionTypeSelector";
import { PurchaseForm } from "@/components/PurchaseForm";
import { ResultCard } from "@/components/ResultCard";
import { calculatePurchaseTax } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import mascotImage from "@/assets/mascot.png";

type AcquisitionType = "purchase" | "gift" | "inheritance" | "debtGift";

interface CalculationResult {
  type: AcquisitionType;
  price?: number;
  houseCount?: number;
  tax?: number;
  rate?: string;
}

const Index = () => {
  const [acquisitionType, setAcquisitionType] =
    useState<AcquisitionType | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleTypeChange = (type: AcquisitionType) => {
    setAcquisitionType(type);
    setResult(null);
  };

  const handlePurchaseCalculate = (price: number, houseCount: number) => {
    const taxResult = calculatePurchaseTax(price, houseCount);
    setResult({
      type: "purchase",
      price,
      houseCount,
      tax: taxResult.tax,
      rate: taxResult.rate,
    });
  };

  const handleNonPurchaseSubmit = () => {
    if (acquisitionType && acquisitionType !== "purchase") {
      setResult({ type: acquisitionType });
    }
  };

  const handleReset = () => {
    setAcquisitionType(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-gov-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <img
            src={mascotImage}
            alt="동작구 마스코트"
            className="w-16 h-16 object-contain animate-bounce-gentle"
          />
          <div>
            <h1 className="text-gov-2xl font-bold">주택 취득세 간편 계산기</h1>
            <p className="text-gov-sm opacity-90 mt-1">
              빠르고 간편하게 취득세를 확인하세요
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Step 1: Select Acquisition Type */}
          <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                1
              </span>
              <span className="text-gov-base font-medium text-muted-foreground">
                취득 원인 선택
              </span>
            </div>
            <AcquisitionTypeSelector
              value={acquisitionType}
              onChange={handleTypeChange}
            />
          </section>

          {/* Step 2: Input Form (only for purchase) */}
          {acquisitionType === "purchase" && !result && (
            <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                  2
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  정보 입력
                </span>
              </div>
              <PurchaseForm onCalculate={handlePurchaseCalculate} />
            </section>
          )}

          {/* Non-purchase: Direct Submit Button */}
          {acquisitionType &&
            acquisitionType !== "purchase" &&
            !result && (
              <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                    2
                  </span>
                  <span className="text-gov-base font-medium text-muted-foreground">
                    안내 확인
                  </span>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-gov-base text-foreground">
                    {acquisitionType === "gift" && "증여 취득에 대한 안내를 확인합니다."}
                    {acquisitionType === "inheritance" && "상속 취득에 대한 안내를 확인합니다."}
                    {acquisitionType === "debtGift" && "부담부증여에 대한 안내를 확인합니다."}
                  </p>
                  <Button
                    variant="gov"
                    size="xl"
                    onClick={handleNonPurchaseSubmit}
                    className="w-full sm:w-auto"
                  >
                    안내 보기
                  </Button>
                </div>
              </section>
            )}

          {/* Result */}
          {result && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-success text-success-foreground rounded-full text-gov-sm font-bold">
                  ✓
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  결과
                </span>
              </div>
              <ResultCard
                type={result.type}
                price={result.price}
                houseCount={result.houseCount}
                tax={result.tax}
                rate={result.rate}
              />
              
              {/* Reset Button */}
              <div className="mt-6 text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  다시 계산하기
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gov-sm text-muted-foreground">
            본 서비스는 참고용이며, 정확한 세액 산정은 구청 세무과에 문의해 주세요.
          </p>
          <p className="text-gov-sm text-muted-foreground mt-2">
            © 2024 구청 세무과 · 민원 안내 서비스
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
