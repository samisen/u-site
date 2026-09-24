import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CatalogService } from '../core/catalog.service';
import { STATUS_COLOR, STATUS_LABEL, TYPE_LABEL, usd } from '../core/format';
import { Project } from '../core/models';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, NzIconModule, NzTagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  private readonly catalog = inject(CatalogService);

  readonly areaName = computed(() => this.catalog.areaName(this.project().area));
  readonly price = computed(() => usd(this.project().priceFromUsd, { compact: true }));
  readonly statusLabel = computed(() => STATUS_LABEL[this.project().status]);
  readonly statusColor = computed(() => STATUS_COLOR[this.project().status]);
  readonly typeLabel = computed(() => TYPE_LABEL[this.project().type]);
}
