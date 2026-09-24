import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { INSIGHTS } from '../../core/content';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-insight-detail',
  imports: [RouterLink, NzIconModule, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './insight-detail.html',
  styleUrl: './insight-detail.css',
})
export class InsightDetailPage {
  readonly slug = input<string>('');
  private readonly router = inject(Router);

  readonly article = computed(() => INSIGHTS.find((a) => a.slug === this.slug()));

  readonly related = computed(() => {
    const current = this.article();
    if (!current) return [];
    const sameCategory = INSIGHTS.filter(
      (a) => a.slug !== current.slug && a.category === current.category,
    );
    const rest = INSIGHTS.filter((a) => a.slug !== current.slug && a.category !== current.category);
    return [...sameCategory, ...rest].slice(0, 3);
  });

  constructor() {
    effect(() => {
      if (this.slug() && !this.article()) {
        void this.router.navigate(['/insights']);
      }
    });
  }
}
