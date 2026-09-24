/**
 * The languages the site speaks.
 *
 * Copy lives outside the code, as flat key/value JSON under `public/i18n`, so
 * the same keys can later be served from a database without touching a
 * template. Add a language here, drop a `<id>.json` beside the others, and the
 * switcher in the header picks it up.
 */
export type Locale = 'en' | 'fr' | 'tr';

export interface LocaleMeta {
  id: Locale;
  /** Two letters, for the switcher in the bar. */
  short: string;
  /** The language's own name, for the drawer and the accessible label. */
  name: string;
}

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: readonly LocaleMeta[] = [
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'fr', short: 'FR', name: 'Français' },
  { id: 'tr', short: 'TR', name: 'Türkçe' },
] as const;

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((l) => l.id === value);
}

/** One flat map per language: `'home.hero.title' -> 'A Place to Live. …'`. */
export type Dictionary = Readonly<Record<string, string>>;

/** Values substituted into `{placeholders}` in a phrase. */
export type TranslateParams = Readonly<Record<string, string | number>>;
