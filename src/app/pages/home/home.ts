import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import { HERO_SLIDES, HOME_CHAPTERS, HOME_STAGES, HOME_VALUES } from '../../core/content';
import { TranslatePipe } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';

/** How long a frame holds before it begins giving way to the next. */
const SLIDE_HOLD_MS = 6500;

@Component({
  selector: 'app-home',
  imports: [RouterLink, NzIconModule, RevealDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  private readonly doc = inject(DOCUMENT);

  readonly brand = BRAND;
  readonly slides = HERO_SLIDES;
  readonly chapters = HOME_CHAPTERS;
  readonly stages = HOME_STAGES;
  readonly values = HOME_VALUES;

  /* ----------------------------------------------------------- the hero -- */

  readonly slide = signal(0);

  /* --------------------------------------------- design · build · manage -- */

  readonly stage = signal(0);
  private readonly stagesEl = viewChild<ElementRef<HTMLElement>>('stagesEl');

  constructor() {
    /**
     * The hero advances itself, slowly, and stops entirely for anyone who has
     * asked for less motion — at which point it is simply the first frame.
     * A tab in the background gets no timer at all: coming back to a carousel
     * that has run on without you is the thing that makes one feel like an
     * advertisement.
     */
    effect((onCleanup) => {
      const view = this.doc.defaultView;
      if (!view || this.slides.length < 2) return;
      if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      let timer = 0;
      const tick = () => this.slide.update((i) => (i + 1) % this.slides.length);
      const start = () => { stop(); timer = view.setInterval(tick, SLIDE_HOLD_MS); };
      const stop = () => { if (timer) view.clearInterval(timer); timer = 0; };
      const onVisibility = () => (this.doc.hidden ? stop() : start());
      // Coming back to the page from the browser's cache restores the DOM but
      // not the timer we cleared on the way out, which left the hero frozen
      // on whichever frame it was showing.
      const onShow = (e: PageTransitionEvent) => { if (e.persisted) start(); };

      start();
      this.doc.addEventListener('visibilitychange', onVisibility);
      view.addEventListener('pageshow', onShow);
      onCleanup(() => {
        stop();
        this.doc.removeEventListener('visibilitychange', onVisibility);
        view.removeEventListener('pageshow', onShow);
      });
    });

    /**
     * Which word is lit comes from how far through the section you have
     * scrolled, not from markers crossing a line.
     *
     * Markers only report the moment they enter, which leaves the wrong word
     * lit when you scroll back up or jump down the page — the state depends
     * on which crossing happened last rather than on where you actually are.
     * Position is the thing being described, so position is what it reads.
     *
     * The handler is attached only while the section is on screen, and runs
     * at most once a frame.
     */
    effect((onCleanup) => {
      const el = this.stagesEl()?.nativeElement;
      const view = this.doc.defaultView;
      if (!el || !view) return;

      let frame = 0;
      const measure = () => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const travel = r.height - view.innerHeight;
        if (travel <= 0) return this.stage.set(0);
        const progress = Math.min(1, Math.max(0, -r.top / travel));
        this.stage.set(Math.min(this.stages.length - 1, Math.floor(progress * this.stages.length)));
      };
      const onScroll = () => { frame ||= view.requestAnimationFrame(measure); };

      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          view.addEventListener('scroll', onScroll, { passive: true });
          measure();
        } else {
          view.removeEventListener('scroll', onScroll);
        }
      });
      io.observe(el);

      onCleanup(() => {
        io.disconnect();
        view.removeEventListener('scroll', onScroll);
        if (frame) view.cancelAnimationFrame(frame);
      });
    });
  }

  showSlide(index: number): void {
    this.slide.set(index);
  }
}
