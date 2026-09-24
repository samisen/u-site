import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { I18nService, Locale, LOCALES, TranslatePipe } from '../core/i18n';
import { BRAND } from '../core/brand';
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
  imports: [RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzIconModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { '(window:scroll)': 'onScroll()' },
})
export class HeaderComponent {
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
