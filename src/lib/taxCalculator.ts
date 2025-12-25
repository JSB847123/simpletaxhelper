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

type ContractPeriod = "before" | "after";
type ExclusiveArea = "over85" | "under85";
type PriceRange = "under6" | "6to9" | "over9" | "publicUnder1" | "customPrice";

export function calculatePurchaseTax(
  price: number,
  houseCount: number,
  contractPeriod?: ContractPeriod,
  exclusiveArea?: ExclusiveArea,
  priceRange?: PriceRange
): TaxResult {
  // 새로운 로직: 계약일 2025.10.16 이전 선택 시
  if (contractPeriod === "before") {
    return calculateTaxBefore20251016(price, houseCount, exclusiveArea, priceRange);
  }

  // 새로운 로직: 계약일 2025.10.16 이후 선택 시
  if (contractPeriod === "after") {
    return calculateTaxAfter20251016(price, houseCount, exclusiveArea, priceRange);
  }

  // 기존 로직 (하위 호환성 유지)
  return calculateLegacyTax(price, houseCount);
}

function calculateTaxBefore20251016(
  price: number,
  houseCount: number,
  exclusiveArea?: ExclusiveArea,
  priceRange?: PriceRange
): TaxResult {
  let totalRate: number;
  let rateDescription: string;

  // 공시가격 1억 원 이하 취득 주택 처리
  if (priceRange === "publicUnder1") {
    if (exclusiveArea === "under85") {
      totalRate = 0.011; // 1.1%
      rateDescription = "1.1% (취득세+교육세 포함)";
    } else {
      totalRate = 0.013; // 1.3%
      rateDescription = "1.3% (취득세+교육세 포함)";
    }

    const totalTax = Math.floor(price * totalRate);

    return {
      tax: totalTax,
      rate: rateDescription,
      breakdown: {
        acquisitionTax: totalTax,
        localEducationTax: 0,
        ruralSpecialTax: 0,
      },
    };
  }

  // 1~2주택
  if (houseCount === 1) {
    // #1: 85㎡ 이하 + 6억 원 이하
    if (exclusiveArea === "under85" && priceRange === "under6") {
      totalRate = 0.011; // 1.1%
      rateDescription = "1.1% (취득세+교육세 포함)";
    }
    // #2: 85㎡ 초과 + 6억 원 이하
    else if (exclusiveArea === "over85" && priceRange === "under6") {
      totalRate = 0.013; // 1.3%
      rateDescription = "1.3% (취득세+교육세+농특세 포함)";
    }
    // #3-1: 85㎡ 이하 + 6억 원 초과 9억 원 이하
    else if (exclusiveArea === "under85" && priceRange === "6to9") {
      // 취득세율 = 취득가액(원) × 2/3 - 300,000,000 (소수점 3째자리에서 반올림)
      const acquisitionTaxRate = parseFloat(((price * 2 / 3 - 300000000) / 100000000).toFixed(3));
      const educationTaxRate = parseFloat((acquisitionTaxRate * 0.1).toFixed(3));
      const totalRate = acquisitionTaxRate + educationTaxRate;
      const totalTax = Math.floor(price * totalRate / 100);

      return {
        tax: totalTax,
        rate: `약 ${(totalRate).toFixed(2)}% (6~9억 구간, 취득세+교육세 포함)`,
        breakdown: {
          acquisitionTax: Math.floor(price * acquisitionTaxRate / 100),
          localEducationTax: Math.floor(price * educationTaxRate / 100),
          ruralSpecialTax: 0,
        },
      };
    }
    // #3-2: 85㎡ 초과 + 6억 원 초과 9억 원 이하
    else if (exclusiveArea === "over85" && priceRange === "6to9") {
      // 취득세율 = 취득가액(원) × 2/3 - 300,000,000 (소수점 3째자리에서 반올림)
      const acquisitionTaxRate = parseFloat(((price * 2 / 3 - 300000000) / 100000000).toFixed(3));
      const educationTaxRate = parseFloat((acquisitionTaxRate * 0.1).toFixed(3));
      const ruralTaxRate = 0.2;
      const totalRate = acquisitionTaxRate + educationTaxRate + ruralTaxRate;
      const totalTax = Math.floor(price * totalRate / 100);

      return {
        tax: totalTax,
        rate: `약 ${(totalRate).toFixed(2)}% (6~9억 구간, 취득세+교육세+농특세 포함)`,
        breakdown: {
          acquisitionTax: Math.floor(price * acquisitionTaxRate / 100),
          localEducationTax: Math.floor(price * educationTaxRate / 100),
          ruralSpecialTax: Math.floor(price * ruralTaxRate / 100),
        },
      };
    }
    // #4-1: 85㎡ 이하 + 9억 원 초과
    else if (exclusiveArea === "under85" && priceRange === "over9") {
      totalRate = 0.033; // 3.3%
      rateDescription = "3.3% (취득세+교육세 포함)";
    }
    // #4-2: 85㎡ 초과 + 9억 원 초과
    else if (exclusiveArea === "over85" && priceRange === "over9") {
      totalRate = 0.035; // 3.5%
      rateDescription = "3.5% (취득세+교육세+농특세 포함)";
    }
    else {
      // 기본값
      totalRate = 0.011;
      rateDescription = "1.1%";
    }
  }
  // 3주택
  else if (houseCount === 3) {
    // #6: 85㎡ 이하
    if (exclusiveArea === "under85") {
      totalRate = 0.084; // 8.4%
      rateDescription = "8.4% (취득세+교육세 포함)";
    }
    // #7: 85㎡ 초과
    else {
      totalRate = 0.09; // 9%
      rateDescription = "9% (취득세+교육세+농특세 포함)";
    }
  }
  // 4주택 이상
  else if (houseCount === 4) {
    // #8: 85㎡ 이하
    if (exclusiveArea === "under85") {
      totalRate = 0.124; // 12.4%
      rateDescription = "12.4% (취득세+교육세 포함)";
    }
    // #9: 85㎡ 초과
    else {
      totalRate = 0.134; // 13.4%
      rateDescription = "13.4% (취득세+교육세 포함)";
    }
  }
  else {
    // 기본값
    totalRate = 0.011;
    rateDescription = "1.1%";
  }

  const totalTax = Math.floor(price * totalRate);

  return {
    tax: totalTax,
    rate: rateDescription,
    breakdown: {
      acquisitionTax: totalTax,
      localEducationTax: 0,
      ruralSpecialTax: 0,
    },
  };
}

function calculateTaxAfter20251016(
  price: number,
  houseCount: number,
  exclusiveArea?: ExclusiveArea,
  priceRange?: PriceRange
): TaxResult {
  let totalRate: number;
  let rateDescription: string;

  // 공시가격 1억 원 이하 취득 주택 처리
  if (priceRange === "publicUnder1") {
    if (exclusiveArea === "under85") {
      totalRate = 0.011; // 1.1%
      rateDescription = "1.1% (취득세+교육세 포함)";
    } else {
      totalRate = 0.013; // 1.3%
      rateDescription = "1.3% (취득세+교육세 포함)";
    }

    const totalTax = Math.floor(price * totalRate);

    return {
      tax: totalTax,
      rate: rateDescription,
      breakdown: {
        acquisitionTax: totalTax,
        localEducationTax: 0,
        ruralSpecialTax: 0,
      },
    };
  }

  // 1주택
  if (houseCount === 1) {
    // #1: 85㎡ 이하 + 6억 원 이하
    if (exclusiveArea === "under85" && priceRange === "under6") {
      totalRate = 0.011; // 1.1%
      rateDescription = "1.1% (취득세+교육세 포함)";
    }
    // #2: 85㎡ 초과 + 6억 원 이하
    else if (exclusiveArea === "over85" && priceRange === "under6") {
      totalRate = 0.013; // 1.3%
      rateDescription = "1.3% (취득세+교육세 포함)";
    }
    // #3: 85㎡ 이하 + 6억 원 초과 9억 원 이하
    else if (exclusiveArea === "under85" && priceRange === "6to9") {
      const acquisitionTaxRate = parseFloat(((price * 2 / 3 - 300000000) / 100000000).toFixed(3));
      const educationTaxRate = parseFloat((acquisitionTaxRate * 0.1).toFixed(3));
      const totalRate = acquisitionTaxRate + educationTaxRate;
      const totalTax = Math.floor(price * totalRate / 100);

      return {
        tax: totalTax,
        rate: `약 ${(totalRate).toFixed(2)}% (6~9억 구간, 취득세+교육세 포함)`,
        breakdown: {
          acquisitionTax: Math.floor(price * acquisitionTaxRate / 100),
          localEducationTax: Math.floor(price * educationTaxRate / 100),
          ruralSpecialTax: 0,
        },
      };
    }
    // #4: 85㎡ 초과 + 6억 원 초과 9억 원 이하
    else if (exclusiveArea === "over85" && priceRange === "6to9") {
      const acquisitionTaxRate = parseFloat(((price * 2 / 3 - 300000000) / 100000000).toFixed(3));
      const educationTaxRate = parseFloat((acquisitionTaxRate * 0.1).toFixed(3));
      const ruralTaxRate = 0.2;
      const totalRate = acquisitionTaxRate + educationTaxRate + ruralTaxRate;
      const totalTax = Math.floor(price * totalRate / 100);

      return {
        tax: totalTax,
        rate: `약 ${(totalRate).toFixed(2)}% (6~9억 구간, 취득세+교육세+농특세 포함)`,
        breakdown: {
          acquisitionTax: Math.floor(price * acquisitionTaxRate / 100),
          localEducationTax: Math.floor(price * educationTaxRate / 100),
          ruralSpecialTax: Math.floor(price * ruralTaxRate / 100),
        },
      };
    }
    // #5: 85㎡ 이하 + 9억 원 초과
    else if (exclusiveArea === "under85" && priceRange === "over9") {
      totalRate = 0.033; // 3.3%
      rateDescription = "3.3% (취득세+교육세 포함)";
    }
    // #6: 85㎡ 초과 + 9억 원 초과
    else if (exclusiveArea === "over85" && priceRange === "over9") {
      totalRate = 0.035; // 3.5%
      rateDescription = "3.5% (취득세+교육세+농특세 포함)";
    }
    else {
      totalRate = 0.011;
      rateDescription = "1.1%";
    }
  }
  // 2주택
  else if (houseCount === 2) {
    // #7: 85㎡ 이하
    if (exclusiveArea === "under85") {
      totalRate = 0.084; // 8.4%
      rateDescription = "8.4% (취득세+교육세 포함)";
    }
    // #8: 85㎡ 초과
    else {
      totalRate = 0.09; // 9%
      rateDescription = "9% (취득세+교육세 포함)";
    }
  }
  // 3주택 이상
  else if (houseCount === 3) {
    // #9: 85㎡ 이하
    if (exclusiveArea === "under85") {
      totalRate = 0.124; // 12.4%
      rateDescription = "12.4% (취득세+교육세 포함)";
    }
    // #10: 85㎡ 초과
    else {
      totalRate = 0.134; // 13.4%
      rateDescription = "13.4% (취득세+교육세 포함)";
    }
  }
  else {
    totalRate = 0.011;
    rateDescription = "1.1%";
  }

  const totalTax = Math.floor(price * totalRate);

  return {
    tax: totalTax,
    rate: rateDescription,
    breakdown: {
      acquisitionTax: totalTax,
      localEducationTax: 0,
      ruralSpecialTax: 0,
    },
  };
}

function calculateLegacyTax(price: number, houseCount: number): TaxResult {
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
