import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, YIELD_CLAIM } from '../../core/brand';
import { AFTER_HANDOVER, CRAFT, DUE_DILIGENCE, BELIEF_LINE, BUILD_STEPS, ROLE_LINE, TAILOR_MADE_LINE } from '../../core/content';
import { CatalogService } from '../../core/catalog.service';
import { MANAGEMENT_FEE, OPERATING_COST } from '../../core/yield-model';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { TranslatePipe } from '../../core/i18n';

interface CostLine {
  /** Translation key. */
  label: string;
  share: number;
  /** Translation key. */
  note: string;
}

interface StatementLine {
  /** Translation key. */
  label: string;
  amount: number;
  kind: 'in' | 'out' | 'total';
}

@Component({
  selector: 'app-process',
  imports: [
    NzButtonModule,
    NzCollapseModule,
    NzIconModule,
    PageHeroComponent,
    CtaBandComponent,
    RevealDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.html',
  styleUrl: './process.css',
})
export class ProcessPage {
  readonly craft = CRAFT;
  readonly diligence = DUE_DILIGENCE;
  readonly after = AFTER_HANDOVER;
  private readonly catalog = inject(CatalogService);

  readonly steps = BUILD_STEPS;
  readonly role = ROLE_LINE;
  readonly tailorMade = TAILOR_MADE_LINE;
  readonly belief = BELIEF_LINE;
  readonly brand = BRAND;
  readonly claim = YIELD_CLAIM;
  readonly faqs = this.catalog.faqs;

  readonly costs: CostLine[] = [
    { label: 'process.cost1.label', share: 32, note: 'process.cost1.note' },
    { label: 'process.cost2.label', share: 40, note: 'process.cost2.note' },
    { label: 'process.cost3.label', share: 9, note: 'process.cost3.note' },
    { label: 'process.cost4.label', share: 7, note: 'process.cost4.note' },
    { label: 'process.cost5.label', share: 7, note: 'process.cost5.note' },
    { label: 'process.cost6.label', share: 5, note: 'process.cost6.note' },
  ];

  /** What the operations team does once the keys change hands. */
  readonly services = [
    { icon: 'global', title: 'process.service.listing.title', text: 'process.service.listing.text' },
    { icon: 'fund', title: 'process.service.pricing.title', text: 'process.service.pricing.text' },
    { icon: 'team', title: 'process.service.reception.title', text: 'process.service.reception.text' },
    { icon: 'tool', title: 'process.service.maintenance.title', text: 'process.service.maintenance.text' },
    { icon: 'audit', title: 'process.service.accounting.title', text: 'process.service.accounting.text' },
    { icon: 'schedule', title: 'process.service.reporting.title', text: 'process.service.reporting.text' },
  ];

  readonly statement: StatementLine[] = [
    { label: 'process.statement1', amount: 7080, kind: 'in' },
    { label: 'process.statement2', amount: 1625, kind: 'in' },
    { label: 'process.statement3', amount: -1062, kind: 'out' },
    { label: 'process.statement4', amount: -1567, kind: 'out' },
    { label: 'process.statement5', amount: -640, kind: 'out' },
    { label: 'process.statement6', amount: -410, kind: 'out' },
    { label: 'process.statement7', amount: -95, kind: 'out' },
    { label: 'process.statement8', amount: 4931, kind: 'total' },
  ];

  readonly principles = [
    { icon: 'solution', title: 'process.principle.tailorMade.title', text: 'process.principle.tailorMade.text' },
    { icon: 'audit', title: 'process.principle.numbers.title', text: 'process.principle.numbers.text' },
    { icon: 'camera', title: 'process.principle.visible.title', text: 'process.principle.visible.text' },
    { icon: 'rise', title: 'process.principle.afterHandover.title', text: 'process.principle.afterHandover.text' },
  ];

  readonly safeguards = [
    { icon: 'file-protect', title: 'process.safeguard.title.title', text: 'process.safeguard.title.text' },
    { icon: 'gold', title: 'process.safeguard.cost.title', text: 'process.safeguard.cost.text' },
    { icon: 'clock-circle', title: 'process.safeguard.handover.title', text: 'process.safeguard.handover.text' },
    { icon: 'experiment', title: 'process.safeguard.earning.title', text: 'process.safeguard.earning.text' },
  ];

  /** The net line carries the two percentages the model actually uses. */
  readonly methodology = [
    { title: 'process.method.revenue.title', text: 'process.method.revenue.text', params: undefined },
    { title: 'process.method.gross.title', text: 'process.method.gross.text', params: undefined },
    {
      title: 'process.method.net.title',
      text: 'process.method.net.text',
      params: {
        fee: Math.round(MANAGEMENT_FEE * 100),
        opex: Math.round(OPERATING_COST * 100),
      },
    },
    { title: 'process.method.returns.title', text: 'process.method.returns.text', params: undefined },
  ];

  abs(v: number): number {
    return Math.abs(v);
  }
}
