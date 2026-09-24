import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'tirta-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    const stored = this.read();
    const prefersDark = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.apply(stored ?? (prefersDark ? 'dark' : 'light'), false);

    // follow the OS only while the visitor has not made an explicit choice
    this.doc.defaultView
      ?.matchMedia?.('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!this.read()) this.apply(e.matches ? 'dark' : 'light', false);
      });
  }

  toggle(): void {
    this.apply(this.mode() === 'dark' ? 'light' : 'dark', true);
  }

  set(mode: ThemeMode): void {
    this.apply(mode, true);
  }

  private apply(mode: ThemeMode, persist: boolean): void {
    this.mode.set(mode);
    this.doc.documentElement.setAttribute('data-theme', mode);

    // toggled through `media`, not `disabled` — see the note in index.html
    const light = this.doc.getElementById('theme-light') as HTMLLinkElement | null;
    const dark = this.doc.getElementById('theme-dark') as HTMLLinkElement | null;
    if (light) light.media = mode === 'dark' ? 'not all' : 'all';
    if (dark) dark.media = mode === 'dark' ? 'all' : 'not all';

    const meta = this.doc.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', mode === 'dark' ? '#0c1110' : '#0f7b6c');

    if (persist) {
      try {
        this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        /* private mode — ignore */
      }
    }
  }

  private read(): ThemeMode | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }
}
