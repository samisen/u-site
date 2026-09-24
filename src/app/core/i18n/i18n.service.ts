import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeTr from '@angular/common/locales/tr';
import { NzI18nService, en_US, fr_FR, tr_TR } from 'ng-zorro-antd/i18n';
import {
  DEFAULT_LOCALE,
  Dictionary,
  Locale,
  LOCALES,
  TranslateParams,
  isLocale,
} from './locale';

const STORAGE_KEY = 'tirta-lang';

/** ng-zorro's own strings — dates, pagination, empty states, the carousel. */
const NZ_LOCALES = { en: en_US, fr: fr_FR, tr: tr_TR } as const;

registerLocaleData(localeEn);
registerLocaleData(localeFr);
registerLocaleData(localeTr);

/**
 * Holds the active language and the phrases that go with it.
 *
 * Dictionaries are fetched once per language and kept, so switching back is
 * instant. English is always loaded as well: a key a translation has not
 * reached yet falls through to it rather than showing the visitor a key.
 *
 * Today the phrases are static JSON. When they move to a database, only
 * `fetchDictionary` below has to change.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);
  private readonly nz = inject(NzI18nService);

  private readonly cache = new Map<Locale, Dictionary>();
  private active: Dictionary = {};
  private fallback: Dictionary = {};

  readonly locale = signal<Locale>(DEFAULT_LOCALE);

  /**
   * Bumped whenever the phrases change. The translate pipe reads it, which is
   * what tells every view holding a translation to render itself again.
   */
  readonly version = signal(0);

  readonly locales = LOCALES;

  /** Runs before the app renders, so the first paint is already translated. */
  async init(): Promise<void> {
    this.fallback = await this.dictionary(DEFAULT_LOCALE);
    await this.use(this.stored() ?? this.preferred(), false);
  }

  async use(locale: Locale, persist = true): Promise<void> {
    this.active = locale === DEFAULT_LOCALE ? this.fallback : await this.dictionary(locale);
    this.locale.set(locale);
    this.nz.setLocale(NZ_LOCALES[locale]);
    this.doc.documentElement.setAttribute('lang', locale);
    // index.html ships an English description; a share or a crawler that reads
    // the rendered page should see the language the visitor is actually on
    this.doc
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', this.t('meta.description'));
    if (persist) this.persist(locale);
    this.version.update((v) => v + 1);
  }

  /**
   * The phrase for a key, with `{placeholders}` filled in.
   *
   * An unknown key comes back as itself — visible in the page and greppable,
   * rather than silently blank.
   */
  t(key: string, params?: TranslateParams): string {
    const phrase = this.active[key] ?? this.fallback[key];
    if (phrase === undefined) return key;
    return params ? interpolate(phrase, params) : phrase;
  }

  /** True when the key exists in the active language or in English. */
  has(key: string): boolean {
    return this.active[key] !== undefined || this.fallback[key] !== undefined;
  }

  private async dictionary(locale: Locale): Promise<Dictionary> {
    const cached = this.cache.get(locale);
    if (cached) return cached;
    const dict = await this.fetchDictionary(locale);
    this.cache.set(locale, dict);
    return dict;
  }

  /** The one seam between the site and wherever the copy lives. */
  private async fetchDictionary(locale: Locale): Promise<Dictionary> {
    try {
      const url = new URL(`i18n/${locale}.json`, this.doc.baseURI).toString();
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return (await res.json()) as Dictionary;
    } catch (err) {
      // A missing dictionary must not take the site down: English is already
      // loaded by then, and the keys fall through to it.
      console.error(`[i18n] could not load "${locale}"`, err);
      return {};
    }
  }

  /** The visitor's own choice, from a previous visit. */
  private stored(): Locale | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return isLocale(v) ? v : null;
    } catch {
      return null;
    }
  }

  /** Otherwise the first browser language we actually speak. */
  private preferred(): Locale {
    const langs = this.doc.defaultView?.navigator?.languages ?? [];
    for (const tag of langs) {
      const base = tag.split('-')[0]?.toLowerCase();
      if (isLocale(base)) return base;
    }
    return DEFAULT_LOCALE;
  }

  private persist(locale: Locale): void {
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* private mode — the choice just does not survive the tab */
    }
  }
}

function interpolate(phrase: string, params: TranslateParams): string {
  return phrase.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}
