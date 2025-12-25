// 주택 취득세 계산 로직 (유상취득 - 매매)
// 취득세 + 지방교육세 + 농어촌특별세 = 총 세금

interface TaxResult {
  tax: number;
  rate: string;
  breakdown: {
    acquisitionTax: number;
    localEducationTax: number;
    ruralSpecialTax: number;
  };
}

export function calculatePurchaseTax(
  price: number,
  houseCount: number
): TaxResult {
  let acquisitionTaxRate: number;
  let localEducationTaxRate: number;
  let ruralSpecialTaxRate: number;
  let rateDescription: string;

  if (houseCount === 1) {
    // 1주택
    if (price <= 600000000) {
      // 6억 이하: 1% + 0.1% + 0% = 1.1%
      acquisitionTaxRate = 0.01;
      localEducationTaxRate = 0.001;
      ruralSpecialTaxRate = 0;
      rateDescription = "1.1% (취득세 1% + 지방교육세 0.1%)";
    } else if (price <= 900000000) {
      // 6억 초과 9억 이하: 1~3% 구간 (간소화하여 2% 적용)
      // 실제로는 (취득가액 × 2/3억 - 3) % 로 계산하지만 간편 계산기이므로 중간값 적용
      const calculatedRate = (price * 2) / 300000000 - 3;
      acquisitionTaxRate = Math.min(Math.max(calculatedRate / 100, 0.01), 0.03);
      localEducationTaxRate = acquisitionTaxRate * 0.1;
      ruralSpecialTaxRate = acquisitionTaxRate >= 0.02 ? 0.002 : 0;
      const totalRate =
        (acquisitionTaxRate + localEducationTaxRate + ruralSpecialTaxRate) *
        100;
      rateDescription = `약 ${totalRate.toFixed(2)}% (6~9억 구간)`;
    } else {
      // 9억 초과: 3% + 0.3% + 0.2% = 3.5%
      acquisitionTaxRate = 0.03;
      localEducationTaxRate = 0.003;
      ruralSpecialTaxRate = 0.002;
      rateDescription = "3.5% (취득세 3% + 지방교육세 0.3% + 농특세 0.2%)";
    }
  } else if (houseCount === 2) {
    // 2주택: 8% + 0.4% + 0.6% = 9% (조정대상지역 기준, 간편 적용)
    // 비조정지역은 1~3%이나, 보수적으로 높은 세율 안내
    acquisitionTaxRate = 0.08;
    localEducationTaxRate = 0.004;
    ruralSpecialTaxRate = 0.006;
    rateDescription = "9% (조정대상지역 기준)";
  } else if (houseCount === 3) {
    // 3주택: 12% + 0.4% + 1% = 13.4%
    acquisitionTaxRate = 0.12;
    localEducationTaxRate = 0.004;
    ruralSpecialTaxRate = 0.01;
    rateDescription = "13.4% (3주택)";
  } else {
    // 4주택 이상: 12% + 0.4% + 1% = 13.4%
    acquisitionTaxRate = 0.12;
    localEducationTaxRate = 0.004;
    ruralSpecialTaxRate = 0.01;
    rateDescription = "13.4% (4주택 이상)";
  }

  const acquisitionTax = Math.floor(price * acquisitionTaxRate);
  const localEducationTax = Math.floor(price * localEducationTaxRate);
  const ruralSpecialTax = Math.floor(price * ruralSpecialTaxRate);
  const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax;

  return {
    tax: totalTax,
    rate: rateDescription,
    breakdown: {
      acquisitionTax,
      localEducationTax,
      ruralSpecialTax,
    },
  };
}
