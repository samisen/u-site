import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, NzButtonModule, NzIconModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container inner" appReveal>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h2 class="display">{{ heading() }}</h2>
        <p class="lede">{{ lede() }}</p>
        <div class="actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/contact">
            {{ primaryLabel() }}
            <nz-icon nzType="arrow-right" />
          </a>
          <a nz-button nzSize="large" nzGhost routerLink="/projects">Browse projects</a>
        </div>
        <p class="reassure">
          <nz-icon nzType="check" /> No fee for a first conversation
          <span class="sep"></span>
          <nz-icon nzType="check" /> Reply within one working day
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .cta {
        background: var(--bg-deep);
        color: #fff;
        padding-block: 64px;
        position: relative;
        overflow: hidden;
      }
      @media (min-width: 768px) { .cta { padding-block: 104px; } }

      .cta::after {
        content: '';
        position: absolute;
        width: 520px;
        height: 520px;
        right: -180px;
        top: -220px;
        border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--brand) 42%, transparent), transparent 68%);
        pointer-events: none;
      }

      /* the block keeps the container's left edge; only the measure narrows */
      .inner { position: relative; }
      .inner > * { max-width: 760px; }
      .display { color: #fff; }
      .eyebrow { color: rgba(255, 255, 255, .55); }
      .lede { color: rgba(255, 255, 255, .74); }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 30px;
      }
      .actions a { min-width: 190px; justify-content: center; }

      .reassure {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 22px 0 0;
        font-size: 13px;
        color: rgba(255, 255, 255, .55);
      }
      .reassure nz-icon { color: var(--brand-strong); }
      .sep { width: 1px; height: 13px; background: rgba(255, 255, 255, .2); margin-inline: 6px; }
    `,
  ],
})
export class CtaBandComponent {
  readonly eyebrow = input('Your piece of Bali');
  readonly heading = input('Your Piece of Bali Starts Here.');
  readonly lede = input(
    'Tell us how you want to use a villa here, roughly when, and what you are unsure about. You will get a straight answer, and nothing to sign.',
  );
  readonly primaryLabel = input('Start a Conversation');
}
