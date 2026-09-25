import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TOURISM } from '../../core/brand';
import { INSIGHTS, LIVING_HERE, WHY_BALI, insightCategoryKey } from '../../core/content';
import { CatalogService } from '../../core/catalog.service';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { TranslatePipe } from '../../core/i18n';
import { VideoPlayerComponent } from '../../shared/video-player';

@Component({
  selector: 'app-why-bali',
  imports: [
    RouterLink,
    NzButtonModule,
    NzIconModule,
    BaliMapComponent,
    PageHeroComponent,
    CtaBandComponent,
    VideoPlayerComponent,
    RevealDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './why-bali.html',
  styleUrl: './why-bali.css',
})
export class WhyBaliPage {
  private readonly catalog = inject(CatalogService);

  readonly copy = WHY_BALI;
  readonly living = LIVING_HERE;
  readonly categoryKey = insightCategoryKey;
  readonly tourism = TOURISM;
  readonly areas = this.catalog.areas;

  /** The lifestyle-side reading, for people who want more than the page gives. */
  readonly reading = INSIGHTS.filter((a) => a.category === 'bali-lifestyle').slice(0, 2);
}
