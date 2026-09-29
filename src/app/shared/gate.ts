import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BRAND } from '../core/brand';
import { GateService } from '../core/gate.service';
import { I18nService, Locale, TranslatePipe } from '../core/i18n';

/**
 * What a visitor without the code sees: the whole site, replaced by a door.
 *
 * It renders in place of the app shell rather than as a route, so nothing
 * behind it is reachable by typing a URL, and it carries the language switcher
 * because the header that usually holds one has not rendered yet.
 */
@Component({
  selector: 'app-gate',
  imports: [FormsModule, NzButtonModule, NzIconModule, NzInputModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gate">
      <div class="card">
        <svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="15" class="mark-bg" />
          <path d="M32 14 46 27v3H18v-3z" class="mark-roof" />
          <path d="M14 43c5 0 5-5 10-5s5 5 10 5 5-5 10-5 5 5 6 5" class="mark-wave" fill="none" />
        </svg>

        <p class="wordmark">
          <span class="lead">{{ brand.wordmarkLead }}</span>
          <span class="tail">{{ brand.wordmarkTail }}</span>
        </p>

        <h1 class="title">{{ 'gate.title' | t }}</h1>
        <p class="lede">{{ 'gate.lede' | t }}</p>

        @if (gate.unavailable()) {
          <p class="error" role="alert">
            <nz-icon nzType="warning" /> {{ 'gate.insecure' | t }}
          </p>
        } @else {
          <form (ngSubmit)="submit()">
            <label class="label" for="gate-code">{{ 'gate.label' | t }}</label>
            <nz-input-group [nzSuffix]="keyIcon" nzSize="large">
              <input
                id="gate-code"
                type="password"
                nz-input
                autocomplete="current-password"
                spellcheck="false"
                [attr.aria-invalid]="wrong() || null"
                [attr.placeholder]="'gate.placeholder' | t"
                [ngModel]="code()"
                (ngModelChange)="onType($event)"
                name="code"
              />
            </nz-input-group>
            <ng-template #keyIcon><nz-icon nzType="key" /></ng-template>

            @if (wrong()) {
              <p class="error" role="alert">{{ 'gate.wrong' | t }}</p>
            }

            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzBlock
              type="submit"
              [nzLoading]="gate.checking()"
              [disabled]="!code()"
            >
              {{ 'gate.submit' | t }}
            </button>
          </form>
        }

        <p class="note">{{ 'gate.note' | t }}</p>

        <div class="langs" role="group" [attr.aria-label]="'header.language' | t">
          @for (l of i18n.locales; track l.id) {
            <button
              type="button"
              class="lang"
              [class.is-active]="i18n.locale() === l.id"
              [attr.aria-label]="l.name"
              (click)="setLocale(l.id)"
            >
              {{ l.short }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .gate {
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: 24px var(--gutter);
        background:
          radial-gradient(1100px 620px at 50% -10%, var(--brand-soft), transparent 70%),
          var(--bg-sand);
      }

      .card {
        width: 100%;
        max-width: 380px;
        text-align: center;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        padding: 34px 26px 26px;
      }

      .mark { width: 46px; height: 46px; display: block; margin: 0 auto 12px; }
      .mark-bg { fill: var(--brand); }
      .mark-roof { fill: #fff; }
      .mark-wave { stroke: #fff; stroke-width: 3; stroke-linecap: round; }

      .wordmark {
        margin: 0 0 22px;
        font-family: var(--font-display);
        font-size: 22px;
        line-height: 1;
        letter-spacing: -0.01em;
      }
      .wordmark .lead { color: var(--ink); }
      .wordmark .tail { color: var(--brand); margin-inline-start: 6px; }

      .title {
        margin: 0 0 8px;
        font-family: var(--font-display);
        font-size: 27px;
        line-height: 1.15;
        font-weight: 400;
        color: var(--ink);
      }

      .lede {
        margin: 0 0 22px;
        color: var(--ink-2);
        font-size: 14.5px;
        line-height: 1.55;
      }

      .label {
        display: block;
        text-align: start;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ink-3);
      }

      form { display: grid; gap: 12px; }

      .error {
        margin: 0;
        text-align: start;
        font-size: 13px;
        color: #c0392b;
      }
      :root[data-theme='dark'] .error { color: #ff8a7a; }

      .note {
        margin: 18px 0 0;
        font-size: 12px;
        line-height: 1.5;
        color: var(--ink-3);
      }

      .langs {
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid var(--line);
        display: flex;
        justify-content: center;
        gap: 4px;
      }

      .lang {
        appearance: none;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 999px;
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--ink-3);
        transition: background-color .18s ease, color .18s ease;
      }
      .lang:hover { color: var(--ink); background: var(--surface-2); }
      .lang.is-active { color: var(--brand); background: var(--brand-soft); }
    `,
  ],
})
export class GateComponent {
  protected readonly gate = inject(GateService);
  protected readonly i18n = inject(I18nService);
  protected readonly brand = BRAND;

  protected readonly code = signal('');
  protected readonly wrong = signal(false);

  /** Typing again is the visitor saying they know; the warning goes away. */
  protected onType(value: string): void {
    this.code.set(value);
    if (this.wrong()) this.wrong.set(false);
  }

  protected async submit(): Promise<void> {
    const code = this.code();
    if (!code || this.gate.checking()) return;
    const ok = await this.gate.unlock(code);
    if (!ok) {
      this.wrong.set(true);
      this.code.set('');
    }
  }

  protected setLocale(locale: Locale): void {
    void this.i18n.use(locale);
  }
}
