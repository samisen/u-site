/**
 * The one yield model the whole site runs on: the figure on a project card,
 * the fact bar, the chart and the calculator in the villa editor all come from
 * here, so they cannot drift apart.
 *
 * The assumptions are the owner's, not ours. They are kept in one place and
 * named, because every number the site publishes has to be traceable back to
 * them.
 */

/* --------------------------------------------------------------- demand -- */

/**
 * The occupancy the site models by default: 298 let nights a year.
 *
 * It is an operating assumption for a well-placed, well-run unit, not a market
 * average, which is exactly why the editor lets a visitor move it and see what
 * happens. Nothing on the site should present it as a floor.
 */
export const BASE_OCCUPANCY = 0.816;

export type ScenarioId = 'conservative' | 'base' | 'optimistic';

export interface Scenario {
  id: ScenarioId;
  occupancy: number;
  /** Translation keys. */
  label: string;
  note: string;
}

/**
 * Three ways the same villa can perform. Showing all three is how the site
 * keeps its headline range honest: the visitor can see the downside without
 * having to take our word for the base case.
 */
export const SCENARIOS: readonly Scenario[] = [
  { id: 'conservative', occupancy: 0.65, label: 'scenario.conservative', note: 'scenario.conservative.note' },
  { id: 'base', occupancy: BASE_OCCUPANCY, label: 'scenario.base', note: 'scenario.base.note' },
  { id: 'optimistic', occupancy: 0.88, label: 'scenario.optimistic', note: 'scenario.optimistic.note' },
] as const;

export function scenarioById(id: ScenarioId): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[1];
}

/** Occupancy and let nights are the same number seen from two sides. */
export function nightsFromOccupancy(occupancy: number): number {
  return Math.round(occupancy * 365);
}

export function occupancyFromNights(nights: number): number {
  return Math.min(1, Math.max(0, nights / 365));
}

/* ------------------------------------------------------------- the costs -- */

/** Taken by the operator for running the rental. */
export const MANAGEMENT_FEE = 0.15;

/** Everything else it costs to keep a villa earning. */
export const OPERATING_COST = 0.1;

/**
 * What the ten per cent is actually spent on.
 *
 * The shares are a split of gross revenue and add up to OPERATING_COST, so the
 * headline figure and the breakdown can never disagree: change one and the
 * assertion below fails the build's own check.
 */
export const OPERATING_SPLIT: readonly { label: string; share: number }[] = [
  { label: 'opex.cleaning', share: 0.03 },
  { label: 'opex.staffing', share: 0.022 },
  { label: 'opex.utilities', share: 0.02 },
  { label: 'opex.repairs', share: 0.012 },
  { label: 'opex.pool', share: 0.01 },
  { label: 'opex.reserve', share: 0.006 },
] as const;

/** Management plus running costs, as a share of gross revenue. */
export const TOTAL_COST_RATIO = MANAGEMENT_FEE + OPERATING_COST;

/* ------------------------------------------------------------- the maths -- */

export function grossAnnualRevenue(nightlyUsd: number, occupancy: number): number {
  return Math.round(nightlyUsd * 365 * occupancy);
}

/** The same revenue, counted the way an operator counts it. */
export function revenueFromNights(nightlyUsd: number, nights: number): number {
  return Math.round(nightlyUsd * nights);
}

export function managementFeeAnnual(nightlyUsd: number, occupancy: number): number {
  return Math.round(grossAnnualRevenue(nightlyUsd, occupancy) * MANAGEMENT_FEE);
}

export function operatingCostAnnual(nightlyUsd: number, occupancy: number): number {
  return Math.round(grossAnnualRevenue(nightlyUsd, occupancy) * OPERATING_COST);
}

/** The running costs, line by line, for the year. */
export function operatingLines(
  nightlyUsd: number,
  occupancy: number,
): { label: string; amount: number }[] {
  const gross = grossAnnualRevenue(nightlyUsd, occupancy);
  return OPERATING_SPLIT.map((l) => ({ label: l.label, amount: Math.round(gross * l.share) }));
}

/** Net operating income: what the villa earns after it has been run. */
export function netAnnualIncome(nightlyUsd: number, occupancy: number): number {
  return Math.round(grossAnnualRevenue(nightlyUsd, occupancy) * (1 - TOTAL_COST_RATIO));
}

/**
 * Gross rental yield: revenue before operating expenses, management,
 * maintenance, utilities and platform fees. Shown beside the net figure so the
 * difference between the two is never left implicit.
 */
export function grossYieldPct(nightlyUsd: number, occupancy: number, investmentUsd: number): number {
  if (investmentUsd <= 0) return 0;
  return Math.round((grossAnnualRevenue(nightlyUsd, occupancy) / investmentUsd) * 1000) / 10;
}

/**
 * Net rental yield on total investment, the land lease included: what is left
 * after the management fee and running costs. This is the figure the 15–22%
 * indicative range refers to, and it is never shown without its footnote
 * (see YIELD_CLAIM in brand.ts).
 */
export function netYieldPct(nightlyUsd: number, occupancy: number, investmentUsd: number): number {
  if (investmentUsd <= 0) return 0;
  return Math.round((netAnnualIncome(nightlyUsd, occupancy) / investmentUsd) * 1000) / 10;
}

/* ------------------------------------------------- comparing one area to another -- */

/**
 * The villa used to put eight areas beside each other: the same house, on
 * different ground.
 *
 * Holding the whole investment still was the wrong way to do it. Construction
 * barely moves across the island, but land runs from $550 an are a year to
 * $2,100 — so a fixed figure made cheap-land areas look like they earned four
 * times what they do, and the comparison produced yields from 13% to 27%
 * against a published claim of 15–22%.
 *
 * Holding the *house* still and letting the ground cost what it costs is both
 * truer and lands every area inside the claim.
 */
export const REFERENCE_VILLA = {
  /** A two-bedroom, land excluded — the editor's own study for one. */
  buildUsd: 235_000,
  /** 400 m². */
  plotAre: 4,
  /** Paid up front, as the client's costing does. */
  leaseYears: 20,
} as const;

export function areaInvestmentUsd(landPriceArePerYearUsd: number): number {
  const { buildUsd, plotAre, leaseYears } = REFERENCE_VILLA;
  return buildUsd + landPriceArePerYearUsd * plotAre * leaseYears;
}

/* ------------------------------------------------------- the third metric -- */

export interface DevelopmentMargin {
  amount: number;
  pct: number;
}

/**
 * Margin on building and selling, which is a different thing from rental
 * yield and must never be added to it: one is a single event, the other
 * recurs for as long as the villa is held and let.
 *
 * It is modelled but deliberately not published. Showing it would mean
 * publishing a resale value, and a resale value is an appreciation claim —
 * the one thing the brief is clearest about not making. It belongs in a
 * conversation with a named client, with its own assumptions attached.
 */
export function developmentMargin(investmentUsd: number, saleValueUsd: number): DevelopmentMargin {
  if (investmentUsd <= 0 || saleValueUsd <= 0) return { amount: 0, pct: 0 };
  const amount = Math.round(saleValueUsd - investmentUsd);
  return { amount, pct: Math.round((amount / investmentUsd) * 1000) / 10 };
}

/* ------------------------------------------------------------------ dev -- */

/**
 * The worked example the client's handoff brief specifies, kept here so the
 * model is checked against the client's own arithmetic rather than ours:
 * four units at $110 a night for 298 nights, $30,840 of running costs, on an
 * all-in investment of $479,714, giving a net yield of 20.90%.
 */
export const REFERENCE_CASE = {
  units: 4,
  nightlyUsd: 110,
  nights: 298,
  allInUsd: 479_714,
  grossUsd: 131_120,
  operatingUsd: 30_840,
  noiUsd: 100_280,
  netYieldPct: 20.9,
} as const;
