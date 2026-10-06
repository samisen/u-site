import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { TranslatePipe } from '../../core/i18n';
import { usd } from '../../core/format';
import { AREA_FACETS, AreaId } from '../../core/models';
import { netYieldPct } from '../../core/yield-model';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Where a project goes, and why.
 *
 * Choosing an area is a development decision rather than a preference for a
 * neighbourhood, so each one is shown with what it costs, what it earns and
 * who it suits — and the page says plainly that the three do not move
 * together. A beach plot is not better than a rice-field plot; it is a
 * different business.
 */
@Component({
  selector: 'app-locations',
  imports: [
    RouterLink,
    NzButtonModule,
    NzIconModule,
    PageHeroComponent,
    CtaBandComponent,
    BaliMapComponent,
    RevealDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class LocationsPage {
  private readonly catalog = inject(CatalogService);

  readonly areas = this.catalog.areas;

  readonly facets = AREA_FACETS;

  /**
   * One area is always chosen. An empty detail panel beside a list of eight
   * places is a worse first impression than simply opening on the first one.
   */
  readonly chosen = signal<AreaId>('canggu');
  readonly current = computed(
    () => this.areas().find((a) => a.id === this.chosen()) ?? this.areas()[0],
  );

  choose(id: AreaId): void {
    this.chosen.set(id);
  }

  /** How the areas separate once the numbers are beside each other. */
  readonly spread = computed(() => {
    const list = this.areas();
    const rates = list.map((a) => a.avgNightlyRateUsd);
    const land = list.map((a) => a.landPriceArePerYearUsd);
    return {
      rateLow: Math.min(...rates),
      rateHigh: Math.max(...rates),
      landLow: Math.min(...land),
      landHigh: Math.max(...land),
    };
  });

  money(value: number): string {
    return usd(value);
  }

  /**
   * What a representative villa in this area would return, on the same
   * investment and the same letting assumption everywhere, so the only thing
   * varying between the cards is the area itself.
   */
  indicativeYield(nightly: number, occupancy: number): string {
    return netYieldPct(nightly, occupancy, 330_000).toFixed(1);
  }
}
