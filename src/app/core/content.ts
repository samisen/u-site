/**
 * Site copy, taken from the developer brief.
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
  market: string;
  yieldPct: number;
}

export interface Insight {
  slug: string;
  title: string;
  category: 'Bali Lifestyle' | 'Investment' | 'Development' | 'Design' | 'Operations';
  excerpt: string;
  readMinutes: number;
  date: string;
  author: string;
  image: string;
  body: string[];
}

/* ---------------------------------------------------------------- hero ---- */

export const HERO = {
  headline: 'A Place to Live. A Property to Enjoy. An Investment Designed to Perform.',
  support: 'Tailor-made villas in Bali created around how you want to live, stay and invest.',
  video: 'media/villa-tour-short.mp4',
  poster: 'media/villa-pool-aerial.jpg',
};

/* -------------------------------------------------------- the two values -- */

export const TWO_VALUES: ValuePillar[] = [
  {
    key: 'lifestyle',
    eyebrow: 'Own the lifestyle',
    title: 'The Lifestyle',
    lead: 'Your own place in Bali. A villa to return to, enjoy, share and experience.',
    body: 'A personal place in Bali: a villa to stay in, return to, share with family and friends, and use as a private base for holidays or longer stays.',
    points: [
      'Come for a week. Stay for a month.',
      'Bring your family. Work from Bali.',
      'A private base, not a hotel room.',
    ],
    image: 'media/villa-pool-lounge.jpg',
  },
  {
    key: 'investment',
    eyebrow: 'Participate in the opportunity',
    title: 'The Investment',
    lead: 'When you are away, your property can be prepared for the hospitality market.',
    body: 'A property designed around location, guest demand, architecture, operations and revenue potential, so the owner can use the villa and participate in Bali’s hospitality economy when away.',
    points: [
      'Designed around guest demand, not only taste.',
      'Operated to perform as well as possible.',
      'Revenue assumptions written down, not implied.',
    ],
    image: 'media/villa-pool-aerial.jpg',
  },
];

/* ------------------------------------------------------------- why bali --- */

export const WHY_BALI = {
  eyebrow: 'Why Bali',
  title: 'Own a Piece of the Lifestyle',
  lead: 'Bali is more than a destination. It is a lifestyle people return to.',
  paragraphs: [
    'Millions of people come to Bali to experience the lifestyle. They spend on accommodation, food, wellness and experiences. That flow of visitors supports a large hospitality economy, and property owners can participate in that economy while still keeping the lifestyle value of their own villa.',
    'We give you the opportunity to own a piece of the property side of that economy — without giving up the reason you wanted a place in Bali in the first place.',
  ],
  facets: [
    { icon: 'gold', title: 'Architecture', text: 'Open-air living, natural materials and a climate that lets a building breathe all year.' },
    { icon: 'experiment', title: 'Wellness', text: 'Yoga, retreats, spa and recovery — a mature market with guests who book long stays.' },
    { icon: 'shop', title: 'Food', text: 'From warungs to award-listed kitchens, an eating culture that keeps visitors in one area.' },
    { icon: 'global', title: 'Work from Bali', text: 'Fibre, co-working and a time zone that overlaps Asia and Australia in the same day.' },
    { icon: 'compass', title: 'Nature', text: 'Surf, volcanoes, rice terraces and reef — within an hour of almost anywhere on the island.' },
    { icon: 'team', title: 'Community', text: 'An established international community alongside a living local culture.' },
  ],
};

/* ---------------------------------------------------------- opportunity --- */

export const OPPORTUNITY = {
  eyebrow: 'The opportunity',
  title: 'Your Property Can Do More',
  lead: 'A villa in Bali is rarely let the way a city apartment is let.',
  paragraphs: [
    'Most villas here operate on a short-term hospitality model rather than a long residential tenancy. Guests book for nights and weeks, rates move with season and demand, and the property is run much closer to a small hotel than to a rental flat.',
    'That changes what matters. Location, the way the villa is designed, the quality of the guest experience and the standard of day-to-day operations all move revenue — which is why we treat them as design decisions rather than afterthoughts.',
  ],
  drivers: [
    { icon: 'environment', title: 'Location', text: 'Where the villa sits decides who books it, at what rate, and how often it sits empty.' },
    { icon: 'gold', title: 'Design', text: 'Layout, light, privacy and the photograph a guest sees first. Design is a revenue input.' },
    { icon: 'team', title: 'Guest experience', text: 'Arrival, service, cleanliness and responsiveness drive reviews — and reviews drive rate.' },
    { icon: 'schedule', title: 'Operations', text: 'Pricing, channels, housekeeping, maintenance and reporting, run consistently.' },
  ],
};

/**
 * Broad country-level residential gross rental yields, from Global Property
 * Guide (updated September 2026). Context only: these are standard long-term
 * residential figures and are NOT comparable to a Bali short-term hospitality
 * model. Never chart them in the same series as the Bali range.
 */
export const MARKET_YIELDS: MarketYield[] = [
  { market: 'Australia', yieldPct: 4.94 },
  { market: 'United Arab Emirates', yieldPct: 4.94 },
  { market: 'Canada', yieldPct: 5.8 },
  { market: 'Thailand', yieldPct: 6.54 },
  { market: 'United States', yieldPct: 6.71 },
  { market: 'United Kingdom', yieldPct: 7.35 },
];

export const MARKET_YIELDS_META = {
  measure: 'Broad residential gross rental yield',
  period: 'Q3 2026',
  source: 'Global Property Guide — Residential Rental Yields by Country',
  sourceUrl: 'https://www.globalpropertyguide.com/rental-yields',
  caveat:
    'Country figures are broad residential averages for standard long-term rental. Bali villa economics can differ because they may use a short-term hospitality model rather than residential rent.',
};

/* --------------------------------------------------------- how we build --- */

export const BUILD_STEPS: BuildStep[] = [
  {
    index: '01',
    name: 'Land',
    icon: 'environment',
    line: 'We find and verify the plot, and check what can legally be built on it.',
    detail:
      'Sourcing in the areas that fit your brief, then legal due diligence: certificate history, zoning, access, water and the position of the local banjar. If a plot does not clear, we say so and move on.',
  },
  {
    index: '02',
    name: 'Concept',
    icon: 'compass',
    line: 'We agree what the villa is for before we draw anything.',
    detail:
      'How you want to use it, how often, and what you want it to do when you are away. That conversation sets bedroom count, layout, budget band and the revenue assumptions everything else is tested against.',
  },
  {
    index: '03',
    name: 'Design',
    icon: 'deployment-unit',
    line: 'Architecture, engineering and a costed bill of quantities.',
    detail:
      'Concept, then developed design, then a line-item bill of quantities. You approve a drawing set and a priced schedule rather than a rate per square metre that drifts.',
  },
  {
    index: '04',
    name: 'Construction',
    icon: 'tool',
    line: 'Permits, then building, with the costs reconciled as we go.',
    detail:
      'PBG permit and groundworks, then the build under our own site supervision. Photographs every week and spend reconciled against the bill of quantities every month, so variances are visible while they are still small.',
  },
  {
    index: '05',
    name: 'Setup',
    icon: 'key',
    line: 'Furniture, licences, photography and the listing, before handover.',
    detail:
      'Snagging, utilities, the furniture package, operating licences, professional photography and the listing copy — prepared in the final weeks of construction so the villa is ready to receive guests, not just ready to hand over.',
  },
  {
    index: '06',
    name: 'Operations',
    icon: 'rise',
    line: 'Guests, staff, maintenance and a clear monthly statement.',
    detail:
      'Multi-channel listing and pricing, 24/7 guest reception, housekeeping and preventive maintenance — and one statement each month showing revenue, costs and what was transferred to you.',
  },
];

/* -------------------------------------------------------- owner profiles -- */

export const OWNER_PROFILES: OwnerProfile[] = [
  {
    id: 'lifestyle',
    name: 'Lifestyle Home',
    subtitle: 'Mostly yours',
    description:
      'The villa is first a place you use. Layout, storage and privacy are designed around how you and your family actually live, and any guest letting fits around your own calendar.',
    priorities: ['Your calendar comes first', 'Personal storage and lock-up', 'Designed around your habits'],
    image: 'media/villa-deck.jpg',
  },
  {
    id: 'income',
    name: 'Income-Focused Villa',
    subtitle: 'Mostly working',
    description:
      'The villa is designed around guest demand: bedroom mix, pool position, photographability and the operational details that keep turnaround fast and reviews high.',
    priorities: ['Designed around guest demand', 'Operationally efficient', 'Revenue assumptions documented'],
    image: 'media/villa-pool-aerial.jpg',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    subtitle: 'Both, deliberately',
    description:
      'You use the villa for part of the year and it works for the rest. The design carries an owner’s suite that locks away, and the operating plan is built around your blocked dates.',
    priorities: ['Owner suite that locks', 'Blocked dates without penalty', 'Balanced design decisions'],
    image: 'media/villa-facade.jpg',
  },
];

export const TAILOR_MADE_LINE =
  'Every owner has a different right villa. We shape it around your location, your budget and what you want the property to do.';

export const ROLE_LINE =
  'Our role is to bring together the right people, knowledge and execution to help you make your Bali property as good as possible.';

export const BELIEF_LINE = 'We believe the value of a Bali villa goes beyond the building itself.';

export const MISSION_LINE =
  'We create tailor-made villas that let you experience Bali your way — while designing the property around your personal goals and its revenue potential.';

/* ------------------------------------------------------------- insights --- */

export const INSIGHTS: Insight[] = [
  {
    slug: 'why-bali-lifestyle-tourism-property',
    title: 'Why Bali: The Lifestyle, Tourism and Property Story',
    category: 'Bali Lifestyle',
    excerpt:
      'What actually sits underneath the island’s property market — arrivals, length of stay, and why the two matter differently to an owner.',
    readMinutes: 7,
    date: '12 September 2026',
    author: 'Editorial team',
    image: 'media/villa-pool-aerial.jpg',
    body: [
      'Bali received 6,948,754 direct foreign tourist arrivals in 2025, an increase of 9.72% on 2024. That single figure is the reason most people start looking at property here, but on its own it explains very little. What matters to an owner is not how many people land at the airport — it is how long they stay, what they book, and where.',
      'A guest staying nine nights in Ubud and a guest staying two nights in Kuta contribute to the same arrivals number and behave completely differently as revenue. Length of stay changes your cleaning cost per night, your channel mix, your cancellation profile and how exposed you are to low season.',
      'The useful question is therefore narrower than "is Bali growing?". It is: which part of this demand does my villa actually serve, and is the property designed for that guest? That question is answerable at design stage, and very expensive to answer after handover.',
    ],
  },
  {
    slug: 'personal-use-and-rental-income',
    title: 'How a Bali Villa Can Combine Personal Use and Rental Income',
    category: 'Investment',
    excerpt:
      'The trade-offs between blocking your own dates and keeping a calendar attractive to guests — and how design can soften them.',
    readMinutes: 6,
    date: '2 September 2026',
    author: 'Editorial team',
    image: 'media/villa-deck.jpg',
    body: [
      'Every week you keep for yourself is a week the villa is not earning. That is simply true, and any brochure that pretends otherwise is not worth reading. The interesting part is that the cost of those weeks is not constant — it depends entirely on which weeks you take.',
      'Take the first two weeks of August and you are removing your highest-rate nights of the year. Take late October and the same fortnight costs a fraction of that. Owners who plan their own use around the shoulder season often find the difference between the two patterns is larger than any operational saving anyone can offer them.',
      'Design helps too. An owner’s suite that can be locked and serviced separately lets the rest of the villa work while your things stay where you left them, which removes the practical friction that usually pushes owners towards using the property less than they intended.',
    ],
  },
  {
    slug: 'gross-yield-vs-net-return',
    title: 'Understanding Gross Rental Yield vs Net Return',
    category: 'Investment',
    excerpt:
      'Two numbers, frequently confused, often deliberately. What sits between them, and which one you should be asking for.',
    readMinutes: 5,
    date: '24 August 2026',
    author: 'Editorial team',
    image: 'media/villa-facade.jpg',
    body: [
      'Gross rental yield is annual rental revenue divided by what the property cost. It is a useful comparison metric precisely because it is crude — it ignores everything that happens between a guest paying and money reaching you.',
      'Between those two points sit channel commissions, management fees, housekeeping, laundry, utilities, pool and garden, repairs, a sinking fund for replacement, taxes and the cost of the nights nobody booked. Depending on the property and the operating model, they can account for a third to a half of gross revenue.',
      'So a gross figure is not wrong, it is just incomplete. When you are given one, the question to ask is simply: what does this become after costs, and which costs are in your list? A developer who can answer that quickly, with their own numbers, is telling you something useful about how they operate.',
    ],
  },
  {
    slug: 'what-drives-villa-revenue',
    title: 'What Drives Villa Revenue in Bali?',
    category: 'Operations',
    excerpt:
      'Rate, occupancy and length of stay pull against each other. Understanding how is most of the job.',
    readMinutes: 6,
    date: '15 August 2026',
    author: 'Editorial team',
    image: 'media/villa-pool-lounge.jpg',
    body: [
      'Revenue is rate multiplied by occupancy, and the two move against each other. Drop your rate and you fill the calendar, but you may fill it with shorter stays that cost more to service. Hold your rate and you keep margin per night, but you carry more empty nights.',
      'The properties that do well are rarely the cheapest or the most expensive in their street. They are the ones where the rate is set deliberately against a known guest — and where the operator adjusts it weekly rather than setting it once at launch.',
      'The third variable, length of stay, is the one most owners never look at. Two seven-night bookings and seven two-night bookings can produce the same occupancy and completely different margins.',
    ],
  },
  {
    slug: 'location-design-guest-experience',
    title: 'Location, Design and Guest Experience: The Three Drivers of Villa Demand',
    category: 'Design',
    excerpt:
      'Why the three cannot be separated, and what happens to a property when one of them is treated as optional.',
    readMinutes: 6,
    date: '6 August 2026',
    author: 'Editorial team',
    image: 'media/villa-deck-pool.jpg',
    body: [
      'Location sets your ceiling. Design decides how much of that ceiling you reach. Guest experience decides whether you keep reaching it in year three.',
      'The common failure is treating them in sequence — buy the land, then design something, then find someone to run it. Each decision then constrains the next one, usually badly: a plot with a beautiful view and a layout that faces away from it, or a villa that photographs well and takes four hours to turn around between guests.',
      'Taken together at concept stage, the three reinforce each other, and the compromises become explicit choices rather than discoveries.',
    ],
  },
  {
    slug: 'tailor-made-owner-goals',
    title: 'Why Tailor-Made Villa Development Can Fit Different Owner Goals',
    category: 'Development',
    excerpt:
      'The same plot produces three different buildings depending on what the owner needs from it.',
    readMinutes: 5,
    date: '28 July 2026',
    author: 'Editorial team',
    image: 'media/villa-facade.jpg',
    body: [
      'There is no single perfect villa. There is the right villa for the right owner, location, budget and objective — and the gap between those versions is larger than most people expect.',
      'An owner who will spend three months a year in the property wants storage, a kitchen that works for cooking rather than photographs, and a suite that can be closed off. An owner who will visit twice a year wants bedroom parity, fast turnaround and a layout that reads well in twelve photographs.',
      'Both are legitimate. Building the second for the first owner is how people end up quietly disliking a property they spent two years making.',
    ],
  },
  {
    slug: 'owning-in-bali-introduction',
    title: 'Owning in Bali: A Practical Introduction for International Buyers',
    category: 'Development',
    excerpt:
      'Leasehold, right-to-build and company structures — in plain language, with the questions worth asking your notary.',
    readMinutes: 8,
    date: '19 July 2026',
    author: 'Editorial team',
    image: 'media/villa-deck.jpg',
    body: [
      'Foreign nationals do not hold freehold title in Indonesia. Property is held through leasehold, or through an Indonesian company structure that carries a right-to-build title. Both are ordinary, both are used constantly, and both have details that reward attention.',
      'The single most important one is what happens at the end of the term. A lease is a contract for a fixed number of years, usually with an extension agreed at the start. Whether that extension is registered notarially, and on what terms, is the difference between an asset and a promise.',
      'None of this is a reason to be nervous. It is a reason to read the documents, use your own notary, and be suspicious of anyone who tells you it is simpler than it is.',
    ],
  },
  {
    slug: 'short-term-vs-residential',
    title: 'Short-Term Hospitality vs Traditional Residential Rental Models',
    category: 'Operations',
    excerpt:
      'Two different businesses that happen to involve the same building. Cost structure, risk and workload all differ.',
    readMinutes: 6,
    date: '9 July 2026',
    author: 'Editorial team',
    image: 'media/villa-pool-lounge.jpg',
    body: [
      'A long residential tenancy is a financial product: one contract, one payment a month, low workload, low upside. A short-term hospitality operation is a small business: many contracts, daily work, staff, consumables, reviews, and a materially higher gross.',
      'Comparing their headline yields directly is misleading, because they are not the same measure of the same thing. The residential figure is close to net. The hospitality figure is a long way from it.',
      'Which one suits you is a question about appetite and involvement, not about which number is bigger.',
    ],
  },
  {
    slug: 'how-to-read-a-villa-investment-model',
    title: 'How to Read a Villa Investment Model: Revenue, Costs and Assumptions',
    category: 'Investment',
    excerpt:
      'A short checklist for pulling apart any projection you are shown — including ours.',
    readMinutes: 7,
    date: '30 June 2026',
    author: 'Editorial team',
    image: 'media/villa-pool-aerial.jpg',
    body: [
      'Start at the top line. What nightly rate is assumed, and against which comparable properties? A model built on the best three villas in the area is not a model, it is an aspiration.',
      'Then occupancy. Is it a year-round average, and does it account for low season? An 85% assumption is achievable in parts of Bali and fantasy in others.',
      'Then the cost list. If it has fewer than six lines, something is missing. Housekeeping, laundry, utilities, pool and garden, repairs, replacement, channel fees, management, taxes — all of it belongs there, with a number beside it.',
      'Finally, ask what the model does at 60% occupancy. Any projection worth trusting has been stress-tested downwards, and whoever built it should be able to show you that version without hesitating.',
    ],
  },
  {
    slug: 'a-week-in-your-own-bali-villa',
    title: 'A Week in Your Own Bali Villa: The Lifestyle Value of Ownership',
    category: 'Bali Lifestyle',
    excerpt:
      'The part that does not appear in any spreadsheet, and the reason most owners started looking.',
    readMinutes: 4,
    date: '21 June 2026',
    author: 'Editorial team',
    image: 'media/villa-deck-pool.jpg',
    body: [
      'You land in the evening, and someone you know is at the airport. The fridge has what you asked for. The pool is the temperature it always is. By the second morning you have stopped checking your phone before breakfast.',
      'None of that is a return, and we would not try to put a number on it. But it is the reason most owners we work with started looking in the first place, and it is why we design around how someone wants to live before we design around what the property should earn.',
      'The investment case has to stand up on its own. This part is what makes people keep the villa once it does.',
    ],
  },
];

export const INSIGHT_CATEGORIES = [
  'All',
  'Bali Lifestyle',
  'Investment',
  'Development',
  'Design',
  'Operations',
] as const;
