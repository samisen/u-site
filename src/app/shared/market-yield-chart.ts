import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { YIELD_CLAIM } from '../core/brand';
import { MARKET_YIELDS, MARKET_YIELDS_META } from '../core/content';

/**
 * Six broad country-level residential yields, plus a separate card for the
 * Bali indicative range.
 *
 * The two are deliberately different objects: the brief requires that the
 * 12–22% range is never drawn as a seventh bar, because it is a different
 * measure (short-term hospitality) from a different source. One series means
 * one colour for every bar — a value ramp would double-encode bar length.
 */
@Component({
  selector: 'app-market-yield-chart',
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './market-yield-chart.html',
  styleUrl: './market-yield-chart.css',
})
export class MarketYieldChartComponent {
  readonly meta = MARKET_YIELDS_META;
  readonly claim = YIELD_CLAIM;

  readonly showTable = signal(false);
  readonly hovered = signal<string | null>(null);

  private readonly domainMax = 8;

  readonly bars = computed(() =>
    MARKET_YIELDS.map((m) => ({
      ...m,
      height: (m.yieldPct / this.domainMax) * 100,
    })),
  );

  toggleTable(): void {
    this.showTable.update((v) => !v);
  }
}
