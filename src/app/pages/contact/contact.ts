import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BRAND } from '../../core/brand';
import { PageHeroComponent } from '../../shared/page-hero';

@Component({
  selector: 'app-contact',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzResultModule,
    NzSelectModule,
    PageHeroComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);

  readonly brand = BRAND;
  readonly submitting = signal(false);
  readonly sent = signal(false);

  /** Country, budget and timeline are useful but cost us submissions, so they
      sit behind a disclosure rather than in the main field set. */
  readonly moreOpen = signal(false);

  /** Field set specified in the developer brief's lead-form requirements. */
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    intendedUse: ['hybrid', [Validators.required]],
    message: [''],
    // optional detail
    phone: [''],
    country: [''],
    budget: [''],
    timeline: [''],
    consent: [false, [Validators.requiredTrue]],
  });

  readonly intendedUses = [
    { value: 'lifestyle', label: 'Lifestyle — mostly my own use' },
    { value: 'investment', label: 'Investment — mostly let' },
    { value: 'hybrid', label: 'Hybrid — both, deliberately' },
    { value: 'unsure', label: 'Not sure yet' },
  ];

  readonly budgets = [
    { value: '<250', label: 'Under $250,000' },
    { value: '250-450', label: '$250,000 – $450,000' },
    { value: '450-700', label: '$450,000 – $700,000' },
    { value: '700-1000', label: '$700,000 – $1,000,000' },
    { value: '1000+', label: 'Above $1,000,000' },
    { value: 'unsure', label: 'Still working it out' },
  ];

  readonly timelines = [
    { value: '0-3', label: 'Within 3 months' },
    { value: '3-6', label: '3 – 6 months' },
    { value: '6-12', label: '6 – 12 months' },
    { value: '12+', label: 'More than a year away' },
    { value: 'exploring', label: 'Just exploring' },
  ];

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => {
        c.markAsDirty();
        c.updateValueAndValidity({ onlySelf: true });
      });
      this.message.error('A few fields still need attention.');
      return;
    }

    this.submitting.set(true);
    // Demo only — no backend yet. The Supabase insert goes here, and this is
    // also where the CTA/analytics event for the contact form is fired.
    setTimeout(() => {
      this.submitting.set(false);
      this.sent.set(true);
      this.message.success('Message sent. We will reply within one working day.');
    }, 900);
  }

  reset(): void {
    this.form.reset({ intendedUse: 'hybrid', consent: false });
    this.moreOpen.set(false);
    this.sent.set(false);
  }
}
