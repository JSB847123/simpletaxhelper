import { Button } from "@/components/ui/button";
import { Phone, Globe } from "lucide-react";

interface ResultCardProps {
  type: "purchase" | "gift" | "inheritance" | "debtGift";
  price?: number;
  houseCount?: number;
  tax?: number;
  rate?: string;
  exclusiveArea?: "under85" | "over85";
}

export function ResultCard({
  type,
  price,
  houseCount,
  tax,
  rate,
  exclusiveArea,
}: ResultCardProps) {
  const renderPurchaseResult = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gov-base text-muted-foreground mb-2">
          {exclusiveArea === "under85"
            ? "예상 취득세 (지방교육세 포함)"
            : "예상 취득세 (지방교육세·농어촌특별세 포함)"}
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
    <div className="space-y-6">
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="flex justify-between text-gov-base">
          <span className="text-muted-foreground">시가표준액:</span>
          <span className="font-semibold text-foreground">
            {price?.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      <div className="bg-info/10 border border-info/30 rounded-xl p-5 space-y-3">
        <p className="text-gov-base text-foreground font-semibold">
          '상속' 취득의 과세표준은 시가표준액입니다.
        </p>

        <div className="space-y-2 text-gov-sm text-foreground">
          <p className="font-medium">주택의 경우 취득세(교육세 포함) 세율은</p>
          <ul className="space-y-1 ml-4">
            <li>• 85㎡ 이하: <span className="font-bold text-primary">2.96%</span></li>
            <li>• 85㎡ 초과: <span className="font-bold text-primary">3.16%</span></li>
            <li>• 근린생활시설 및 토지: <span className="font-bold text-primary">3.16%</span></li>
          </ul>
        </div>

        <p className="text-gov-sm text-foreground leading-relaxed pt-2 border-t border-info/20">
          기타 여러 사항에 대한 확인이 필요한 사항이오니<br />
          구체적인 내용은 반드시 물건지 '동' 담당자에게 문의하시기 바랍니다.
        </p>
      </div>

      <Button
        variant="gov"
        size="xl"
        onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
        className="w-full"
      >
        담당자 찾기
      </Button>
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

      {/* Contact Button */}
      <div className="flex justify-center">
        <Button
          variant="gov"
          size="lg"
          className="gap-2"
          onClick={() => window.open("https://www.dongjak.go.kr/portal/bbs/B0001244/deptGdc.do?deptId=DP_050300&menuNo=200832", "_blank")}
        >
          담당자 찾기
        </Button>
      </div>
    </div>
  );
}
