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

import { AreaId } from './models';

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
  /** The areas this piece actually talks about. Empty means it is island-wide. */
  areas: AreaId[];
  excerpt: string;
  readMinutes: number;
  date: string;
  author: string;
  image: string;
  body: string[];
}

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

/* ------------------------------------------------------------- insights --- */

/**
 * `areas` is what a piece genuinely discusses, not a tag sprayed on for
 * coverage. The financial pieces carry none, because the arithmetic does not
 * change with the postcode — and saying so is more useful than pretending it
 * does.
 */
const INSIGHT_SOURCE: {
  slug: string;
  category: InsightCategory;
  readMinutes: number;
  image: string;
  paragraphs: number;
  areas?: AreaId[];
}[] = [
  { slug: 'why-bali-lifestyle-tourism-property', category: 'bali-lifestyle', readMinutes: 7, image: 'media/villa-pool-aerial.jpg', paragraphs: 3 },
  { slug: 'personal-use-and-rental-income', category: 'investment', readMinutes: 6, image: 'media/villa-deck.jpg', paragraphs: 3 },
  { slug: 'gross-yield-vs-net-return', category: 'investment', readMinutes: 5, image: 'media/villa-facade.jpg', paragraphs: 3 },
  { slug: 'what-drives-villa-revenue', category: 'operations', readMinutes: 6, image: 'media/villa-pool-lounge.jpg', paragraphs: 3, areas: ['canggu', 'cemagi', 'seminyak', 'uluwatu', 'nyang-nyang'] },
  { slug: 'location-design-guest-experience', category: 'design', readMinutes: 6, image: 'media/villa-deck-pool.jpg', paragraphs: 3, areas: ['uluwatu', 'nyang-nyang', 'seseh', 'ubud', 'canggu'] },
  { slug: 'tailor-made-owner-goals', category: 'development', readMinutes: 5, image: 'media/villa-facade.jpg', paragraphs: 3 },
  { slug: 'owning-in-bali-introduction', category: 'development', readMinutes: 8, image: 'media/villa-deck.jpg', paragraphs: 3 },
  { slug: 'short-term-vs-residential', category: 'operations', readMinutes: 6, image: 'media/villa-pool-lounge.jpg', paragraphs: 3, areas: ['sanur', 'nusa-dua', 'ubud', 'tabanan'] },
  { slug: 'how-to-read-a-villa-investment-model', category: 'investment', readMinutes: 7, image: 'media/villa-pool-aerial.jpg', paragraphs: 4 },
  { slug: 'a-week-in-your-own-bali-villa', category: 'bali-lifestyle', readMinutes: 4, image: 'media/villa-deck-pool.jpg', paragraphs: 3, areas: ['canggu', 'pererenan', 'cemagi', 'seseh', 'uluwatu', 'ubud'] },
];

export const INSIGHTS: Insight[] = INSIGHT_SOURCE.map((a) => ({
  slug: a.slug,
  category: a.category,
  areas: a.areas ?? [],
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

/* ------------------------------------------------------------ living here -- */

/**
 * The part of the decision that is not a spreadsheet.
 *
 * Almost nobody buys here on the numbers alone, and the questions that decide
 * it — where do the children go to school, what happens if someone is ill,
 * can I actually get a week's shopping — were missing from the site entirely.
 */
export const LIVING_HERE = {
  eyebrow: 'living.eyebrow',
  title: 'living.title',
  lead: 'living.lead',
  items: [
    { icon: 'bulb', key: 'school' },
    { icon: 'experiment', key: 'health' },
    { icon: 'thunderbolt', key: 'sport' },
    { icon: 'shop', key: 'food' },
    { icon: 'team', key: 'family' },
    { icon: 'compass', key: 'around' },
  ],
};

/* ----------------------------------------------------------- the craft ----- */

/** What actually gets built, and who builds it. */
export const CRAFT = {
  eyebrow: 'craft.eyebrow',
  title: 'craft.title',
  lead: 'craft.lead',
  items: [
    { icon: 'apartment', key: 'architecture' },
    { icon: 'picture', key: 'interiors' },
    { icon: 'environment', key: 'landscape' },
    { icon: 'crown', key: 'hospitality' },
  ],
};

/* ------------------------------------------------------ zoning and title --- */

/**
 * Indonesia tightened property licensing through 2025 and 2026, and Bali
 * followed with its own provincial rule. Written the way Ugur asked for it —
 * as the reason a properly-checked plot is worth more, not as a warning.
 */
export const DUE_DILIGENCE = {
  eyebrow: 'zoning.eyebrow',
  title: 'zoning.title',
  lead: 'zoning.lead',
  steps: [
    { icon: 'environment', key: 'zone' },
    { icon: 'file-protect', key: 'title' },
    { icon: 'bank', key: 'company' },
    { icon: 'safety-certificate', key: 'permit' },
  ],
  note: 'zoning.note',
};

/* --------------------------------------------------- after the handover ---- */

/** The half of the relationship that starts when the keys change hands. */
export const AFTER_HANDOVER = {
  eyebrow: 'after.eyebrow',
  title: 'after.title',
  lead: 'after.lead',
  steps: [
    { icon: 'key', key: 'keys' },
    { icon: 'schedule', key: 'monthly' },
    { icon: 'fund', key: 'money' },
    { icon: 'swap', key: 'exit' },
  ],
};

/* ------------------------------------------------- how a project starts ---- */

export interface DevelopmentModel {
  id: 'offPlan' | 'tailorMade' | 'landowner';
  icon: string;
  /** Where the enquiry should go, or null while the model is still being shaped. */
  link: string | null;
}

/**
 * The three doors into a project.
 *
 * A visitor arrives in one of these situations and not the others, so naming
 * them is the fastest way to get someone to the right conversation. The
 * landowner route is real but not yet defined in writing, which is why it
 * invites a conversation rather than pointing at a page.
 */
export const DEVELOPMENT_MODELS: DevelopmentModel[] = [
  { id: 'offPlan', icon: 'apartment', link: '/projects' },
  { id: 'tailorMade', icon: 'compass', link: '/design-your-villa' },
  { id: 'landowner', icon: 'environment', link: null },
];


/* ============================================================== homepage ====
   The homepage follows its own brief — a slow hero, two chapters, one scroll
   interaction, a line of values and a dark band — so its content sits here
   rather than being scattered through the template.
   ========================================================================== */


export interface HeroSlide {
  image: string;
  /** The same frame at narrower widths, so a phone decodes a phone-sized one. */
  srcset: string;
  /** Translation key for the place name shown against the counter. */
  place: string;
}

/**
 * Three images, one at a time, crossfading slowly.
 *
 * The brief is strict about their art direction: no people, similar grain and
 * contrast, a calm horizon. These three are the set in hand that holds to
 * that — cool, quiet, unpeopled. What it does not have is the golden hour the
 * brief asks for on the first and third frames; that needs a shoot, not a
 * different crop.
 */
const frame = (name: string) =>
  `img/${name}-800.jpg 800w, img/${name}-1200.jpg 1200w, img/${name}.jpg 1600w`;

export const HERO_SLIDES: HeroSlide[] = [
  { image: 'img/uluwatu-2.jpg', srcset: frame('uluwatu-2'), place: 'home.hero.place.uluwatu' },
  { image: 'img/rice-ubud.jpg', srcset: frame('rice-ubud'), place: 'home.hero.place.ubud' },
  { image: 'img/canggu.jpg', srcset: frame('canggu'), place: 'home.hero.place.canggu' },
];

export interface HomeChapter {
  id: 'discover' | 'create';
  links: { label: string; to: string }[];
}

/** Two chapters, two ways in each. Everything else on the site hangs off these. */
export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: 'discover',
    links: [
      { label: 'home.chapter.discover.link1', to: '/why-bali' },
      { label: 'home.chapter.discover.link2', to: '/locations' },
    ],
  },
  {
    id: 'create',
    links: [
      { label: 'home.chapter.create.link1', to: '/projects' },
      { label: 'home.chapter.create.link2', to: '/design-your-villa' },
    ],
  },
];

/** The scroll-driven triplet. One word is dark at a time; the rest go quiet. */
export const HOME_STAGES = ['design', 'build', 'manage'] as const;
export type HomeStage = (typeof HOME_STAGES)[number];

/** Four words on one line, no icons. */
export const HOME_VALUES = ['designLed', 'endToEnd', 'grounded', 'forBali'] as const;
