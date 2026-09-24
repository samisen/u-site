import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslatePipe } from '../../core/i18n';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NzButtonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <div class="container nf-inner">
        <p class="eyebrow">404</p>
        <h1 class="display">{{ 'notFound.title' | t }}</h1>
        <p class="lede">{{ 'notFound.lede' | t }}</p>
        <div class="nf-actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/">{{ 'notFound.home' | t }}</a>
          <a nz-button nzSize="large" routerLink="/projects">{{ 'cta.browseProjects' | t }}</a>
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
