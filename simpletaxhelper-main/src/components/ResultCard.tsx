import { Button } from "@/components/ui/button";
import { Phone, Globe } from "lucide-react";

interface ResultCardProps {
  type: "purchase" | "gift" | "inheritance" | "debtGift";
  price?: number;
  houseCount?: number;
  tax?: number;
  rate?: string;
}

export function ResultCard({
  type,
  price,
  houseCount,
  tax,
  rate,
}: ResultCardProps) {
  const renderPurchaseResult = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gov-base text-muted-foreground mb-2">
          예상 취득세 (지방교육세·농어촌특별세 포함)
        </p>
        <p className="text-gov-3xl font-bold text-primary">
          {tax?.toLocaleString("ko-KR")}원
        </p>
        <p className="text-gov-sm text-muted-foreground mt-2">
          적용 세율: {rate}
        </p>
      </div>

      <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-gov-sm">
          <span className="text-muted-foreground">취득가액</span>
          <span className="font-medium text-foreground">
            {price?.toLocaleString("ko-KR")}원
          </span>
        </div>
        <div className="flex justify-between text-gov-sm">
          <span className="text-muted-foreground">보유 주택 수</span>
          <span className="font-medium text-foreground">
            {houseCount === 4 ? "4주택 이상" : `${houseCount}주택`}
          </span>
        </div>
      </div>
    </div>
  );

  const renderGiftResult = () => (
    <div className="space-y-4">
      <div className="bg-info/10 border border-info/30 rounded-xl p-5">
        <p className="text-gov-base text-foreground leading-relaxed">
          증여 취득세는 <strong>공시가격</strong> 및{" "}
          <strong>조정대상지역 여부</strong>에 따라{" "}
          <span className="text-primary font-bold">3.5% ~ 12%</span>가
          적용됩니다.
        </p>
      </div>
      <p className="text-gov-base text-muted-foreground text-center">
        자세한 사항은 주택 취득 물건지 담당자와 상의하시기 바랍니다.
      </p>
    </div>
  );

  const renderInheritanceResult = () => (
    <div className="space-y-4">
      <div className="bg-info/10 border border-info/30 rounded-xl p-5">
        <p className="text-gov-base text-foreground leading-relaxed">
          상속 취득세는 <strong>무주택자 상속 여부</strong> 등에 따라{" "}
          <span className="text-primary font-bold">0.8% ~ 2.8%</span>가
          적용됩니다.
        </p>
      </div>
      <p className="text-gov-base text-muted-foreground text-center">
        일반적인 내용은 위와 같으나, 정확한 감면 혜택 등은 담당자와 상의하시기
        바랍니다.
      </p>
    </div>
  );

  const renderDebtGiftResult = () => (
    <div className="space-y-4">
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
        <p className="text-gov-base text-foreground leading-relaxed">
          부담부증여는 <strong>채무액 부분(유상)</strong>과{" "}
          <strong>나머지 부분(무상)</strong>의 세율이 다르게 적용되어
          복잡합니다.
        </p>
      </div>
      <p className="text-gov-base text-destructive font-medium text-center">
        반드시 주택 취득 담당자와 상의하시기 바랍니다.
      </p>
    </div>
  );

  const renderResult = () => {
    switch (type) {
      case "purchase":
        return renderPurchaseResult();
      case "gift":
        return renderGiftResult();
      case "inheritance":
        return renderInheritanceResult();
      case "debtGift":
        return renderDebtGiftResult();
      default:
        return null;
    }
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-gov">
        <h3 className="text-gov-xl font-bold text-center text-foreground mb-6">
          📋 계산 결과
        </h3>
        {renderResult()}
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <p className="text-gov-sm text-muted-foreground text-center leading-relaxed">
          ⚠️ 본 계산 결과는 <strong>참고용</strong>이며, 법적 효력이 없습니다.
          <br />
          정확한 세액은 구청 담당자 확인이 필요합니다.
        </p>
      </div>

      {/* Contact Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="govOutline" size="lg" className="gap-2">
          <Phone className="w-5 h-5" />
          담당자 연결
        </Button>
        <Button variant="gov" size="lg" className="gap-2">
          <Globe className="w-5 h-5" />
          구청 홈페이지
        </Button>
      </div>
    </div>
  );
}
