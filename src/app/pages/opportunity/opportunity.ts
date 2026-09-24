import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, YIELD_CLAIM } from '../../core/brand';
import { INSIGHTS, OPPORTUNITY } from '../../core/content';
import { CatalogService } from '../../core/catalog.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { MarketYieldChartComponent } from '../../shared/market-yield-chart';
import { PageHeroComponent } from '../../shared/page-hero';
import { ProjectCardComponent } from '../../shared/project-card';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-opportunity',
  imports: [
    RouterLink,
    NzButtonModule,
    NzIconModule,
    PageHeroComponent,
    CtaBandComponent,
    MarketYieldChartComponent,
    ProjectCardComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './opportunity.html',
  styleUrl: './opportunity.css',
})
export class OpportunityPage {
  private readonly catalog = inject(CatalogService);

  readonly copy = OPPORTUNITY;
  readonly claim = YIELD_CLAIM;
  readonly brand = BRAND;
  readonly featured = this.catalog.featured;

  readonly reading = INSIGHTS.filter((a) => a.category === 'Investment').slice(0, 3);

}
