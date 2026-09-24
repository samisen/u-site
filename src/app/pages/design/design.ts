import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSegmentedModule, NzSegmentedOption } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { BRAND, YIELD_CLAIM } from '../../core/brand';
import { I18nService, TranslatePipe, TranslateParams } from '../../core/i18n';
import { WhatsappService } from '../../core/whatsapp.service';
import { CatalogService } from '../../core/catalog.service';
import { usd } from '../../core/format';
import { AreaId } from '../../core/models';
import {
  DEFAULT_CONFIG,
  DEFAULT_ROOMS,
  EXTRAS,
  fitRoomsToPlot,
  largestPoolThatFits,
  poolFitsPlot,
  ExtraId,
  FINISHES,
  FinishLevel,
  FloorPlan,
  LEASE_TERM_YEARS,
  PLAN_METRICS,
  POOLS,
  PLAN_LABELS,
  PRESETS,
  PlanRoom,
  PoolType,
  ROOM_LIMITS,
  RoomSizes,
  STYLES,
  VillaConfig,
  VillaStyle,
  buildStudy,
} from '../../core/villa-config';

interface Dimension {
  axis: 'h' | 'v';
  from: number;
  to: number;
  at: number;
  text: string;
}

interface Door {
  x: number;
  y: number;
  size: number;
  /** which way the leaf opens */
  flip: boolean;
}

@Component({
  selector: 'app-design',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NzButtonModule,
    NzDrawerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzSegmentedModule,
    NzSelectModule,
    NzSliderModule,
    NzTooltipModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design.html',
  styleUrl: './design.css',
})
export class DesignPage {
  private readonly catalog = inject(CatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly whatsapp = inject(WhatsappService);
  private readonly editorEl = viewChild<ElementRef<HTMLElement>>('editorEl');

  readonly brand = BRAND;
  readonly claim = YIELD_CLAIM;
  readonly leaseYears = LEASE_TERM_YEARS;

  readonly areas = this.catalog.areas;
  readonly styles = STYLES;
  readonly finishes = FINISHES;
  readonly pools = POOLS;
  readonly extraOptions = EXTRAS;
  readonly presets = PRESETS;
  readonly roomLimits = ROOM_LIMITS;
  private readonly allRoomKeys = Object.keys(ROOM_LIMITS) as (keyof RoomSizes)[];

  /** Only the sliders that actually change this configuration's drawing. */
  readonly roomKeys = computed<(keyof RoomSizes)[]>(() => {
    const c = this.config();
    return this.allRoomKeys.filter((k) => !(k === 'bedroom' && c.bedrooms < 2));
  });

  readonly config = signal<VillaConfig>({
    ...DEFAULT_CONFIG,
    extras: [...DEFAULT_CONFIG.extras],
    rooms: { ...DEFAULT_ROOMS },
  });

  readonly area = computed(() => this.catalog.areaById(this.config().area)!);
  readonly study = computed(() => buildStudy(this.config(), this.area()));

  /** Simple keeps it to seven decisions; advanced opens room areas, style and options. */
  readonly mode = signal<'simple' | 'advanced'>('simple');

  // nz-segmented takes finished labels, so these resolve through the service
  readonly modeOptions = computed<NzSegmentedOption[]>(() => [
    { label: this.i18n.t('design.mode.simple'), value: 'simple' },
    { label: this.i18n.t('design.mode.advanced'), value: 'advanced' },
  ]);
  readonly isAdvanced = computed(() => this.mode() === 'advanced');

  setMode(value: string | number): void {
    this.mode.set(value === 'advanced' ? 'advanced' : 'simple');
  }

  readonly floor = signal(0);
  readonly zoom = signal(1);
  readonly fullscreen = signal(false);
  readonly sendOpen = signal(false);
  readonly sent = signal(false);
  readonly sending = signal(false);

  constructor() {
    // keep the drawing sized to whatever space the canvas actually has
    effect((onCleanup) => {
      const el = this.scrollBox()?.nativeElement;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const measure = () => {
        const cs = getComputedStyle(el);
        this.boxSize.set({
          w: el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
          h: el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    });

    // leaving native fullscreen (Esc, or the browser chrome) drops the overlay
    effect((onCleanup) => {
      const view = this.doc.defaultView;
      if (!view) return;
      const sync = () => {
        if (!this.doc.fullscreenElement && this.fullscreen()) this.fullscreen.set(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.fullscreen()) this.fullscreen.set(false);
      };
      this.doc.addEventListener('fullscreenchange', sync);
      view.addEventListener('keydown', onKey);
      onCleanup(() => {
        this.doc.removeEventListener('fullscreenchange', sync);
        view.removeEventListener('keydown', onKey);
        this.exitNativeFullscreen();
      });
    });
  }

  readonly storeyOptions = computed<NzSegmentedOption[]>(() => [
    { label: this.i18n.t('design.storey.one'), value: 1 },
    { label: this.i18n.t('design.storey.two'), value: 2 },
  ]);

  readonly bedroomMarks: Record<number, string> = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };

  /* ------------------------------------------------------------- editing -- */

  patch(patch: Partial<VillaConfig>): void {
    this.config.update((c) => {
      const next = { ...c, ...patch };
      if (next.storeys === 1) next.extras = next.extras.filter((e) => e !== 'rooftop');
      return next;
    });
  }

  setRoom(key: keyof RoomSizes, value: number): void {
    this.config.update((c) => ({ ...c, rooms: { ...c.rooms, [key]: value } }));
  }

  applyPreset(id: string): void {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    this.config.update((c) => ({
      ...c,
      ...preset.patch,
      rooms: { ...(preset.patch.rooms ?? c.rooms) },
      extras: [...(preset.patch.extras ?? c.extras)],
    }));
  }

  setStyle(style: VillaStyle): void { this.patch({ style }); }
  setFinish(finish: FinishLevel): void { this.patch({ finish }); }
  setPool(pool: PoolType): void {
    if (this.poolDisabled(pool)) return;
    this.patch({ pool });
  }

  /** A pool that would overhang the facade or the plot cannot be chosen. */
  poolDisabled(pool: PoolType): boolean {
    return !poolFitsPlot(this.config(), pool);
  }

  poolNote(pool: PoolType): string | null {
    return this.poolDisabled(pool) ? this.i18n.t('design.poolTooBig') : null;
  }
  setArea(area: AreaId): void { this.patch({ area }); }

  /**
   * Simple mode gives no room-by-room control, so a plot that no longer fits
   * the house has to be resolved here — otherwise the only way out of the
   * coverage warning is to switch to Advanced.
   */
  setLand(landSqm: number): void {
    this.config.update((c) => {
      let next = { ...c, landSqm };
      if (!this.isAdvanced()) next = { ...next, rooms: fitRoomsToPlot(next) };
      // a pool the plot can no longer take would otherwise stay selected while
      // its own button is disabled, leaving the editor in a state you cannot fix
      if (!poolFitsPlot(next, next.pool)) next = { ...next, pool: largestPoolThatFits(next) };
      return next;
    });
  }

  /** Advanced keeps its numbers, but can hand them back to the plot in one click. */
  fitToPlot(): void {
    this.config.update((c) => ({ ...c, rooms: fitRoomsToPlot(c) }));
  }
  setStoreys(value: number | string): void { this.patch({ storeys: Number(value) === 2 ? 2 : 1 }); }

  toggleExtra(id: ExtraId): void {
    if (this.extraDisabled(id)) return;
    this.config.update((c) => ({
      ...c,
      extras: c.extras.includes(id) ? c.extras.filter((e) => e !== id) : [...c.extras, id],
    }));
  }

  hasExtra(id: ExtraId): boolean { return this.config().extras.includes(id); }
  extraDisabled(id: ExtraId): boolean { return id === 'rooftop' && this.config().storeys === 1; }

  reset(): void {
    this.config.set({ ...DEFAULT_CONFIG, extras: [...DEFAULT_CONFIG.extras], rooms: { ...DEFAULT_ROOMS } });
    this.floor.set(0);
    this.zoom.set(1);
    this.mode.set('simple');
  }

  /* ---------------------------------------------------------------- view -- */

  readonly floorOptions = computed<NzSegmentedOption[]>(() =>
    this.study().plans.map((p, i) => ({ label: this.i18n.t(p.name), value: i })),
  );

  /** The cost table, with every label and note already in the visitor's language. */
  readonly costLines = computed(() =>
    this.study().lines.map((line) => ({
      amount: line.amount,
      label: this.i18n.t(line.label),
      note: line.note
        ? this.i18n.t(line.note, {
            ...line.noteParams,
            ...(line.noteNameKey ? { name: this.i18n.t(line.noteNameKey) } : {}),
          })
        : '',
    })),
  );
  readonly visibleFloor = computed(() => Math.min(this.floor(), this.study().plans.length - 1));
  readonly visiblePlan = computed<FloorPlan>(() => this.study().plans[this.visibleFloor()]);
  readonly ghostRooms = computed<PlanRoom[]>(() =>
    this.visibleFloor() > 0 ? this.study().plans[0].rooms : [],
  );

  setFloor(index: number | string): void { this.floor.set(Number(index)); }

  /** Leaves the overlay and the page together, without stranding the browser
      in native fullscreen. */
  leaveEditor(): void {
    this.exitNativeFullscreen();
    this.fullscreen.set(false);
    void this.router.navigate(['/']);
  }

  private exitNativeFullscreen(): void {
    try {
      if (this.doc.fullscreenElement) void this.doc.exitFullscreen?.();
    } catch {
      /* nothing to undo */
    }
  }

  toggleFullscreen(): void {
    const next = !this.fullscreen();
    this.fullscreen.set(next);
    const host = this.editorEl()?.nativeElement;
    // the overlay is what actually does the work; real fullscreen is a bonus
    // and is blocked in some embedded contexts
    try {
      if (next) void host?.requestFullscreen?.();
      else this.exitNativeFullscreen();
    } catch {
      /* overlay still applies */
    }
  }
  zoomIn(): void { this.zoom.update((z) => Math.min(3, +(z + 0.25).toFixed(2))); }
  zoomOut(): void { this.zoom.update((z) => Math.max(0.5, +(z - 0.25).toFixed(2))); }
  zoomFit(): void { this.zoom.set(1); }

  /**
   * 100% fits the whole sheet inside the canvas — both axes, not just the
   * width, so a wide canvas does not blow the drawing up past its own height.
   * Zoom runs 50%–300% from there.
   */
  private readonly scrollBox = viewChild<ElementRef<HTMLElement>>('scrollBox');
  readonly boxSize = signal({ w: 0, h: 0 });

  readonly renderWidthPx = computed(() => {
    const box = this.boxSize();
    const sheet = this.sheet();
    if (!box.w || !box.h) return 0;
    const fit = Math.min(box.w, box.h * (sheet.w / sheet.h));
    return Math.round(fit * this.zoom());
  });

  /** Drawing sheet: the plan plus margins for dimensions and the title block. */
  readonly sheet = computed(() => {
    const plans = this.study().plans;
    const minX = Math.min(...plans.map((p) => p.minX)) - 5.5;
    const minY = Math.min(...plans.map((p) => p.minY)) - 4.5;
    const maxX = Math.max(...plans.map((p) => p.maxX)) + 2.5;
    const maxY = Math.max(...plans.map((p) => p.maxY)) + 9;
    return { minX, minY, w: maxX - minX, h: maxY - minY, viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}` };
  });

  /** Enclosed rooms only — the outline traced as the building's walls. */
  readonly buildingBox = computed(() => {
    const rooms = this.visiblePlan().rooms.filter((r) => r.counts && r.x >= 0);
    if (!rooms.length) return null;
    const x = Math.min(...rooms.map((r) => r.x));
    const y = Math.min(...rooms.map((r) => r.y));
    const x2 = Math.max(...rooms.map((r) => r.x + r.w));
    const y2 = Math.max(...rooms.map((r) => r.y + r.h));
    return { x, y, w: x2 - x, h: y2 - y };
  });

  readonly dimensions = computed<Dimension[]>(() => {
    const box = this.buildingBox();
    const plan = this.visiblePlan();
    if (!box) return [];
    const dims: Dimension[] = [
      { axis: 'h', from: box.x, to: box.x + box.w, at: box.y - 2.2, text: `${box.w.toFixed(2)} m` },
      { axis: 'v', from: box.y, to: box.y + box.h, at: box.x - 2.2, text: `${box.h.toFixed(2)} m` },
    ];
    if (plan.minX < box.x) {
      dims.push({ axis: 'h', from: plan.minX, to: plan.maxX, at: box.y - 4.4, text: `${(plan.maxX - plan.minX).toFixed(2)} m overall` });
    }
    return dims;
  });

  /** A door on the hall side of every bedroom, and one into every ensuite. */
  readonly doors = computed<Door[]>(() => {
    const out: Door[] = [];
    for (const room of this.visiblePlan().rooms) {
      if (room.kind === 'bed') {
        out.push({ x: room.x, y: room.y + 0.55, size: Math.min(0.9, room.h - 0.9), flip: false });
      }
      if (room.kind === 'bath') {
        out.push({ x: room.x, y: room.y + room.h - 0.55, size: Math.min(0.8, room.h - 0.9), flip: true });
      }
    }
    return out.filter((d) => d.size > 0.4);
  });

  readonly wall = PLAN_METRICS.wall;

  /** Scale bar: five metres, drawn under the plan. */
  readonly scaleBar = computed(() => {
    const s = this.sheet();
    return { x: s.minX + 1.5, y: s.minY + s.h - 3.6, len: 5 };
  });

  readonly titleBlock = computed(() => {
    const s = this.sheet();
    const w = Math.min(16, s.w - 3);
    return { x: s.minX + s.w - w - 1.2, y: s.minY + s.h - 6.4, w, h: 5.6 };
  });

  roomArea(room: PlanRoom): string { return `${(room.w * room.h).toFixed(1)} m²`; }

  /** The drawing's own name for a plan, for the title block and the label. */
  planName(name: string): string { return this.i18n.t(name); }
  showLabel(room: PlanRoom): boolean { return room.w >= 1.9 && room.h >= 1.5; }

  /**
   * Every room states its area — the pool and the living room included. The
   * descriptive line only appears when there is a third line's worth of room.
   */
  roomLines(room: PlanRoom): { text: string; cls: string; y: number }[] {
    const lines: { text: string; cls: string }[] = [
      { text: this.i18n.t(room.label, room.labelParams), cls: 'room-label' },
    ];
    if (room.w >= 2.2 && room.h >= 1.9) lines.push({ text: this.roomArea(room), cls: 'room-area' });
    const sub = room.sub ? this.i18n.t(room.sub) : room.subText;
    if (sub && room.w >= 3 && room.h >= 3.6) lines.push({ text: sub, cls: 'room-sub' });
    const top = -((lines.length - 1) * 0.82) / 2;
    return lines.map((l, i) => ({ ...l, y: top + i * 0.82 }));
  }

  /** What the drawn plan actually gives a room, which can differ from the slider. */
  actualRoomArea(key: keyof RoomSizes): number {
    const rooms = this.study().plans.flatMap((p) => p.rooms);
    const match: Record<keyof RoomSizes, (r: PlanRoom) => boolean> = {
      master: (r) => r.label === PLAN_LABELS.master,
      bedroom: (r) => r.kind === 'bed' && r.label !== PLAN_LABELS.master,
      ensuite: (r) => r.kind === 'bath' && r.label !== PLAN_LABELS.ensuite,
      living: (r) => r.label === PLAN_LABELS.living,
      kitchen: (r) => r.label === PLAN_LABELS.kitchen,
    };
    const found = rooms.find(match[key]);
    return found ? Math.round(found.w * found.h * 10) / 10 : 0;
  }

  /* -------------------------------------------------------------- format -- */

  money(v: number, compact = false): string { return usd(v, { compact }); }
  t(key: string, params?: TranslateParams): string { return this.i18n.t(key, params); }
  styleName(): string { return this.i18n.t(STYLES.find((s) => s.id === this.config().style)!.name); }
  finishName(): string { return this.i18n.t(FINISHES.find((f) => f.id === this.config().finish)!.name); }
  poolName(): string { return this.i18n.t(POOLS.find((p) => p.id === this.config().pool)!.name); }
  extraNames(): string {
    const chosen = this.config().extras;
    if (!chosen.length) return this.i18n.t('design.noOptions');
    return EXTRAS.filter((e) => chosen.includes(e.id))
      .map((e) => this.i18n.t(e.name))
      .join(', ');
  }

  /** One-line brief, used by both the form and the WhatsApp hand-off. */
  readonly summaryText = computed(() => {
    const c = this.config();
    const s = this.study();
    this.i18n.version();
    return [
      this.i18n.t('design.summary.line1', {
        bedrooms: c.bedrooms,
        style: this.styleName().toLowerCase(),
        storeys: c.storeys,
      }),
      this.i18n.t('design.summary.line2', {
        built: s.builtSqm,
        land: c.landSqm,
        area: this.i18n.t(this.area().name),
      }),
      this.i18n.t('design.summary.line3', { pool: this.poolName(), finish: this.finishName() }),
      this.i18n.t('design.summary.line4', { options: this.extraNames() }),
      this.i18n.t('design.summary.line5', {
        total: this.money(s.total),
        yield: s.grossYield.toFixed(1),
      }),
    ].join('\n');
  });

  readonly whatsappHref = computed(() => this.whatsapp.linkWith(this.summaryText()));

  /* ---------------------------------------------------------------- send -- */

  readonly sendForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    note: [''],
  });

  openSend(): void {
    this.sent.set(false);
    this.sendOpen.set(true);
  }

  submitSend(): void {
    if (this.sendForm.invalid) {
      Object.values(this.sendForm.controls).forEach((c) => {
        c.markAsDirty();
        c.updateValueAndValidity({ onlySelf: true });
      });
      this.message.error(this.i18n.t('design.send.error'));
      return;
    }
    this.sending.set(true);
    // Demo only — this is where the configuration and the lead are posted.
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
      this.message.success(this.i18n.t('design.send.success'));
    }, 800);
  }

  closeSend(): void {
    this.sendOpen.set(false);
  }
}
