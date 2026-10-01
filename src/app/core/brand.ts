/**
 * Single source of truth for the brand.
 *
 * Every brand reference on the site reads from here: change these values and
 * the name, wordmark, contact details and legal footer change everywhere.
 *
 * Names, addresses and numbers are the same in every language and stay here as
 * they are. Anything with words in it — the strapline, the calls to action,
 * the yield qualifier — is a translation key resolved through the `t` pipe.
 */
const BRAND_BASE = {
  name: 'Apex Developments',
  wordmarkLead: 'Apex',
  wordmarkTail: 'Developments',
  isPlaceholder: false,

  coreIdea: 'brand.coreIdea',
  descriptor: 'brand.descriptor',

  email: 'hello@apexdevelopments.id',
  phone: '+62 361 000 000',
  phoneHref: 'tel:+62361000000',
  whatsapp: '+90 533 399 46 48',
  /** Digits only, international, no leading zero — the form wa.me accepts. */
  whatsappDigits: '905333994648',
  address: ['Jl. Pantai Pererenan No. 88', 'Mengwi, Badung, Bali 80351', 'Indonesia'],
  hours: 'brand.hours',

  cta: {
    primary: 'cta.primary',
    opportunity: 'cta.opportunity',
    process: 'cta.process',
    overview: 'cta.overview',
    tailorMade: 'cta.tailorMade',
    project: 'cta.project',
    insights: 'cta.insights',
  },
} as const;

/** Builds a wa.me link with a prefilled message, from the one number above. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${BRAND_BASE.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export const BRAND = BRAND_BASE;

/** The yield claim and its mandatory qualifier. Never show one without the other. */
export const YIELD_CLAIM = {
  /**
   * The band the portfolio is modelled to sit inside, on the base scenario.
   * It is deliberately a little wider than the portfolio's own spread, so a
   * future project below today's lowest figure does not move the claim.
   */
  range: '15–22%',
  headline: 'yield.headline',
  subline: 'yield.subline',
  footnote: 'yield.footnote',
} as const;

/**
 * The demand numbers, with their sources attached.
 *
 * Every figure the site publishes about tourism carries a period and a source,
 * because a statistic without one is decoration. They are listed here rather
 * than written into a page so a single update moves all of them.
 */
export const TOURISM = {
  baliArrivals2025: 6_948_754,
  baliArrivalsLabel: '6,948,754',
  baliArrivalsShort: '6.95M',
  baliGrowthPct: 9.72,
  /** Worldwide, 2025. */
  globalArrivalsBn: 1.5,
  /** Travel & tourism's contribution to world GDP, 2025, in US dollars. */
  globalGdpTn: 11.6,
  period: '2025',
  baliSentence: 'tourism.bali',
  globalSentence: 'tourism.global',
  sources: [
    {
      label: 'tourism.source.bpsArrivals',
      url: 'https://bali.bps.go.id/en/news/2026/02/02/347/bali-s-foreign-arrivals-jan-dec-2025-rise--with-australia-remaining-the-largest-contributor-overall-.htm',
    },
    {
      label: 'tourism.source.bpsOverview',
      url: 'https://bali.bps.go.id/en/pressrelease/2026/02/02/718014/tourism-overview-of-bali-province--december-2025.html',
    },
    {
      label: 'tourism.source.wttc',
      url: 'https://wttc.org/news/travel-tourism-sees-best-year-ever-outpacing-global-economy-in-2025',
    },
    {
      label: 'tourism.source.wef',
      url: 'https://www.weforum.org/publications/travel-tourism-development-index-2026/in-full/2-global-context/',
    },
  ],
} as const;
