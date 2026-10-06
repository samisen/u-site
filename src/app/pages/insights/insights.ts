import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { INSIGHTS, INSIGHT_CATEGORIES, InsightFilter, insightCategoryKey } from '../../core/content';
import { TranslatePipe } from '../../core/i18n';
import { CatalogService } from '../../core/catalog.service';
import { AreaId } from '../../core/models';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-insights',
  imports: [RouterLink, NzIconModule, PageHeroComponent, CtaBandComponent, RevealDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './insights.html',
  styleUrl: './insights.css',
})
export class InsightsPage {
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);

  readonly categories = INSIGHT_CATEGORIES;
  readonly active = signal<InsightFilter>('all');
  readonly categoryKey = insightCategoryKey;

  /**
   * Arrived from a place rather than from the list: `?area=ubud` narrows the
   * reading to the pieces that actually discuss Ubud. Bound straight from the
   * query string, so the filtered view is a link somebody can send.
   */
  readonly area = input<string>('');

  readonly areaName = computed(() => {
    const id = this.area() as AreaId;
    return id ? (this.catalog.areaById(id)?.name ?? null) : null;
  });

  clearArea(): void {
    void this.router.navigate([], { queryParams: {} });
  }

  readonly articles = computed(() => {
    const cat = this.active();
    const area = this.area() as AreaId;
    let list = cat === 'all' ? INSIGHTS : INSIGHTS.filter((a) => a.category === cat);
    if (area && this.areaName()) list = list.filter((a) => a.areas.includes(area));
    return list;
  });

  /** The lead card is only a lead when nothing is narrowing the list. */
  readonly isFiltered = computed(() => this.active() !== 'all' || !!this.areaName());
  readonly lead = computed(() => (this.isFiltered() ? null : INSIGHTS[0]));
  readonly rest = computed(() => (this.isFiltered() ? this.articles() : this.articles().slice(1)));
}
