import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CatalogService, ProjectFilters } from '../../core/catalog.service';
import { STATUS_LABEL, TYPE_LABEL, usd } from '../../core/format';
import { YIELD_CLAIM } from '../../core/brand';
import { AreaId, ProjectStatus, ProjectType } from '../../core/models';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { ProjectCardComponent } from '../../shared/project-card';
import { RevealDirective } from '../../shared/reveal.directive';
import { I18nService, TranslatePipe } from '../../core/i18n';

@Component({
  selector: 'app-projects',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    NzButtonModule,
    NzDrawerModule,
    NzEmptyModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzSliderModule,
    NzPopoverModule,
    BaliMapComponent,
    PageHeroComponent,
    ProjectCardComponent,
    CtaBandComponent,
    RevealDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsPage {
  readonly catalog = inject(CatalogService);
  private readonly i18n = inject(I18nService);
  readonly results = this.catalog.filtered;
  readonly filters = this.catalog.filters;
  readonly activeCount = this.catalog.activeFilterCount;

  readonly claim = YIELD_CLAIM;
  readonly drawerOpen = signal(false);

  /** The map works one area at a time; the filter panel allows several. */
  readonly mapSelection = computed<AreaId | null>(() => {
    const areas = this.filters().areas;
    return areas.length === 1 ? areas[0] : null;
  });

  readonly areaOptions = computed(() =>
    this.catalog.areas().map((a) => ({ label: this.i18n.t(a.name), value: a.id })),
  );

  // ng-zorro's select takes finished strings, so these resolve here rather
  // than through the pipe — and re-resolve when the language changes
  readonly typeOptions = computed<{ label: string; value: ProjectType }[]>(() =>
    (['villa', 'townhouse', 'apartment', 'commercial', 'land'] as ProjectType[]).map((value) => ({
      value,
      label: this.i18n.t(TYPE_LABEL[value]),
    })),
  );

  readonly statusOptions = computed<{ label: string; value: ProjectStatus }[]>(() =>
    (['available', 'construction', 'coming-soon', 'delivered'] as ProjectStatus[]).map((value) => ({
      value,
      label: this.i18n.t(STATUS_LABEL[value]),
    })),
  );

  readonly sortOptions = computed<{ label: string; value: ProjectFilters['sort'] }[]>(() =>
    (
      ['featured', 'price-asc', 'price-desc', 'yield-desc', 'handover-asc'] as ProjectFilters['sort'][]
    ).map((value) => ({ value, label: this.i18n.t(`projects.sort.${value}`) })),
  );

  readonly priceMax = 900000;
  readonly priceMin = 150000;

  priceLabel = (v: number): string => usd(v, { compact: true });

  onSearch(value: string): void {
    this.catalog.patchFilters({ search: value });
  }

  onAreas(value: AreaId[]): void {
    this.catalog.patchFilters({ areas: value });
  }

  onMapSelect(area: AreaId | null): void {
    this.catalog.patchFilters({ areas: area ? [area] : [] });
    this.results()
      .length && document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onTypes(value: ProjectType[]): void {
    this.catalog.patchFilters({ types: value });
  }

  onStatuses(value: ProjectStatus[]): void {
    this.catalog.patchFilters({ statuses: value });
  }

  onSort(value: ProjectFilters['sort']): void {
    this.catalog.patchFilters({ sort: value });
  }

  onMaxPrice(value: number): void {
    this.catalog.patchFilters({ maxPrice: value >= this.priceMax ? null : value });
  }

  onMinYield(value: number): void {
    this.catalog.patchFilters({ minYield: value <= 0 ? null : value });
  }

  reset(): void {
    this.catalog.resetFilters();
  }
}
