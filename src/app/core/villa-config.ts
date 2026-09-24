import { AreaId } from './models';
import { grossAnnualRevenue, grossYieldPct, netAnnualIncome, netYieldPct } from './yield-model';

/* ============================================================================
   The villa configurator's domain: a configuration in, a floor plan and a
   costed study out. Kept free of Angular so the numbers can be reasoned about
   (and later tested) on their own.
   ========================================================================== */

export type VillaStyle = 'tropical' | 'joglo' | 'cliff';
export type FinishLevel = 'essential' | 'prestige';
export type PoolType = 'none' | 'plunge' | 'standard' | 'infinity';
export type ExtraId =
  | 'rooftop' | 'staff' | 'study' | 'outdoor-kitchen'
  | 'gym' | 'carport' | 'solar' | 'generator'
  | 'yoga' | 'massage' | 'jacuzzi' | 'sauna' | 'ice-bath'
  | 'pickleball' | 'padel';

/** Per-room floor areas in m², driven directly from the editor. */
export interface RoomSizes {
  master: number;
  bedroom: number;
  ensuite: number;
  living: number;
  kitchen: number;
}

export interface VillaConfig {
  style: VillaStyle;
  bedrooms: number;
  storeys: 1 | 2;
  pool: PoolType;
  finish: FinishLevel;
  extras: ExtraId[];
  area: AreaId;
  landSqm: number;
  rooms: RoomSizes;
}

export const DEFAULT_ROOMS: RoomSizes = {
  master: 22,
  bedroom: 16,
  ensuite: 6,
  living: 38,
  kitchen: 24,
};

/** Bounds the editor's sliders respect, in m². */
export const ROOM_LIMITS: Record<keyof RoomSizes, { min: number; max: number; label: string; hint: string }> = {
  master: { min: 14, max: 42, label: 'Master bedroom', hint: 'Bedroom only — the ensuite is separate' },
  bedroom: { min: 10, max: 30, label: 'Other bedrooms', hint: 'Each remaining bedroom' },
  ensuite: { min: 3.5, max: 14, label: 'Bathrooms', hint: 'One per bedroom' },
  living: { min: 20, max: 80, label: 'Living', hint: 'Opens to the pool deck' },
  kitchen: { min: 12, max: 50, label: 'Kitchen & dining', hint: 'Single open space' },
};

/** Starting points that match the three owner profiles. */
export const PRESETS: { id: string; name: string; note: string; patch: Partial<VillaConfig> }[] = [
  {
    id: 'lifestyle',
    name: 'Lifestyle home',
    note: 'Bigger living, generous master, fewer keys',
    patch: {
      bedrooms: 3,
      finish: 'prestige',
      rooms: { master: 30, bedroom: 16, ensuite: 8, living: 52, kitchen: 30 },
      extras: ['carport', 'solar', 'study'],
    },
  },
  {
    id: 'income',
    name: 'Income-focused',
    note: 'Bedroom parity, efficient to turn around',
    patch: {
      bedrooms: 4,
      finish: 'essential',
      rooms: { master: 18, bedroom: 17, ensuite: 6, living: 34, kitchen: 20 },
      extras: ['carport', 'solar', 'staff'],
    },
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    note: 'A master that locks, the rest lets',
    patch: {
      bedrooms: 3,
      finish: 'essential',
      rooms: { ...DEFAULT_ROOMS },
      extras: ['carport', 'solar'],
    },
  },
];

export const DEFAULT_CONFIG: VillaConfig = {
  style: 'tropical',
  bedrooms: 3,
  storeys: 1,
  pool: 'standard',
  finish: 'essential',
  extras: ['carport', 'solar'],
  area: 'pererenan',
  landSqm: 400,
  rooms: { ...DEFAULT_ROOMS },
};

/* ---------------------------------------------------------------- options -- */

export const STYLES: { id: VillaStyle; name: string; blurb: string; multiplier: number }[] = [
  {
    id: 'tropical',
    name: 'Modern tropical',
    blurb: 'Flat roofs, deep overhangs, full-height glazing onto the pool. The format that photographs best and builds fastest.',
    multiplier: 1,
  },
  {
    id: 'joglo',
    name: 'Balinese joglo',
    blurb: 'Exposed bengkirai frame, high alang-alang ridge over a membrane, paras stone. Slower to build, and the one guests remember.',
    multiplier: 1.12,
  },
  {
    id: 'cliff',
    name: 'Cliff minimal',
    blurb: 'Board-formed concrete, cantilevers, engineered retaining. For a plot with a drop — and the budget the engineering needs.',
    multiplier: 1.2,
  },
];

export const FINISHES: {
  id: FinishLevel; name: string; blurb: string; rate: number; furniture: number;
}[] = [
  {
    id: 'essential',
    name: 'Essential',
    blurb: 'Everything a turnkey rental needs: local hardwood joinery, porcelain tile, split-system air conditioning, standard sanitaryware.',
    rate: 790,
    furniture: 190,
  },
  {
    id: 'prestige',
    name: 'Prestige',
    blurb: 'Imported stone, bespoke joinery, ducted air conditioning, designer sanitaryware, integrated lighting and audio.',
    rate: 1180,
    furniture: 340,
  },
];

/** `length` runs along the villa's facade; `width` is the reach away from it. */
export const POOLS: { id: PoolType; name: string; size: string; cost: number; length: number; width: number }[] = [
  { id: 'none', name: 'No pool', size: '—', cost: 0, length: 0, width: 0 },
  { id: 'plunge', name: 'Plunge', size: '4.0 × 3.0 m', cost: 16000, length: 4, width: 3 },
  { id: 'standard', name: 'Standard', size: '8.0 × 3.5 m', cost: 34000, length: 8, width: 3.5 },
  { id: 'infinity', name: 'Infinity edge', size: '11.0 × 4.0 m', cost: 62000, length: 11, width: 4 },
];

export const EXTRAS: { id: ExtraId; name: string; note: string; cost: number; sqm: number }[] = [
  { id: 'rooftop', name: 'Rooftop terrace', note: 'Needs the second storey', cost: 22000, sqm: 32 },
  { id: 'study', name: 'Office / workspace', note: 'Enclosed, air conditioned', cost: 14000, sqm: 16 },
  { id: 'gym', name: 'Gym', note: 'Ground floor, off the living zone', cost: 16000, sqm: 22 },
  { id: 'yoga', name: 'Yoga shala', note: 'Open-sided, timber floor', cost: 19000, sqm: 20 },
  { id: 'massage', name: 'Massage room', note: 'Treatment room off the garden', cost: 12000, sqm: 15 },
  { id: 'outdoor-kitchen', name: 'Outdoor kitchen', note: 'Poolside, with bar', cost: 11000, sqm: 10 },
  { id: 'jacuzzi', name: 'Jacuzzi', note: 'Heated, set into the garden deck', cost: 9500, sqm: 6 },
  { id: 'sauna', name: 'Sauna', note: 'Cedar cabin, four person', cost: 13000, sqm: 6 },
  { id: 'ice-bath', name: 'Ice bath', note: 'Chilled plunge, beside the sauna', cost: 6000, sqm: 3 },
  { id: 'pickleball', name: 'Pickleball court', note: 'Regulation 13.4 × 6.1 m', cost: 28000, sqm: 82 },
  { id: 'padel', name: 'Padel court', note: 'Regulation 20 × 10 m, glazed', cost: 85000, sqm: 200 },
  { id: 'carport', name: 'Carport', note: 'Two bays, covered', cost: 9000, sqm: 17 },
  { id: 'staff', name: 'Staff quarters', note: 'Detached, with bathroom', cost: 18000, sqm: 13 },
  { id: 'solar', name: 'Solar hot water', note: 'Cuts the power bill', cost: 6500, sqm: 0 },
  { id: 'generator', name: 'Backup generator', note: 'Auto transfer switch', cost: 8500, sqm: 0 },
];

/** Options that take a strip of the living-side column. Depth = area / column width. */
const INDOOR_EXTRAS: { id: ExtraId; label: string }[] = [
  { id: 'study', label: 'Study / office' },
  { id: 'gym', label: 'Gym' },
  { id: 'yoga', label: 'Yoga shala' },
  { id: 'massage', label: 'Massage room' },
];

/** Small wet options, drawn in a column in the garden beyond the pool. */
const WET_EXTRAS: { id: ExtraId; label: string; w: number; h: number; kind: RoomKind }[] = [
  { id: 'jacuzzi', label: 'Jacuzzi', w: 2.4, h: 2.4, kind: 'pool' },
  { id: 'sauna', label: 'Sauna', w: 2.6, h: 2.2, kind: 'service' },
  { id: 'ice-bath', label: 'Ice bath', w: 1.6, h: 1.6, kind: 'pool' },
];

/** Courts, at their regulation footprint — which is the point of drawing them. */
const COURT_EXTRAS: { id: ExtraId; label: string; w: number; h: number }[] = [
  { id: 'pickleball', label: 'Pickleball court', w: 6.1, h: 13.4 },
  { id: 'padel', label: 'Padel court', w: 10, h: 20 },
];

function extraSqm(id: ExtraId): number {
  return EXTRAS.find((e) => e.id === id)?.sqm ?? 0;
}

/* ------------------------------------------------------------------ plan -- */

export type RoomKind = 'living' | 'bed' | 'bath' | 'service' | 'hall' | 'pool' | 'deck' | 'outdoor';

export interface PlanRoom {
  /** Stable across rebuilds, so the drawing can tell a moved room from a new one. */
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: RoomKind;
  counts: boolean;
}

export interface FloorPlan {
  name: string;
  rooms: PlanRoom[];
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/* The plan is laid out in metres, so every area the editor reports is measured
   off the drawing rather than estimated alongside it. */

const BED_DEPTH = 4.2;    // how far a bedroom reaches into the plan
const HALL_W = 1.3;
const LEFT_W = 6.4;       // living / kitchen zone width
const DECK_D = 3.2;
const WALL = 0.2;         // drawn wall thickness, for the CAD view

/** Bedrooms placed on the ground floor of a two-storey house. */
function groundBedrooms(config: VillaConfig): number {
  if (config.storeys === 1) return config.bedrooms;
  return config.bedrooms >= 3 ? 1 : 0;
}

function bounds(rooms: PlanRoom[]): Omit<FloorPlan, 'name' | 'rooms'> {
  return {
    minX: Math.min(...rooms.map((r) => r.x)),
    minY: Math.min(...rooms.map((r) => r.y)),
    maxX: Math.max(...rooms.map((r) => r.x + r.w)),
    maxY: Math.max(...rooms.map((r) => r.y + r.h)),
  };
}

/** Row heights for each bedroom, derived from the areas the visitor set. */
function bedroomRowHeights(config: VillaConfig, count: number, startIndex: number): number[] {
  const rows: number[] = [];
  for (let i = 0; i < count; i++) {
    const isMaster = startIndex + i === 0;
    const area = isMaster ? config.rooms.master : config.rooms.bedroom;
    rows.push(area / BED_DEPTH);
  }
  return rows;
}

function ensuiteWidth(config: VillaConfig): number {
  // one width for every bathroom, so the building keeps a straight edge.
  // With a single bedroom there are no "other bedrooms" to set, so the master
  // is the reference — otherwise a control the editor hides would still move
  // the drawing.
  const reference = config.bedrooms > 1 ? config.rooms.bedroom : config.rooms.master;
  return config.rooms.ensuite / (reference / BED_DEPTH);
}

function bedroomRows(
  config: VillaConfig,
  count: number,
  startIndex: number,
  heights: number[],
): PlanRoom[] {
  const rooms: PlanRoom[] = [];
  const bathW = ensuiteWidth(config);
  const x = LEFT_W + HALL_W;
  let y = 0;

  for (let i = 0; i < count; i++) {
    const n = startIndex + i;
    const master = n === 0;
    const h = heights[i];
    rooms.push({
      id: `bed-${n}`,
      label: master ? 'Master bedroom' : `Bedroom ${n + 1}`,
      x,
      y,
      w: BED_DEPTH,
      h,
      kind: 'bed',
      counts: true,
    });
    rooms.push({
      id: `bath-${n}`,
      label: master ? 'Ensuite' : 'Bath',
      x: x + BED_DEPTH,
      y,
      w: bathW,
      h,
      kind: 'bath',
      counts: true,
    });
    y += h;
  }
  return rooms;
}

/** Whatever the bedrooms leave over in the right-hand zone becomes service space. */
function serviceRows(config: VillaConfig, fromY: number, toY: number): PlanRoom[] {
  const available = toY - fromY;
  if (available < 1.8) return [];
  const w = BED_DEPTH + ensuiteWidth(config);
  const labels = available >= 5 ? ['Entry & powder', 'Laundry & store'] : ['Entry & store'];
  const h = available / labels.length;
  return labels.map((label, i) => ({
    id: `service-${i}`,
    label,
    x: LEFT_W + HALL_W,
    y: fromY + i * h,
    w,
    h,
    kind: 'service' as RoomKind,
    counts: true,
  }));
}

export function buildPlans(config: VillaConfig): FloorPlan[] {
  const gBeds = groundBedrooms(config);
  const uBeds = config.bedrooms - gBeds;
  const indoorExtras = INDOOR_EXTRAS.filter((e) => config.extras.includes(e.id)).map((e) => ({
    ...e,
    h: extraSqm(e.id) / LEFT_W,
  }));

  /* ---------- ground floor ---------- */

  const gHeights = bedroomRowHeights(config, gBeds, 0);
  const rightStack = gHeights.reduce((a, b) => a + b, 0);

  const livingH = config.rooms.living / LEFT_W;
  const kitchenH = config.rooms.kitchen / LEFT_W;
  const indoorH = indoorExtras.reduce((sum, e) => sum + e.h, 0);
  const leftStack = livingH + kitchenH + indoorH;

  // the two zones have to agree on a height; the living room absorbs any slack
  const groundH = Math.max(leftStack, rightStack + (gBeds ? 2.6 : 8), 9);
  const livingActual = livingH + Math.max(0, groundH - leftStack);

  const ground: PlanRoom[] = [
    { id: 'living', label: 'Living', sub: 'open to the pool', x: 0, y: 0, w: LEFT_W, h: livingActual, kind: 'living', counts: true },
    { id: 'kitchen', label: 'Kitchen & dining', x: 0, y: livingActual, w: LEFT_W, h: kitchenH, kind: 'living', counts: true },
  ];
  let ly = livingActual + kitchenH;
  for (const e of indoorExtras) {
    ground.push({ id: e.id, label: e.label, x: 0, y: ly, w: LEFT_W, h: e.h, kind: 'service', counts: true });
    ly += e.h;
  }

  ground.push({ id: 'hall', label: 'Hall', x: LEFT_W, y: 0, w: HALL_W, h: groundH, kind: 'hall', counts: true });
  ground.push(...bedroomRows(config, gBeds, 0, gHeights));
  ground.push(...serviceRows(config, rightStack, groundH));

  // outdoor
  ground.push({ id: 'deck', label: 'Deck', x: -DECK_D, y: 0, w: DECK_D, h: groundH, kind: 'deck', counts: false });

  const pool = POOLS.find((p) => p.id === config.pool)!;
  if (pool.length > 0) {
    // the pool runs alongside the villa, parallel to the deck — not out from it
    ground.push({
      id: 'pool',
      label: 'Pool',
      sub: pool.size,
      x: -DECK_D - pool.width,
      y: Math.max(0, (groundH - pool.length) / 2),
      w: pool.width,
      h: pool.length,
      kind: 'pool',
      counts: false,
    });
  }

  /* ---------- garden, working outwards from the pool ---------- */

  const GARDEN_GAP = 1.2;
  let gx = -DECK_D - (pool.length > 0 ? pool.width : 0);

  const wet = WET_EXTRAS.filter((e) => config.extras.includes(e.id));
  if (wet.length) {
    gx -= GARDEN_GAP + Math.max(...wet.map((e) => e.w));
    let wy = 0;
    for (const e of wet) {
      // a sauna is a roofed cabin and counts; open water does not
      ground.push({ id: e.id, label: e.label, x: gx, y: wy, w: e.w, h: e.h, kind: e.kind, counts: e.kind === 'service' });
      wy += e.h + 0.8;
    }
  }

  for (const c of COURT_EXTRAS.filter((e) => config.extras.includes(e.id))) {
    gx -= GARDEN_GAP + c.w;
    ground.push({ id: c.id, label: c.label, x: gx, y: 0, w: c.w, h: c.h, kind: 'outdoor', counts: false });
  }

  const buildingW = LEFT_W + HALL_W + BED_DEPTH + ensuiteWidth(config);

  if (config.extras.includes('outdoor-kitchen')) {
    ground.push({ id: 'outdoor-kitchen', label: 'Outdoor kitchen', x: -DECK_D, y: groundH - 3, w: DECK_D, h: 3, kind: 'outdoor', counts: false });
  }
  if (config.extras.includes('staff')) {
    ground.push({ id: 'staff', label: 'Staff quarters', x: buildingW + 1.4, y: 0, w: 4.2, h: 3.2, kind: 'service', counts: true });
  }
  if (config.extras.includes('carport')) {
    ground.push({ id: 'carport', label: 'Carport', x: buildingW + 1.4, y: groundH - 3.2, w: 5.4, h: 3.2, kind: 'outdoor', counts: false });
  }

  const plans: FloorPlan[] = [
    { name: config.storeys === 1 ? 'Floor plan' : 'Ground floor', rooms: ground, ...bounds(ground) },
  ];

  /* ---------- upper floor ---------- */

  if (config.storeys === 2) {
    const uHeights = bedroomRowHeights(config, uBeds, gBeds);
    const upperStack = uHeights.reduce((a, b) => a + b, 0);
    const rooftop = config.extras.includes('rooftop');
    const terraceH = rooftop ? 5 : 3.4;
    const upperH = Math.max(upperStack, 9);
    const loungeH = Math.max(upperH - terraceH, 3);

    const upper: PlanRoom[] = [
      { id: 'upper-lounge', label: 'Upper lounge', sub: 'over the pool', x: 0, y: 0, w: LEFT_W, h: loungeH, kind: 'living', counts: true },
      { id: 'terrace', label: rooftop ? 'Roof terrace' : 'Balcony', sub: 'uncovered', x: 0, y: loungeH, w: LEFT_W, h: terraceH, kind: 'deck', counts: false },
      { id: 'landing', label: 'Landing', x: LEFT_W, y: 0, w: HALL_W, h: upperH, kind: 'hall', counts: true },
      ...bedroomRows(config, uBeds, gBeds, uHeights),
    ];

    plans.push({ name: 'First floor', rooms: upper, ...bounds(upper) });
  }

  return plans;
}

export const PLAN_METRICS = { wall: WALL, hallWidth: HALL_W, bedDepth: BED_DEPTH } as const;

/* ------------------------------------------------------------------ cost -- */

export interface CostLine {
  label: string;
  amount: number;
  note?: string;
}

export interface VillaStudy {
  plans: FloorPlan[];
  builtSqm: number;
  footprintSqm: number;
  outdoorSqm: number;
  /** Roofed footprint as a share of the plot (KDB). Pool, deck and carport
      are open structures and do not count towards it. */
  siteCoverage: number;
  coverageLimitPct: number;
  maxFootprintSqm: number;
  overCoverage: boolean;
  buildMonths: number;
  construction: number;
  lines: CostLine[];
  buildTotal: number;
  landTotal: number;
  total: number;
  nightlyRate: number;
  occupancy: number;
  grossAnnual: number;
  grossYield: number;
  netAnnual: number;
  netYield: number;
  paybackYears: number;
}

const LEASE_YEARS = 25;

/**
 * Koefisien Dasar Bangunan — the share of a plot that may be covered by
 * building. 50% is the usual ceiling for residential land in Badung and
 * Gianyar. Pools, decks and open carports are not roofed floor area and are
 * excluded from the calculation.
 */
export const COVERAGE_LIMIT_PCT = 50;

/** Everything the drawing puts on the ground — roofed or not, pool and deck included. */
export function siteAreaOf(config: VillaConfig): number {
  const ground = buildPlans(config)[0];
  return Math.round(ground.rooms.reduce((s, r) => s + r.w * r.h, 0));
}

/**
 * Whether this pool still leaves the whole layout inside the plot boundary.
 * "No pool" is always available — when the building alone is too big for the
 * plot, the answer is a smaller building, not a locked-out pool selector.
 */
export function poolFitsPlot(config: VillaConfig, pool: PoolType): boolean {
  if (pool === 'none') return true;
  return siteAreaOf({ ...config, pool }) <= config.landSqm;
}

/** The largest pool this plot can still take, for when the plot shrinks. */
export function largestPoolThatFits(config: VillaConfig): PoolType {
  const ordered = [...POOLS].sort((a, b) => b.length * b.width - a.length * a.width);
  return (ordered.find((p) => poolFitsPlot(config, p.id)) ?? POOLS[0]).id;
}

/** Ground-floor area that counts towards KDB, without pricing the whole study. */
export function footprintOf(config: VillaConfig): number {
  const ground = buildPlans(config)[0];
  return Math.round(ground.rooms.filter((r) => r.counts).reduce((s, r) => s + r.w * r.h, 0));
}

export function maxFootprintOf(config: VillaConfig): number {
  return Math.round((config.landSqm * COVERAGE_LIMIT_PCT) / 100);
}

/**
 * Shrink the rooms until the ground floor fits the plot's coverage limit.
 *
 * The footprint is not linear in the room areas — the hall, the bathroom wing
 * and the service rows all hold their own — so this bisects a single scale
 * factor applied to every room, stopping at each room's minimum. If even the
 * smallest layout is over, it returns that: the editor keeps the warning
 * rather than pretending the plot is bigger than it is.
 */
export function fitRoomsToPlot(config: VillaConfig): RoomSizes {
  const limit = maxFootprintOf(config);
  if (footprintOf(config) <= limit) return config.rooms;

  const keys = Object.keys(config.rooms) as (keyof RoomSizes)[];
  const scale = (k: number): RoomSizes =>
    keys.reduce((acc, key) => {
      const { min, max } = ROOM_LIMITS[key];
      const v = Math.round(Math.min(max, Math.max(min, config.rooms[key] * k)) * 2) / 2;
      return { ...acc, [key]: v };
    }, {} as RoomSizes);

  const smallest = scale(0);
  if (footprintOf({ ...config, rooms: smallest }) > limit) return smallest;

  let lo = 0;      // known to fit
  let hi = 1;      // known to be over
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    if (footprintOf({ ...config, rooms: scale(mid) }) <= limit) lo = mid;
    else hi = mid;
  }
  return scale(lo);
}
const POOL_RATE_FACTOR: Record<PoolType, number> = {
  none: 0.78,
  plunge: 0.92,
  standard: 1,
  infinity: 1.12,
};
const STYLE_RATE_FACTOR: Record<VillaStyle, number> = { tropical: 1, joglo: 1.03, cliff: 1.06 };

export function buildStudy(
  config: VillaConfig,
  area: { landPriceArePerYearUsd: number; avgNightlyRateUsd: number; occupancy: number },
): VillaStudy {
  const plans = buildPlans(config);

  const builtSqm = Math.round(
    plans.flatMap((p) => p.rooms).filter((r) => r.counts).reduce((s, r) => s + r.w * r.h, 0),
  );
  const outdoorSqm = Math.round(
    plans.flatMap((p) => p.rooms).filter((r) => !r.counts).reduce((s, r) => s + r.w * r.h, 0),
  );
  const ground = plans[0];
  // only roofed, enclosed structures count towards KDB
  const footprintSqm = Math.round(
    ground.rooms.filter((r) => r.counts).reduce((s, r) => s + r.w * r.h, 0),
  );
  const maxFootprintSqm = Math.round((config.landSqm * COVERAGE_LIMIT_PCT) / 100);

  const style = STYLES.find((s) => s.id === config.style)!;
  const finish = FINISHES.find((f) => f.id === config.finish)!;
  const pool = POOLS.find((p) => p.id === config.pool)!;

  const construction = Math.round(builtSqm * finish.rate * style.multiplier);
  const extrasCost = config.extras.reduce(
    (sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.cost ?? 0),
    0,
  );
  const furniture = Math.round(builtSqm * finish.furniture);
  const landscaping = Math.round(Math.max(config.landSqm - footprintSqm, 0) * 26);
  const design = Math.round(construction * 0.07);
  const permits = Math.round(17500 + construction * 0.02);

  const lines: CostLine[] = [
    { label: 'Construction', amount: construction, note: `${builtSqm} m² × $${finish.rate}/m² · ${style.name}` },
    { label: 'Pool', amount: pool.cost, note: pool.id === 'none' ? 'Not included' : pool.size },
    { label: 'Options', amount: extrasCost, note: `${config.extras.length} selected` },
    { label: 'Furniture & fit-out', amount: furniture, note: `${finish.name} package` },
    { label: 'Landscaping & external works', amount: landscaping, note: 'Garden, walls, driveway' },
    { label: 'Design & engineering', amount: design, note: '7% of construction' },
    { label: 'Permits, notary & PT PMA', amount: permits, note: 'PBG, company, due diligence' },
  ];

  const buildTotal = lines.reduce((s, l) => s + l.amount, 0);
  const landTotal = Math.round(
    area.landPriceArePerYearUsd * (config.landSqm / 100) * LEASE_YEARS,
  );
  const total = buildTotal + landTotal;

  const nightlyRate = Math.round(
    area.avgNightlyRateUsd *
      (0.62 + 0.17 * config.bedrooms) *
      (config.finish === 'prestige' ? 1.16 : 1) *
      POOL_RATE_FACTOR[config.pool] *
      STYLE_RATE_FACTOR[config.style],
  );

  const grossAnnual = grossAnnualRevenue(nightlyRate, area.occupancy);
  const grossYield = grossYieldPct(nightlyRate, area.occupancy, total);
  const netAnnual = netAnnualIncome(nightlyRate, area.occupancy);
  const netYield = netYieldPct(nightlyRate, area.occupancy, total);

  const buildMonths = Math.round(
    9 +
      config.bedrooms * 1.1 +
      (config.storeys === 2 ? 2 : 0) +
      (config.pool === 'infinity' ? 2 : config.pool === 'none' ? 0 : 1) +
      (config.finish === 'prestige' ? 2 : 0) +
      config.extras.length * 0.3,
  );

  return {
    plans,
    builtSqm,
    footprintSqm,
    outdoorSqm,
    siteCoverage: Math.round((footprintSqm / config.landSqm) * 100),
    coverageLimitPct: COVERAGE_LIMIT_PCT,
    maxFootprintSqm,
    overCoverage: footprintSqm > maxFootprintSqm,
    buildMonths,
    construction,
    lines,
    buildTotal,
    landTotal,
    total,
    nightlyRate,
    occupancy: area.occupancy,
    grossAnnual,
    grossYield,
    netAnnual,
    netYield,
    paybackYears: netAnnual > 0 ? total / netAnnual : 0,
  };
}

export const LEASE_TERM_YEARS = LEASE_YEARS;
