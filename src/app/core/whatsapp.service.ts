import { Injectable, computed, inject } from '@angular/core';
import { BRAND, whatsappLink } from './brand';
import { I18nService } from './i18n';

/**
 * WhatsApp is the route most enquiries actually take, so the message the link
 * prefills is written in whatever language the visitor is reading.
 */
@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly i18n = inject(I18nService);

  /** The plain "hello" link used by the header, the footer and the button. */
  readonly url = computed(() => whatsappLink(this.intro('whatsapp.intro')));

  /** The same link carrying a brief the visitor has just put together. */
  linkWith(body: string): string {
    return `${whatsappLink(`${this.intro('whatsapp.designIntro')}\n\n${body}`)}`;
  }

  private intro(key: string): string {
    this.i18n.version();
    return this.i18n.t(key, { brand: BRAND.name });
  }
}
