import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, YIELD_CLAIM } from '../core/brand';
import { TranslatePipe } from '../core/i18n';
import { WhatsappService } from '../core/whatsapp.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NzIconModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly whatsapp = inject(WhatsappService);
  readonly year = new Date().getFullYear();
  readonly brand = BRAND;
  readonly yieldClaim = YIELD_CLAIM;

  readonly columns = [
    {
      title: 'footer.explore',
      links: [
        { label: 'nav.whyBali', link: '/why-bali' },
        { label: 'nav.opportunity', link: '/opportunity' },
        { label: 'nav.projects', link: '/projects' },
        { label: 'nav.design', link: '/design-your-villa' },
        { label: 'nav.process', link: '/how-we-build' },
      ],
    },
    {
      title: 'footer.more',
      links: [
        { label: 'nav.insights', link: '/insights' },
        { label: 'nav.contact', link: '/contact' },
      ],
    },
  ];
}
