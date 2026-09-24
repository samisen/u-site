import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, YIELD_CLAIM } from '../../core/brand';
import { BELIEF_LINE, BUILD_STEPS, ROLE_LINE, TAILOR_MADE_LINE } from '../../core/content';
import { CatalogService } from '../../core/catalog.service';
import { MANAGEMENT_FEE, OPERATING_COST } from '../../core/yield-model';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';

interface CostLine {
  label: string;
  share: number;
  note: string;
}

interface StatementLine {
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.html',
  styleUrl: './process.css',
})
export class ProcessPage {
  private readonly catalog = inject(CatalogService);

  readonly steps = BUILD_STEPS;
  readonly role = ROLE_LINE;
  readonly tailorMade = TAILOR_MADE_LINE;
  readonly belief = BELIEF_LINE;
  readonly brand = BRAND;
  readonly claim = YIELD_CLAIM;
  readonly faqs = this.catalog.faqs;

  readonly costs: CostLine[] = [
    { label: 'Land (leasehold, 25–30 years, pre-paid)', share: 32, note: 'Paid to the landowner at signing, in front of the notary.' },
    { label: 'Construction', share: 40, note: 'Structure, roof, envelope, services and finishes, against a fixed BOQ.' },
    { label: 'Furniture and fit-out', share: 9, note: 'Specified for rental durability, not for the showroom photo.' },
    { label: 'Pool, landscaping and external works', share: 7, note: 'Pool plant, hardscape, planting, boundary walls, driveway.' },
    { label: 'Design and engineering', share: 7, note: 'Architecture, structural design, quantity surveying, site supervision.' },
    { label: 'Permits, notary, PT PMA and legal', share: 5, note: 'PBG, company formation, due diligence, notarial fees and taxes.' },
  ];

  /** What the operations team does once the keys change hands. */
  readonly services = [
    { icon: 'global', title: 'Listing and distribution', text: 'Airbnb, Booking.com, Agoda and a direct site, behind one calendar. Photography and copy are produced before handover, not after.' },
    { icon: 'fund', title: 'Dynamic pricing', text: 'Rates move daily against occupancy, lead time, events and what comparable villas in the street are charging.' },
    { icon: 'team', title: 'Guest reception, 24/7', text: 'Check-in at three in the morning, a driver, a broken air-conditioner at midnight. Handled locally, in person.' },
    { icon: 'tool', title: 'Maintenance and upkeep', text: 'Housekeeping, pool and garden, and a preventive schedule written by the people who built the property. Repairs at cost.' },
    { icon: 'audit', title: 'Accounting and tax', text: 'PB1 lodgement, company bookkeeping, annual filings and the paperwork your accountant at home will ask for.' },
    { icon: 'schedule', title: 'Owner reporting', text: 'One statement on the fifth of every month: what came in, what went out, what was transferred, and anything unusual.' },
  ];

  readonly statement: StatementLine[] = [
    { label: 'Rental revenue, 24 nights', amount: 7080, kind: 'in' },
    { label: 'Direct bookings, 5 nights', amount: 1625, kind: 'in' },
    { label: 'Channel commission', amount: -1062, kind: 'out' },
    { label: 'Management fee, 18%', amount: -1567, kind: 'out' },
    { label: 'Housekeeping and laundry', amount: -640, kind: 'out' },
    { label: 'Pool, garden and utilities', amount: -410, kind: 'out' },
    { label: 'Repairs (pool pump seal, at cost)', amount: -95, kind: 'out' },
    { label: 'Transferred to the owner', amount: 4931, kind: 'total' },
  ];

  readonly principles = [
    { icon: 'solution', title: 'Tailor-made by default', text: 'We start from what you want the property to do. The same plot produces a different building for a different owner, and that is the point.' },
    { icon: 'audit', title: 'Numbers you can check', text: 'Every projection comes with its assumptions written down — the rate, the occupancy, the percentages — so you can follow the reasoning and test it against your own.' },
    { icon: 'camera', title: 'Visible as it is built', text: 'Photographs from site every week and spend reconciled against the bill of quantities every month, so you always know exactly where your build stands.' },
    { icon: 'rise', title: 'With you after handover', text: 'The team that designed and built your villa is the team that runs it, so the same people stay accountable for how it performs.' },
  ];

  readonly safeguards = [
    {
      icon: 'file-protect',
      title: 'Title verified first',
      text: 'Every plot is checked at the land office against the certificate chain, and the banjar is consulted before an offer goes in. You see exactly what we found, and we move forward on land that is clean to lease.',
    },
    {
      icon: 'gold',
      title: 'Cost held to the quote',
      text: 'You sign a line-item bill of quantities rather than a rate per square metre. Our quantity surveyor reconciles spend against it monthly, so every variance is on the table in the month it happens.',
    },
    {
      icon: 'clock-circle',
      title: 'Handover on the agreed date',
      text: 'The programme is contractual, with liquidated damages behind it. Ninety-six per cent of what we have delivered since 2016 landed on or before the contracted date.',
    },
    {
      icon: 'experiment',
      title: 'Earning from week one',
      text: 'Listings, photography and pricing are prepared in the final eight weeks of construction, so the villa goes live within three weeks of handover rather than three months.',
    },
  ];

  readonly methodology = [
    {
      title: 'Where the revenue assumption comes from',
      text: 'A nightly rate taken from comparable properties in the same area and bedroom count — not from the three best-performing villas on the island — multiplied by an occupancy assumption we can evidence from our own managed portfolio.',
    },
    {
      title: 'What gross yield covers',
      text: 'Gross rental yield is annual rental revenue divided by total investment, before operating expenses, taxes, management, maintenance, utilities and platform fees. It is a comparison metric, not money in your account.',
    },
    {
      title: 'How we get from gross to net',
      text: `We model an ${Math.round(MANAGEMENT_FEE * 100)}% management and channel fee and roughly ${Math.round(OPERATING_COST * 100)}% operating cost — staff, utilities, pool and garden, consumables, repairs and a sinking fund. Both figures appear side by side on every project page.`,
    },
    {
      title: 'How we talk about returns',
      text: 'Every number here is a projection with its assumptions on show, which is why we publish an evidenced range rather than a guaranteed return or a fixed income. Occupancy, nightly rates, regulation and taxation all move, and you are welcome to challenge any assumption we have made.',
    },
  ];

  abs(v: number): number {
    return Math.abs(v);
  }
}
