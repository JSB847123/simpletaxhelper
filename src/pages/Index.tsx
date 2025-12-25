import { useState } from "react";
import { AcquisitionTypeSelector } from "@/components/AcquisitionTypeSelector";
import { PurchaseForm } from "@/components/PurchaseForm";
import { ResultCard } from "@/components/ResultCard";
import { calculatePurchaseTax } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import mascotImage from "@/assets/mascot.png";

type AcquisitionType = "purchase" | "gift" | "inheritance" | "debtGift" | "taxReduction";

interface CalculationResult {
  type: AcquisitionType;
  price?: number;
  houseCount?: number;
  tax?: number;
  rate?: string;
  exclusiveArea?: "under85" | "over85";
}

const Index = () => {
  const [acquisitionType, setAcquisitionType] =
    useState<AcquisitionType | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [inheritancePrice, setInheritancePrice] = useState<string>("");

  const handleTypeChange = (type: AcquisitionType) => {
    setAcquisitionType(type);
    setResult(null);
    setInheritancePrice("");
  };

  const handlePurchaseCalculate = (
    price: number,
    houseCount: number,
    contractPeriod?: string,
    exclusiveArea?: string,
    priceRange?: string
  ) => {
    const taxResult = calculatePurchaseTax(
      price,
      houseCount,
      contractPeriod as any,
      exclusiveArea as any,
      priceRange as any
    );
    setResult({
      type: "purchase",
      price,
      houseCount,
      tax: taxResult.tax,
      rate: taxResult.rate,
      exclusiveArea: exclusiveArea as "under85" | "over85",
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
    setInheritancePrice("");
  };

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";
    return Number(numericValue).toLocaleString("ko-KR");
  };

  const handleInheritancePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setInheritancePrice(formatted);
  };

  const handleInheritanceSubmit = () => {
    const numericPrice = Number(inheritancePrice.replace(/,/g, ""));
    if (!numericPrice || numericPrice <= 0) {
      return;
    }
    setResult({
      type: "inheritance",
      price: numericPrice,
    });
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

          {/* Tax Reduction: Direct Link to Department */}
          {acquisitionType === "taxReduction" && !result && (
            <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                  2
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  담당자 안내
                </span>
              </div>
              <div className="text-center space-y-4">
                <p className="text-gov-base text-foreground">
                  감면은 취득하시는 물건지 '동' 담당자에게 문의하시기 바랍니다.
                </p>
                <Button
                  variant="gov"
                  size="xl"
                  onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
                  className="w-full sm:w-auto"
                >
                  담당자 찾기
                </Button>
              </div>
            </section>
          )}

          {/* Gift: Direct Link to Department */}
          {acquisitionType === "gift" && !result && (
            <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                  2
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  담당자 안내
                </span>
              </div>
              <div className="text-center space-y-4">
                <p className="text-gov-base text-foreground leading-relaxed">
                  증여는 '시가인정액' 확인과 함께<br />
                  시가표준액 및 증여자의 주택 수 등<br />
                  관련된 사항에 대한 확인이 필요합니다.<br />
                  <br />
                  물건지 '동' 담당자에게<br />
                  취득 관련 내용을 문의하시기 바랍니다.
                </p>
                <Button
                  variant="gov"
                  size="xl"
                  onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
                  className="w-full sm:w-auto"
                >
                  담당자 찾기
                </Button>
              </div>
            </section>
          )}

          {/* Inheritance: Price Input Form */}
          {acquisitionType === "inheritance" && !result && (
            <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                  2
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  정보 입력
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-gov-base font-semibold text-foreground">
                    상속인 취득일 기준 시가표준액을 입력하시오
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inheritancePrice}
                      onChange={handleInheritancePriceChange}
                      placeholder="예: 500,000,000"
                      className="w-full h-14 px-4 text-gov-lg border-2 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 border-border"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gov-base text-muted-foreground">
                      원
                    </span>
                  </div>
                  {inheritancePrice && (
                    <p className="text-gov-sm text-muted-foreground">
                      ≈ {(Number(inheritancePrice.replace(/,/g, "")) / 100000000).toFixed(2)}억 원
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleInheritanceSubmit}
                  variant="gov"
                  size="xl"
                  className="w-full"
                  disabled={!inheritancePrice || Number(inheritancePrice.replace(/,/g, "")) <= 0}
                >
                  확인
                </Button>
              </div>
            </section>
          )}

          {/* DebtGift: Direct Link to Department */}
          {acquisitionType === "debtGift" && !result && (
            <section className="bg-card rounded-2xl border-2 border-border p-6 shadow-gov animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-gov-sm font-bold">
                  2
                </span>
                <span className="text-gov-base font-medium text-muted-foreground">
                  담당자 안내
                </span>
              </div>
              <div className="text-center space-y-4">
                <p className="text-gov-base text-foreground">
                  부담부증여에 관련된 사항은 물건지 '동' 담당자에게 문의하시기 바랍니다.
                </p>
                <Button
                  variant="gov"
                  size="xl"
                  onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
                  className="w-full sm:w-auto"
                >
                  담당자 찾기
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
                exclusiveArea={result.exclusiveArea}
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
            본 서비스는 참고용이며, 정확한 세액 산정은 동작구청 재산세과에 문의해 주세요.
          </p>
          <p className="text-gov-sm text-muted-foreground mt-2">
            동작구청 재산세과 · 민원 안내 서비스
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
