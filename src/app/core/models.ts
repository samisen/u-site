export type ProjectStatus = 'available' | 'construction' | 'reserved' | 'delivered' | 'coming-soon';
export type ProjectType = 'villa' | 'townhouse' | 'apartment' | 'commercial' | 'land';
export type AreaId =
  | 'canggu' | 'pererenan' | 'seminyak' | 'uluwatu'
  | 'ubud' | 'sanur' | 'nusa-dua' | 'tabanan';

export interface Area {
  id: AreaId;
  name: string;
  subtitle: string;
  image: string;
  tagline: string;
  description: string;
  landPriceArePerYearUsd: number;   // leasehold land, USD per are (100 m²) per year
  avgNightlyRateUsd: number;
  occupancy: number;                // 0–1
  driveToAirportMin: number;
  bestFor: string[];
}

export interface ConstructionUpdate {
  date: string;
  title: string;
  note: string;
  progress: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  area: AreaId;
  type: ProjectType;
  status: ProjectStatus;
  headline: string;
  summary: string;
  body: string[];
  hero: string;
  gallery: string[];
  video?: string;
  videoPoster?: string;
  pool: string;
  priceFromUsd: number;
  landSqm: number;
  builtSqm: number;
  bedrooms: number;
  bathrooms: number;
  leaseYears: number;
  leaseExtensionYears: number;
  leaseStartYear: number;
  projectedGrossYield: number; // % per year, before costs — the headline figure
  projectedNetYield: number;   // % per year, after management and operating costs
  targetOccupancy: number;     // 0–1
  nightlyRateUsd: number;
  /** Translation key — "Q1 2027" reads differently in every language. */
  handover: string;
  /** Sort value behind that key: year * 10 + quarter, 0 delivered, 99999 none. */
  handoverOrder: number;
  progress: number;            // 0–100
  unitsTotal: number;
  unitsAvailable: number;
  features: string[];
  timeline: ConstructionUpdate[];
}

export interface ProcessStep {
  index: string;
  icon: string;
  title: string;
  duration: string;
  description: string;
  bullets: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  meta: string;
}

export interface Pillar {
  index: string;
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
