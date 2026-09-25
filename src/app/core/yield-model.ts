/**
 * The single yield model used across the site: the figure on a project card,
 * the figure in the fact bar and the calculator on the project page all come
 * from here, so they cannot drift apart.
 */
export const MANAGEMENT_FEE = 0.15;
export const OPERATING_COST = 0.1;

export function grossAnnualRevenue(nightlyUsd: number, occupancy: number): number {
  return Math.round(nightlyUsd * 365 * occupancy);
}

export function netAnnualIncome(nightlyUsd: number, occupancy: number): number {
  return Math.round(grossAnnualRevenue(nightlyUsd, occupancy) * (1 - MANAGEMENT_FEE - OPERATING_COST));
}

/**
 * Gross rental yield: revenue before operating expenses, taxes, management,
 * maintenance, utilities and platform fees. Shown beside the net figure so the
 * difference between the two is never left implicit.
 */
export function grossYieldPct(nightlyUsd: number, occupancy: number, investmentUsd: number): number {
  if (investmentUsd <= 0) return 0;
  return Math.round((grossAnnualRevenue(nightlyUsd, occupancy) / investmentUsd) * 1000) / 10;
}

/**
 * Net rental yield on total investment, the land lease included: what is left
 * after the management fee and operating costs. This is the figure the 14–20%
 * indicative range refers to, and it is never shown without its footnote
 * (see YIELD_CLAIM in brand.ts).
 */
export function netYieldPct(nightlyUsd: number, occupancy: number, investmentUsd: number): number {
  if (investmentUsd <= 0) return 0;
  return Math.round((netAnnualIncome(nightlyUsd, occupancy) / investmentUsd) * 1000) / 10;
}
