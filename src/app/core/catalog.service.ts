import { Injectable, computed, inject, signal } from '@angular/core';
import { AREAS, AREA_MAP, FAQS, PILLARS, PROCESS, PROJECTS, STATS, TESTIMONIALS } from './data';
import { Area, AreaId, Project, ProjectStatus, ProjectType } from './models';
import { I18nService } from './i18n';

export interface ProjectFilters {
  search: string;
  areas: AreaId[];
  types: ProjectType[];
  statuses: ProjectStatus[];
  maxPrice: number | null;
  minYield: number | null;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'yield-desc' | 'handover-asc';
}

export const EMPTY_FILTERS: ProjectFilters = {
  search: '',
  areas: [],
  types: [],
  statuses: [],
  maxPrice: null,
  minYield: null,
  sort: 'featured',
};

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly i18n = inject(I18nService);

  readonly projects = signal<Project[]>(PROJECTS);
  readonly areas = signal<Area[]>(AREAS);
  readonly pillars = PILLARS;
  readonly process = PROCESS;
  readonly testimonials = TESTIMONIALS;
  readonly faqs = FAQS;
  readonly stats = STATS;

  readonly filters = signal<ProjectFilters>({ ...EMPTY_FILTERS });

  readonly featured = computed(() =>
    this.projects()
      .filter((p) => p.status === 'construction' || p.status === 'available')
      .slice(0, 3),
  );

  readonly filtered = computed<Project[]>(() => {
    // re-reads when the language changes, so a search stays valid after a switch
    this.i18n.version();
    const f = this.filters();
    const needle = f.search.trim().toLowerCase();

    const list = this.projects().filter((p) => {
      if (f.areas.length && !f.areas.includes(p.area)) return false;
      if (f.types.length && !f.types.includes(p.type)) return false;
      if (f.statuses.length && !f.statuses.includes(p.status)) return false;
      if (f.maxPrice != null && p.priceFromUsd > f.maxPrice) return false;
      if (f.minYield != null && p.projectedGrossYield < f.minYield) return false;
      if (needle) {
        // the fields hold keys, so the visitor is searching what they can read
        const hay = [p.name, p.headline, p.summary, this.areaName(p.area)]
          .map((key) => this.i18n.t(key))
          .join(' ')
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    switch (f.sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.priceFromUsd - b.priceFromUsd);
      case 'price-desc':
        return [...list].sort((a, b) => b.priceFromUsd - a.priceFromUsd);
      case 'yield-desc':
        return [...list].sort((a, b) => b.projectedGrossYield - a.projectedGrossYield);
      case 'handover-asc':
        return [...list].sort((a, b) => a.handoverOrder - b.handoverOrder);
      default:
        return list;
    }
  });

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    return (
      (f.search ? 1 : 0) +
      f.areas.length +
      f.types.length +
      f.statuses.length +
      (f.maxPrice != null ? 1 : 0) +
      (f.minYield != null ? 1 : 0)
    );
  });

  patchFilters(patch: Partial<ProjectFilters>): void {
    this.filters.update((f) => ({ ...f, ...patch }));
  }

  resetFilters(): void {
    this.filters.set({ ...EMPTY_FILTERS });
  }

  bySlug(slug: string): Project | undefined {
    return this.projects().find((p) => p.slug === slug);
  }

  areaById(id: AreaId): Area | undefined {
    return AREA_MAP.get(id);
  }

  /** Translation key for an area's name — pipe it, or pass it through `t`. */
  areaName(id: AreaId): string {
    return AREA_MAP.get(id)?.name ?? id;
  }

  related(project: Project, count = 3): Project[] {
    const others = this.projects().filter((p) => p.id !== project.id);
    const sameArea = others.filter((p) => p.area === project.area);
    const rest = others.filter((p) => p.area !== project.area);
    return [...sameArea, ...rest].slice(0, count);
  }
}
