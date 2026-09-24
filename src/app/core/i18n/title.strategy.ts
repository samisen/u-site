import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { BRAND } from '../brand';
import { I18nService } from './i18n.service';

/**
 * A route's `title` is a translation key here, not a finished string, so the
 * document title follows the switcher like everything else. The last key is
 * kept so a language change can re-apply it without a navigation.
 */
@Injectable()
export class LocalisedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private key = 'title.home';

  constructor() {
    super();
    effect(() => {
      this.i18n.version();
      this.apply();
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    // the detail routes carry no title of their own; without a fallback they
    // would keep index.html's English one whatever the visitor chose
    this.key = this.buildTitle(snapshot) ?? 'title.home';
    this.apply();
  }

  private apply(): void {
    const page = this.i18n.t(this.key);
    this.title.setTitle(this.key === 'title.home' ? page : `${page} — ${BRAND.name}`);
  }
}
