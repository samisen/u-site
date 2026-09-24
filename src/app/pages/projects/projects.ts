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
import { usd } from '../../core/format';
import { YIELD_CLAIM } from '../../core/brand';
import { AreaId, ProjectStatus, ProjectType } from '../../core/models';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { ProjectCardComponent } from '../../shared/project-card';
import { RevealDirective } from '../../shared/reveal.directive';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsPage {
  readonly catalog = inject(CatalogService);
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
    this.catalog.areas().map((a) => ({ label: a.name, value: a.id })),
  );

  readonly typeOptions: { label: string; value: ProjectType }[] = [
    { label: 'Villa', value: 'villa' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Land', value: 'land' },
  ];

  readonly statusOptions: { label: string; value: ProjectStatus }[] = [
    { label: 'Available', value: 'available' },
    { label: 'Under construction', value: 'construction' },
    { label: 'Coming soon', value: 'coming-soon' },
    { label: 'Delivered', value: 'delivered' },
  ];

  readonly sortOptions: { label: string; value: ProjectFilters['sort'] }[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: low to high', value: 'price-asc' },
    { label: 'Price: high to low', value: 'price-desc' },
    { label: 'Highest gross yield', value: 'yield-desc' },
    { label: 'Soonest handover', value: 'handover-asc' },
  ];

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
