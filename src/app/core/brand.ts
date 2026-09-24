/**
 * Single source of truth for the brand.
 *
 * The developer brief treats "Turta Escape" as a working placeholder, so every
 * brand reference on the site reads from here: change these values and the
 * name, wordmark, contact details and legal footer change everywhere.
 */
export const BRAND = {
  name: 'Turta Escape',
  wordmarkLead: 'Turta',
  wordmarkTail: 'Escape',
  isPlaceholder: true,

  coreIdea: 'Own the lifestyle. Enjoy the experience. Let your property work for you.',
  descriptor: 'Tailor-made villas in Bali',

  email: 'hello@turtaescape.com',
  phone: '+62 361 000 000',
  phoneHref: 'tel:+62361000000',
  whatsapp: '+62 812 0000 0000',
  /** Placeholder number — swap for the real one before launch. */
  whatsappUrl:
    'https://wa.me/6281200000000?text=' +
    encodeURIComponent("Hello Turta Escape, I'd like to talk about a villa project in Bali."),
  address: ['Jl. Pantai Pererenan No. 88', 'Mengwi, Badung, Bali 80351', 'Indonesia'],
  hours: 'Mon–Sat, 09:00–18:00 WITA (UTC+8)',

  cta: {
    primary: 'Start a Conversation',
    opportunity: 'Explore the Opportunity',
    process: 'See How It Works',
    overview: 'Request the Investment Overview',
    tailorMade: 'Tell Us How You Want to Use Your Villa',
    project: 'View Project Details',
    insights: 'Read the Insights',
  },
} as const;

/** The yield claim and its mandatory qualifier. Never show one without the other. */
export const YIELD_CLAIM = {
  range: '12–22%',
  headline: '12–22%* Indicative Gross Rental Yield',
  subline:
    'Potential gross rental yield for selected villa concepts, depending on location, design, pricing, occupancy and operating model.',
  footnote:
    '*Indicative range, not a guarantee. Actual performance varies by project. Gross yield is before operating expenses, taxes, management, maintenance, utilities, platform fees and other costs.',
} as const;

export const TOURISM = {
  baliArrivals2025: 6_948_754,
  baliArrivalsLabel: '6,948,754',
  baliArrivalsShort: '6.95M',
  baliGrowthPct: 9.72,
  baliSentence:
    'In 2025, Bali recorded 6,948,754 direct foreign tourist arrivals, an increase of 9.72% from 2024.',
  globalSentence:
    'Around 1.4 billion international tourist arrivals were recorded worldwide in 2024.',
  sources: [
    {
      label: 'BPS Statistics Indonesia — Bali foreign arrivals, Jan–Dec 2025',
      url: 'https://bali.bps.go.id/en/news/2026/02/02/347/bali-s-foreign-arrivals-jan-dec-2025-rise--with-australia-remaining-the-largest-contributor-overall-.htm',
    },
    {
      label: 'BPS Statistics Indonesia — Tourism overview of Bali Province, December 2025',
      url: 'https://bali.bps.go.id/en/pressrelease/2026/02/02/718014/tourism-overview-of-bali-province--december-2025.html',
    },
    { label: 'UN Tourism — international arrivals benchmark', url: 'https://www.unwto.org/' },
  ],
} as const;
