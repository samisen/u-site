import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, YIELD_CLAIM } from '../core/brand';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly brand = BRAND;
  readonly yieldClaim = YIELD_CLAIM;

  readonly columns = [
    {
      title: 'Explore',
      links: [
        { label: 'Why Bali', link: '/why-bali' },
        { label: 'The Opportunity', link: '/opportunity' },
        { label: 'Projects', link: '/projects' },
        { label: 'Design your villa', link: '/design-your-villa' },
        { label: 'How we build', link: '/how-we-build' },
      ],
    },
    {
      title: 'More',
      links: [
        { label: 'Insights', link: '/insights' },
        { label: 'Contact', link: '/contact' },
      ],
    },
  ];
}
