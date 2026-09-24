import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';
import { TranslateParams } from './locale';

/**
 * `{{ 'home.hero.title' | t }}`, and with values: `{{ 'x' | t: { n: 3 } }}`.
 *
 * The pipe is impure because a pure one caches on its input, and the key does
 * not change when the language does. Reading the service's `version` signal in
 * `transform` is what marks the surrounding view dirty on a switch; the result
 * is memoised so the extra passes cost a comparison rather than a lookup.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  private version = -1;
  private key: string | null | undefined;
  private params: TranslateParams | undefined;
  private value = '';

  transform(key: string | null | undefined, params?: TranslateParams): string {
    const version = this.i18n.version();
    if (version === this.version && key === this.key && same(params, this.params)) {
      return this.value;
    }
    this.version = version;
    this.key = key;
    this.params = params;
    this.value = key ? this.i18n.t(key, params) : '';
    return this.value;
  }
}

function same(a: TranslateParams | undefined, b: TranslateParams | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
}
