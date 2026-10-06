import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { I18nService, Locale, LOCALES, TranslatePipe } from '../core/i18n';
import { BRAND } from '../core/brand';
import { ApexLogoComponent } from '../shared/apex-logo';
import { WhatsappService } from '../core/whatsapp.service';

interface NavItem {
  /** Translation key. */
  label: string;
  link: string;
  blurb: string;
  /** Kept out of the main block in the mobile drawer. */
  secondary?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [ApexLogoComponent, RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzIconModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { '(window:scroll)': 'onScroll()' },
})
export class HeaderComponent {

  /* ------------------------------------------------- the bar's nav row -- */

  private readonly navEl = viewChild<ElementRef<HTMLElement>>('navEl');
  private readonly navRow = viewChild<ElementRef<HTMLElement>>('navRow');
  private readonly navItems = viewChildren<ElementRef<HTMLElement>>('navItem');
  private readonly moreBtn = viewChild<ElementRef<HTMLElement>>('moreBtn');

  /**
   * How many links the bar draws. The rest move under "More".
   *
   * The labels are translated, so the row's width changes with the language —
   * French runs about a third longer than English and used to push the links
   * over the mark. Rather than pick a breakpoint per language, the row
   * measures itself and drops whatever does not fit.
   */
  readonly navVisible = signal(0);
  readonly navShown = computed(() => this.navBar.slice(0, this.navVisible()));
  readonly navOverflow = computed(() => this.navBar.slice(this.navVisible()));
  readonly moreOpen = signal(false);

  private itemWidths: number[] = [];
  private measuring = true;

  toggleMore(): void { this.moreOpen.update((v) => !v); }
  closeMore(): void { this.moreOpen.set(false); }

  private fit(): void {
    if (this.measuring) return;
    const nav = this.navEl()?.nativeElement;
    const view = this.doc.defaultView;
    if (!nav || !view || !this.itemWidths.length) return;

    const row = this.navRow()?.nativeElement ?? nav;
    const gap = parseFloat(view.getComputedStyle(row).columnGap) || 0;
    const room = nav.clientWidth;
    const moreWidth = this.moreBtn()?.nativeElement.offsetWidth || 78;
    const widthOf = (n: number) =>
      this.itemWidths.slice(0, n).reduce((sum, w) => sum + w, 0) + Math.max(0, n - 1) * gap;

    let n = this.itemWidths.length;
    if (widthOf(n) <= room) {
      this.navVisible.set(n);
      return;
    }
    // everything that stays has to leave room for the More button as well
    while (n > 0 && widthOf(n) + gap + moreWidth > room) n--;
    this.navVisible.set(n);
    if (n >= this.itemWidths.length) this.closeMore();
  }

  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  readonly theme = inject(ThemeService);
  readonly i18n = inject(I18nService);
  readonly whatsapp = inject(WhatsappService);

  readonly locales = LOCALES;

  readonly scrolled = signal(false);
  readonly drawerOpen = signal(false);

  readonly brand = BRAND;

  readonly nav: NavItem[] = [
    { label: 'nav.whyBali', link: '/why-bali', blurb: 'nav.whyBali.blurb' },
    { label: 'nav.opportunity', link: '/opportunity', blurb: 'nav.opportunity.blurb' },
    { label: 'nav.locations', link: '/locations', blurb: 'nav.locations.blurb' },
    { label: 'nav.projects', link: '/projects', blurb: 'nav.projects.blurb' },
    { label: 'nav.design', link: '/design-your-villa', blurb: 'nav.design.blurb' },
    { label: 'nav.process', link: '/how-we-build', blurb: 'nav.process.blurb' },
    // Insights is reached from Why Bali and The Opportunity, and from the footer
    { label: 'nav.insights', link: '/insights', blurb: 'nav.insights.blurb', secondary: true },
  ];

  /** The bar shows the primary destinations only. */
  readonly navBar = this.nav.filter((i) => !i.secondary);
  readonly navMain = this.nav.filter((i) => !i.secondary);
  readonly navSecondary = this.nav.filter((i) => i.secondary);

  readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0] === '/'),
      startWith(this.router.url.split('?')[0] === '/'),
    ),
    { initialValue: true },
  );

  constructor() {
    /**
     * Measure once per language, then fit on every resize.
     *
     * A hidden link reports no width, so the row is shown whole for a frame
     * before it is measured — one frame, before paint, so nothing flickers.
     * After that the widths are known and resizing only re-runs the sum.
     */
    effect((onCleanup) => {
      this.i18n.version();
      const nav = this.navEl()?.nativeElement;
      const items = this.navItems();
      const view = this.doc.defaultView;
      if (!nav || !view || !items.length) return;

      this.measuring = true;
      this.navVisible.set(this.navBar.length);

      const frame = view.requestAnimationFrame(() => {
        this.itemWidths = items.map((i) => i.nativeElement.offsetWidth);
        this.measuring = false;
        this.fit();
      });

      const ro = new ResizeObserver(() => this.fit());
      ro.observe(nav);

      onCleanup(() => {
        view.cancelAnimationFrame(frame);
        ro.disconnect();
      });
    });

    // the overflow menu closes on Escape and on anything outside it
    effect((onCleanup) => {
      if (!this.moreOpen()) return;
      const view = this.doc.defaultView;
      if (!view) return;
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') this.closeMore(); };
      const onDown = (e: Event) => {
        const el = this.navEl()?.nativeElement;
        if (el && !el.contains(e.target as Node)) this.closeMore();
      };
      view.addEventListener('keydown', onKey);
      view.addEventListener('pointerdown', onDown);
      onCleanup(() => {
        view.removeEventListener('keydown', onKey);
        view.removeEventListener('pointerdown', onDown);
      });
    });
  }

  onScroll(): void {
    const y = this.doc.defaultView?.scrollY ?? 0;
    this.scrolled.set(y > 24);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  setLocale(id: Locale): void {
    if (id !== this.i18n.locale()) void this.i18n.use(id);
  }
}
