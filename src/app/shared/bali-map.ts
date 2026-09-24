import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { I18nService, TranslatePipe } from '../core/i18n';
import { AREA_POINTS, BALI_MAP, MAP_LANDMARKS } from '../core/bali-geo';
import { CatalogService } from '../core/catalog.service';
import { AreaId } from '../core/models';
import { usd } from '../core/format';

interface AreaMarker {
  id: AreaId;
  name: string;
  x: number;
  y: number;
  count: number;
  radius: number;
}

/**
 * Bali with a marker per area, sized by how many projects sit there.
 * Hovering or selecting an area surfaces its numbers; selecting one tells the
 * parent so the project list can filter to it.
 */
@Component({
  selector: 'app-bali-map',
  imports: [NzIconModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bali-map.html',
  styleUrl: './bali-map.css',
})
export class BaliMapComponent {
  private readonly catalog = inject(CatalogService);
  private readonly i18n = inject(I18nService);

  /** Area currently filtered in the parent, if any. */
  readonly selected = input<AreaId | null>(null);
  readonly selectArea = output<AreaId | null>();

  readonly map = BALI_MAP;
  readonly landmarks = MAP_LANDMARKS;
  readonly hovered = signal<AreaId | null>(null);

  readonly markers = computed<AreaMarker[]>(() => {
    // the marker labels are drawn as SVG text, so they are resolved here
    this.i18n.version();
    return this.catalog.areas().map((area) => {
      const count = this.catalog.projects().filter((p) => p.area === area.id).length;
      return {
        id: area.id,
        name: this.i18n.t(area.name),
        ...AREA_POINTS[area.id],
        count,
        // area of the disc tracks the count, so two projects do not look like four
        radius: count ? 13 + Math.sqrt(count) * 7 : 8,
      };
    });
  });

  /** The area whose card is shown: hover wins, then the current selection. */
  readonly active = computed(() => this.hovered() ?? this.selected());

  readonly activeArea = computed(() => {
    const id = this.active();
    return id ? this.catalog.areaById(id) : undefined;
  });

  readonly activeCount = computed(() => {
    const id = this.active();
    return id ? this.catalog.projects().filter((p) => p.area === id).length : 0;
  });

  toggle(id: AreaId): void {
    this.selectArea.emit(this.selected() === id ? null : id);
  }

  clear(): void {
    this.selectArea.emit(null);
  }

  land(v: number): string {
    return usd(v);
  }
}
