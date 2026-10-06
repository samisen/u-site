import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header';
import { FooterComponent } from './layout/footer';
import { WhatsappFabComponent } from './shared/whatsapp-fab';
import { GateComponent } from './shared/gate';
import { GateService } from './core/gate.service';
import { STALE_BUNDLE_KEY } from './app.config';
import { TranslatePipe } from './core/i18n';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent, GateComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  /** The site stays behind its door until the visitor has the code. */
  protected readonly gate = inject(GateService);

  constructor() {
    /**
     * The router's own restoration runs on NavigationEnd, which is before a
     * lazy route's chunk has rendered. Until it does, the document is still
     * the height of the page you left, so a short new page could open part
     * way down it. Scrolling again once the new page has laid itself out is
     * what actually sticks.
     *
     * Only for navigations the visitor started, though. Back and forward are
     * the router's to restore, and forcing them to the top was dropping
     * people at the start of a page they had already read.
     */
    let trigger: 'imperative' | 'popstate' | 'hashchange' = 'imperative';

    this.router.events.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e instanceof NavigationStart) {
        trigger = e.navigationTrigger ?? 'imperative';
        return;
      }
      if (!(e instanceof NavigationEnd)) return;

      // this page arrived, so a bundle stale enough to have failed here is
      // no longer stale — let a later failure try the reload again
      try {
        this.doc.defaultView?.sessionStorage.removeItem(STALE_BUNDLE_KEY + e.urlAfterRedirects);
      } catch { /* private browsing */ }

      if (trigger === 'popstate') return;
      // a fragment link is asking for a specific place on the page
      if (this.router.parseUrl(this.router.url).fragment) return;

      const win = this.doc.defaultView;
      if (!win) return;
      const top = () => win.scrollTo(0, 0);
      top();
      win.requestAnimationFrame(top);
      win.setTimeout(top, 80);
    });
  }
}
