import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { I18nService, TranslatePipe } from '../../core/i18n';
import { WhatsappService } from '../../core/whatsapp.service';

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
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);
  private readonly i18n = inject(I18nService);

  readonly whatsapp = inject(WhatsappService);
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

  // nz-select renders finished strings, so these resolve here and follow the
  // switcher through the service's version signal
  readonly intendedUses = computed(() =>
    ['lifestyle', 'investment', 'hybrid', 'unsure'].map((value) => ({
      value,
      label: this.i18n.t(`contact.use.${value}`),
    })),
  );

  readonly budgets = computed(() =>
    ['<250', '250-450', '450-700', '700-1000', '1000+', 'unsure'].map((value, i) => ({
      value,
      label: this.i18n.t(`contact.budget${i + 1}`),
    })),
  );

  readonly timelines = computed(() =>
    ['0-3', '3-6', '6-12', '12+', 'exploring'].map((value, i) => ({
      value,
      label: this.i18n.t(`contact.timeline${i + 1}`),
    })),
  );

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => {
        c.markAsDirty();
        c.updateValueAndValidity({ onlySelf: true });
      });
      this.message.error(this.i18n.t('contact.error'));
      return;
    }

    this.submitting.set(true);
    // Demo only — no backend yet. The Supabase insert goes here, and this is
    // also where the CTA/analytics event for the contact form is fired.
    setTimeout(() => {
      this.submitting.set(false);
      this.sent.set(true);
      this.message.success(this.i18n.t('contact.success'));
    }, 900);
  }

  reset(): void {
    this.form.reset({ intendedUse: 'hybrid', consent: false });
    this.moreOpen.set(false);
    this.sent.set(false);
  }
}
