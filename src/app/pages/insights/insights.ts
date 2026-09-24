import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { INSIGHTS, INSIGHT_CATEGORIES } from '../../core/content';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-insights',
  imports: [RouterLink, NzIconModule, PageHeroComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './insights.html',
  styleUrl: './insights.css',
})
export class InsightsPage {
  readonly categories = INSIGHT_CATEGORIES;
  readonly active = signal<string>('All');

  readonly articles = computed(() => {
    const cat = this.active();
    return cat === 'All' ? INSIGHTS : INSIGHTS.filter((a) => a.category === cat);
  });

  readonly lead = INSIGHTS[0];
  readonly rest = computed(() =>
    this.active() === 'All' ? this.articles().slice(1) : this.articles(),
  );
}
