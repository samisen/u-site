/**
 * Site copy, taken from the developer brief.
 *
 * Every human-readable string here is a translation key rather than a phrase:
 * the words themselves live in `public/i18n/<locale>.json` and are resolved by
 * the `t` pipe (or `I18nService.t`) at render time. Numbers, ids, image paths
 * and URLs stay here, because they do not change with the language.
 *
 * Language rules from the brief: use "tailor-made", "potential / indicative /
 * projected", "designed to perform as well as possible". Never "guaranteed
 * return", "passive income", "best investment", "make money quickly",
 * "one-size-fits-all", or fear-based framing.
 */

export interface ValuePillar {
  key: 'lifestyle' | 'investment';
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  points: string[];
  image: string;
}

export interface BuildStep {
  index: string;
  name: string;
  icon: string;
  line: string;
  detail: string;
}

export interface OwnerProfile {
  id: 'lifestyle' | 'income' | 'hybrid';
  name: string;
  subtitle: string;
  description: string;
  priorities: string[];
  image: string;
}

export interface MarketYield {
  /** Stable id; the market's name is a key derived from it. */
  id: string;
  market: string;
  yieldPct: number;
}

export type InsightCategory =
  | 'bali-lifestyle'
  | 'investment'
  | 'development'
  | 'design'
  | 'operations';

export interface Insight {
  slug: string;
  title: string;
  category: InsightCategory;
  excerpt: string;
  readMinutes: number;
  date: string;
  author: string;
  image: string;
  body: string[];
}

/* ---------------------------------------------------------------- hero ---- */

export const HERO = {
  headline: 'home.hero.headline',
  support: 'home.hero.support',
  video: 'media/villa-tour-short.mp4',
  poster: 'media/villa-pool-aerial.jpg',
};

/* -------------------------------------------------------- the two values -- */

export const TWO_VALUES: ValuePillar[] = [
  {
    key: 'lifestyle',
    eyebrow: 'home.value.lifestyle.eyebrow',
    title: 'home.value.lifestyle.title',
    lead: 'home.value.lifestyle.lead',
    body: 'home.value.lifestyle.body',
    points: [
      'home.value.lifestyle.point1',
      'home.value.lifestyle.point2',
      'home.value.lifestyle.point3',
    ],
    image: 'media/villa-pool-lounge.jpg',
  },
  {
    key: 'investment',
    eyebrow: 'home.value.investment.eyebrow',
    title: 'home.value.investment.title',
    lead: 'home.value.investment.lead',
    body: 'home.value.investment.body',
    points: [
      'home.value.investment.point1',
      'home.value.investment.point2',
      'home.value.investment.point3',
    ],
    image: 'media/villa-pool-aerial.jpg',
  },
];

/* ------------------------------------------------------------- why bali --- */

export const WHY_BALI = {
  eyebrow: 'whyBali.eyebrow',
  title: 'whyBali.title',
  lead: 'whyBali.lead',
  paragraphs: ['whyBali.para1', 'whyBali.para2'],
  facets: [
    { id: 'architecture', icon: 'gold' },
    { id: 'wellness', icon: 'experiment' },
    { id: 'food', icon: 'shop' },
    { id: 'work', icon: 'global' },
    { id: 'nature', icon: 'compass' },
    { id: 'community', icon: 'team' },
  ].map((f) => ({
    icon: f.icon,
    title: `whyBali.facet.${f.id}.title`,
    text: `whyBali.facet.${f.id}.text`,
  })),
};

/* ---------------------------------------------------------- opportunity --- */

export const OPPORTUNITY = {
  eyebrow: 'opportunity.eyebrow',
  title: 'opportunity.title',
  lead: 'opportunity.lead',
  paragraphs: ['opportunity.para1', 'opportunity.para2'],
  drivers: [
    { id: 'location', icon: 'environment' },
    { id: 'design', icon: 'gold' },
    { id: 'guest', icon: 'team' },
    { id: 'operations', icon: 'schedule' },
  ].map((d) => ({
    icon: d.icon,
    title: `opportunity.driver.${d.id}.title`,
    text: `opportunity.driver.${d.id}.text`,
  })),
};

/**
 * Broad country-level residential gross rental yields, from Global Property
 * Guide (updated September 2026). Context only: these are standard long-term
 * residential figures and are NOT comparable to a Bali short-term hospitality
 * model. Never chart them in the same series as the Bali range.
 */
export const MARKET_YIELDS: MarketYield[] = [
  { id: 'australia', market: 'market.australia', yieldPct: 4.94 },
  { id: 'uae', market: 'market.uae', yieldPct: 4.94 },
  { id: 'canada', market: 'market.canada', yieldPct: 5.8 },
  { id: 'thailand', market: 'market.thailand', yieldPct: 6.54 },
  { id: 'usa', market: 'market.usa', yieldPct: 6.71 },
  { id: 'uk', market: 'market.uk', yieldPct: 7.35 },
];

export const MARKET_YIELDS_META = {
  measure: 'marketYields.measure',
  period: 'marketYields.period',
  source: 'marketYields.source',
  sourceUrl: 'https://www.globalpropertyguide.com/rental-yields',
  caveat: 'marketYields.caveat',
};

/* --------------------------------------------------------- how we build --- */

export const BUILD_STEPS: BuildStep[] = [
  { id: 'land', icon: 'environment' },
  { id: 'concept', icon: 'compass' },
  { id: 'design', icon: 'deployment-unit' },
  { id: 'construction', icon: 'tool' },
  { id: 'setup', icon: 'key' },
  { id: 'operations', icon: 'rise' },
].map((s, i) => ({
  index: String(i + 1).padStart(2, '0'),
  icon: s.icon,
  name: `buildStep.${s.id}.name`,
  line: `buildStep.${s.id}.line`,
  detail: `buildStep.${s.id}.detail`,
}));

/* -------------------------------------------------------- owner profiles -- */

export const OWNER_PROFILES: OwnerProfile[] = (
  [
    { id: 'lifestyle', image: 'media/villa-deck.jpg' },
    { id: 'income', image: 'media/villa-pool-aerial.jpg' },
    { id: 'hybrid', image: 'media/villa-facade.jpg' },
  ] as const
).map((p) => ({
  id: p.id,
  image: p.image,
  name: `ownerProfile.${p.id}.name`,
  subtitle: `ownerProfile.${p.id}.subtitle`,
  description: `ownerProfile.${p.id}.description`,
  priorities: [
    `ownerProfile.${p.id}.priority1`,
    `ownerProfile.${p.id}.priority2`,
    `ownerProfile.${p.id}.priority3`,
  ],
}));

export const TAILOR_MADE_LINE = 'process.tailorMade';
export const ROLE_LINE = 'process.role';
export const BELIEF_LINE = 'process.belief';
export const MISSION_LINE = 'home.mission';

/* ------------------------------------------------------------- insights --- */

const INSIGHT_SOURCE: {
  slug: string;
  category: InsightCategory;
  readMinutes: number;
  image: string;
  paragraphs: number;
}[] = [
  { slug: 'why-bali-lifestyle-tourism-property', category: 'bali-lifestyle', readMinutes: 7, image: 'media/villa-pool-aerial.jpg', paragraphs: 3 },
  { slug: 'personal-use-and-rental-income', category: 'investment', readMinutes: 6, image: 'media/villa-deck.jpg', paragraphs: 3 },
  { slug: 'gross-yield-vs-net-return', category: 'investment', readMinutes: 5, image: 'media/villa-facade.jpg', paragraphs: 3 },
  { slug: 'what-drives-villa-revenue', category: 'operations', readMinutes: 6, image: 'media/villa-pool-lounge.jpg', paragraphs: 3 },
  { slug: 'location-design-guest-experience', category: 'design', readMinutes: 6, image: 'media/villa-deck-pool.jpg', paragraphs: 3 },
  { slug: 'tailor-made-owner-goals', category: 'development', readMinutes: 5, image: 'media/villa-facade.jpg', paragraphs: 3 },
  { slug: 'owning-in-bali-introduction', category: 'development', readMinutes: 8, image: 'media/villa-deck.jpg', paragraphs: 3 },
  { slug: 'short-term-vs-residential', category: 'operations', readMinutes: 6, image: 'media/villa-pool-lounge.jpg', paragraphs: 3 },
  { slug: 'how-to-read-a-villa-investment-model', category: 'investment', readMinutes: 7, image: 'media/villa-pool-aerial.jpg', paragraphs: 4 },
  { slug: 'a-week-in-your-own-bali-villa', category: 'bali-lifestyle', readMinutes: 4, image: 'media/villa-deck-pool.jpg', paragraphs: 3 },
];

export const INSIGHTS: Insight[] = INSIGHT_SOURCE.map((a) => ({
  slug: a.slug,
  category: a.category,
  readMinutes: a.readMinutes,
  image: a.image,
  title: `insight.${a.slug}.title`,
  excerpt: `insight.${a.slug}.excerpt`,
  date: `insight.${a.slug}.date`,
  author: 'insight.author.editorial',
  body: Array.from({ length: a.paragraphs }, (_, i) => `insight.${a.slug}.body${i + 1}`),
}));

/** `all` is the unfiltered view rather than a category an article can carry. */
export const INSIGHT_CATEGORIES = [
  'all',
  'bali-lifestyle',
  'investment',
  'development',
  'design',
  'operations',
] as const;

export type InsightFilter = (typeof INSIGHT_CATEGORIES)[number];

/** Display key for a category id, used by the filter row and every card. */
export function insightCategoryKey(id: InsightFilter): string {
  return `insight.category.${id}`;
}
