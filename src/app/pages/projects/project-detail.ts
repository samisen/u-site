import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CatalogService } from '../../core/catalog.service';
import { MANAGEMENT_FEE, OPERATING_COST } from '../../core/yield-model';
import { YIELD_CLAIM } from '../../core/brand';
import { STATUS_COLOR, STATUS_LABEL, TYPE_LABEL, usd } from '../../core/format';
import { ProjectCardComponent } from '../../shared/project-card';
import { VideoPlayerComponent } from '../../shared/video-player';
import { RevealDirective } from '../../shared/reveal.directive';



@Component({
  selector: 'app-project-detail',
  imports: [
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzCarouselModule,
    NzIconModule,
    NzProgressModule,
    NzSliderModule,
    NzTabsModule,
    NzTagModule,
    NzTimelineModule,
    NzTooltipModule,
    ProjectCardComponent,
    VideoPlayerComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetailPage {
  readonly slug = input<string>('');

  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  readonly project = computed(() => this.catalog.bySlug(this.slug()));
  readonly area = computed(() => {
    const p = this.project();
    return p ? this.catalog.areaById(p.area) : undefined;
  });
  readonly related = computed(() => {
    const p = this.project();
    return p ? this.catalog.related(p) : [];
  });

  readonly statusLabel = computed(() => STATUS_LABEL[this.project()?.status ?? ''] ?? '');
  readonly statusColor = computed(() => STATUS_COLOR[this.project()?.status ?? ''] ?? 'default');
  readonly typeLabel = computed(() => TYPE_LABEL[this.project()?.type ?? ''] ?? '');

  /* ---------- yield model ---------- */

  readonly nightly = linkedSignal(() => this.project()?.nightlyRateUsd ?? 0);
  readonly occupancy = linkedSignal(() => Math.round((this.project()?.targetOccupancy ?? 0) * 100));
  readonly investment = linkedSignal(() => this.project()?.priceFromUsd ?? 0);

  readonly grossAnnual = computed(() =>
    Math.round(this.nightly() * 365 * (this.occupancy() / 100)),
  );
  readonly feeAnnual = computed(() => Math.round(this.grossAnnual() * MANAGEMENT_FEE));
  readonly opexAnnual = computed(() => Math.round(this.grossAnnual() * OPERATING_COST));
  readonly netAnnual = computed(() => this.grossAnnual() - this.feeAnnual() - this.opexAnnual());
  readonly grossYield = computed(() =>
    this.investment() > 0 ? (this.grossAnnual() / this.investment()) * 100 : 0,
  );
  readonly netYield = computed(() =>
    this.investment() > 0 ? (this.netAnnual() / this.investment()) * 100 : 0,
  );
  readonly payback = computed(() =>
    this.netAnnual() > 0 ? this.investment() / this.netAnnual() : 0,
  );
  readonly overLease = computed(() => {
    const p = this.project();
    if (!p) return 0;
    return this.netAnnual() * (p.leaseYears + p.leaseExtensionYears);
  });

  readonly modelled = computed(() => (this.project()?.nightlyRateUsd ?? 0) > 0);

  readonly claim = YIELD_CLAIM;
  readonly feePct = Math.round(MANAGEMENT_FEE * 100);
  readonly opexPct = Math.round(OPERATING_COST * 100);

  constructor() {
    // an unknown slug should not leave the visitor on an empty page
    effect(() => {
      if (this.slug() && !this.project()) {
        void this.router.navigate(['/projects']);
      }
    });
  }

  money(v: number, compact = false): string {
    return usd(v, { compact });
  }

  resetModel(): void {
    const p = this.project();
    if (!p) return;
    this.nightly.set(p.nightlyRateUsd);
    this.occupancy.set(Math.round(p.targetOccupancy * 100));
    this.investment.set(p.priceFromUsd);
  }
}
