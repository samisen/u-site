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
import { CatalogService } from '../../core/catalog.service';
import { usd } from '../../core/format';
import { AreaId } from '../../core/models';
import {
  DEFAULT_CONFIG,
  DEFAULT_ROOMS,
  EXTRAS,
  ExtraId,
  FINISHES,
  FinishLevel,
  FloorPlan,
  LEASE_TERM_YEARS,
  PLAN_METRICS,
  POOLS,
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
  readonly roomKeys = Object.keys(ROOM_LIMITS) as (keyof RoomSizes)[];

  readonly config = signal<VillaConfig>({
    ...DEFAULT_CONFIG,
    extras: [...DEFAULT_CONFIG.extras],
    rooms: { ...DEFAULT_ROOMS },
  });

  readonly area = computed(() => this.catalog.areaById(this.config().area)!);
  readonly study = computed(() => buildStudy(this.config(), this.area()));

  /** Simple keeps it to seven decisions; advanced opens room areas, style and options. */
  readonly mode = signal<'simple' | 'advanced'>('simple');
  readonly modeOptions: NzSegmentedOption[] = [
    { label: 'Simple', value: 'simple' },
    { label: 'Advanced', value: 'advanced' },
  ];
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

  readonly storeyOptions: NzSegmentedOption[] = [
    { label: 'One storey', value: 1 },
    { label: 'Two storeys', value: 2 },
  ];

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
  setPool(pool: PoolType): void { this.patch({ pool }); }
  setArea(area: AreaId): void { this.patch({ area }); }
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
    this.study().plans.map((p, i) => ({ label: p.name, value: i })),
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
  showLabel(room: PlanRoom): boolean { return room.w >= 1.9 && room.h >= 1.5; }
  showArea(room: PlanRoom): boolean { return room.w >= 2.6 && room.h >= 2.4; }

  /** What the drawn plan actually gives a room, which can differ from the slider. */
  actualRoomArea(key: keyof RoomSizes): number {
    const rooms = this.study().plans.flatMap((p) => p.rooms);
    const match: Record<keyof RoomSizes, (r: PlanRoom) => boolean> = {
      master: (r) => r.label === 'Master bedroom',
      bedroom: (r) => r.kind === 'bed' && r.label !== 'Master bedroom',
      ensuite: (r) => r.kind === 'bath' && r.label !== 'Ensuite',
      living: (r) => r.label === 'Living',
      kitchen: (r) => r.label === 'Kitchen & dining',
    };
    const found = rooms.find(match[key]);
    return found ? Math.round(found.w * found.h * 10) / 10 : 0;
  }

  /* -------------------------------------------------------------- format -- */

  money(v: number, compact = false): string { return usd(v, { compact }); }
  styleName(): string { return STYLES.find((s) => s.id === this.config().style)!.name; }
  finishName(): string { return FINISHES.find((f) => f.id === this.config().finish)!.name; }
  poolName(): string { return POOLS.find((p) => p.id === this.config().pool)!.name; }
  extraNames(): string {
    const chosen = this.config().extras;
    if (!chosen.length) return 'None';
    return EXTRAS.filter((e) => chosen.includes(e.id)).map((e) => e.name).join(', ');
  }

  /** One-line brief, used by both the form and the WhatsApp hand-off. */
  readonly summaryText = computed(() => {
    const c = this.config();
    const s = this.study();
    return [
      `${c.bedrooms}-bedroom ${this.styleName().toLowerCase()} villa, ${c.storeys} storey${c.storeys > 1 ? 's' : ''}`,
      `${s.builtSqm} m² built on a ${c.landSqm} m² plot in ${this.area().name}`,
      `${this.poolName()} pool · ${this.finishName()} finish`,
      `Options: ${this.extraNames()}`,
      `Estimated total ${this.money(s.total)} · indicative gross yield ${s.grossYield.toFixed(1)}%`,
    ].join('\n');
  });

  readonly whatsappHref = computed(
    () =>
      `https://wa.me/6281200000000?text=${encodeURIComponent(
        `Hello ${BRAND.name}, here is the villa I configured:\n\n${this.summaryText()}`,
      )}`,
  );

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
      this.message.error('A name and a valid email is all we need.');
      return;
    }
    this.sending.set(true);
    // Demo only — this is where the configuration and the lead are posted.
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
      this.message.success('Sent. A project lead will reply within one working day.');
    }, 800);
  }

  closeSend(): void {
    this.sendOpen.set(false);
  }
}
