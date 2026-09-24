export function usd(value: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value)) return '—';
  if (opts.compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: value >= 1_000_000 ? 2 : 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Translation keys — pipe the result through `t`. */
export const STATUS_LABEL: Record<string, string> = {
  available: 'status.available',
  construction: 'status.construction',
  reserved: 'status.reserved',
  delivered: 'status.delivered',
  'coming-soon': 'status.comingSoon',
};

export const STATUS_COLOR: Record<string, string> = {
  available: 'green',
  construction: 'gold',
  reserved: 'blue',
  delivered: 'default',
  'coming-soon': 'purple',
};

/** Translation keys — pipe the result through `t`. */
export const TYPE_LABEL: Record<string, string> = {
  villa: 'type.villa',
  townhouse: 'type.townhouse',
  apartment: 'type.apartment',
  commercial: 'type.commercial',
  land: 'type.land',
};
