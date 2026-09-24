import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, TOURISM, YIELD_CLAIM } from '../../core/brand';
import { HERO, MISSION_LINE, TWO_VALUES } from '../../core/content';
import { CatalogService } from '../../core/catalog.service';
import { AreaId } from '../../core/models';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { ProjectCardComponent } from '../../shared/project-card';
import { RevealDirective } from '../../shared/reveal.directive';
import { VideoPlayerComponent } from '../../shared/video-player';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NzButtonModule,
    NzIconModule,
    BaliMapComponent,
    ProjectCardComponent,
    CtaBandComponent,
    VideoPlayerComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  private readonly catalog = inject(CatalogService);

  readonly brand = BRAND;
  readonly claim = YIELD_CLAIM;
  readonly tourism = TOURISM;

  readonly hero = HERO;
  readonly values = TWO_VALUES;
  readonly mission = MISSION_LINE;
  readonly featured = this.catalog.featured;

  /** Picking an area on the map hands the visitor straight to the filtered list. */
  readonly mapArea = signal<AreaId | null>(null);

  readonly mapCount = computed(() => {
    const id = this.mapArea();
    return id ? this.catalog.projects().filter((p) => p.area === id).length : 0;
  });

  onMapSelect(area: AreaId | null): void {
    this.mapArea.set(area);
  }
}
