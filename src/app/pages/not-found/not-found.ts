import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NzButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <div class="container nf-inner">
        <p class="eyebrow">404</p>
        <h1 class="display">This one is not on the map.</h1>
        <p class="lede">
          The page you were after does not exist — or it was a plot, and it sold. Either way, there
          is plenty else to look at.
        </p>
        <div class="nf-actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/">Back to the home page</a>
          <a nz-button nzSize="large" routerLink="/projects">Browse projects</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .nf {
        min-height: 78vh;
        display: grid;
        align-items: center;
        background: var(--bg-sand);
        padding-top: calc(var(--header-h) + 40px);
        padding-bottom: 72px;
      }
      .nf-inner { max-width: 640px; }
      .nf-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
    `,
  ],
})
export class NotFoundPage {}
