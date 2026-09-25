/**
 * Single source of truth for the brand.
 *
 * The developer brief treats "Turta Escape" as a working placeholder, so every
 * brand reference on the site reads from here: change these values and the
 * name, wordmark, contact details and legal footer change everywhere.
 *
 * Names, addresses and numbers are the same in every language and stay here as
 * they are. Anything with words in it — the strapline, the calls to action,
 * the yield qualifier — is a translation key resolved through the `t` pipe.
 */
const BRAND_BASE = {
  name: 'Turta Escape',
  wordmarkLead: 'Turta',
  wordmarkTail: 'Escape',
  isPlaceholder: true,

  coreIdea: 'brand.coreIdea',
  descriptor: 'brand.descriptor',

  email: 'hello@turtaescape.com',
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
  /** A number, so it reads the same everywhere. */
  range: '14–20%',
  headline: 'yield.headline',
  subline: 'yield.subline',
  footnote: 'yield.footnote',
} as const;

export const TOURISM = {
  baliArrivals2025: 6_948_754,
  baliArrivalsLabel: '6,948,754',
  baliArrivalsShort: '6.95M',
  baliGrowthPct: 9.72,
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
    { label: 'tourism.source.unTourism', url: 'https://www.unwto.org/' },
  ],
} as const;
