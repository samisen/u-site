import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  NavigationError,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
} from '@angular/router';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { I18nService, LocalisedTitleStrategy } from './core/i18n';

import {
  ApartmentOutline, ArrowLeftOutline, ArrowRightOutline, AuditOutline, BankOutline,
  BulbOutline, CalendarOutline, CameraOutline, CheckCircleFill, CheckOutline,
  ClockCircleOutline, CloseOutline, ColumnHeightOutline, CompassOutline, CompressOutline, CrownOutline,
  DeploymentUnitOutline, DollarOutline, DownOutline, EnvironmentOutline, ExpandOutline,
  ExperimentOutline, FileProtectOutline, FilterOutline, FundOutline, GlobalOutline,
  GoldOutline, HomeOutline, InstagramOutline, KeyOutline, LeftOutline, LineChartOutline,
  LinkedinOutline, MailOutline, MenuOutline, MessageOutline, PercentageOutline,
  MinusOutline, PhoneOutline, PictureOutline, PlayCircleOutline, PlusOutline, SendOutline, WarningOutline, RightOutline, RiseOutline, SafetyCertificateOutline,
  ScheduleOutline, SearchOutline, ShopOutline, SolutionOutline, StarFill, SwapOutline,
  TeamOutline, ThunderboltOutline, ToolOutline, UpOutline, WhatsAppOutline,
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';

/**
 * A page of this site is a lazily loaded chunk, and a chunk that will not
 * load is almost always a stale bundle rather than a broken one: the deploy
 * replaced the files this copy of the app is asking for, and the browser is
 * still holding the old index. The router's answer to a failed import is to
 * abandon the navigation silently — which, from the other side of the
 * screen, is a link that does nothing and a page that never arrives.
 *
 * Reloading at the requested URL fetches the current build and lands where
 * the visitor was going. The attempt is recorded so a chunk that is genuinely
 * missing cannot put the tab in a reload loop; app.ts clears the record once
 * a navigation succeeds.
 */
export const STALE_BUNDLE_KEY = 'apex-reload:';

function recoverFromStaleBundle(e: NavigationError): void {
  const text = String((e.error as Error | undefined)?.message ?? e.error ?? '');
  // Chrome, Firefox and Safari each word this differently
  const isImportFailure =
    /dynamically imported module|Loading chunk|ChunkLoadError|Importing a module script failed|error loading dynamically imported/i.test(
      text,
    );
  if (!isImportFailure || typeof window === 'undefined') return;

  const key = STALE_BUNDLE_KEY + e.url;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // private browsing: one attempt without a guard is still better than none
  }
  window.location.assign(e.url);
}

const icons = [
  ApartmentOutline, ArrowLeftOutline, ArrowRightOutline, AuditOutline, BankOutline,
  BulbOutline, CalendarOutline, CameraOutline, CheckCircleFill, CheckOutline,
  ClockCircleOutline, CloseOutline, ColumnHeightOutline, CompassOutline, CompressOutline, CrownOutline,
  DeploymentUnitOutline, DollarOutline, DownOutline, EnvironmentOutline, ExpandOutline,
  ExperimentOutline, FileProtectOutline, FilterOutline, FundOutline, GlobalOutline,
  GoldOutline, HomeOutline, InstagramOutline, KeyOutline, LeftOutline, LineChartOutline,
  LinkedinOutline, MailOutline, MenuOutline, MessageOutline, PercentageOutline,
  MinusOutline, PhoneOutline, PictureOutline, PlayCircleOutline, PlusOutline, SendOutline, WarningOutline, RightOutline, RiseOutline, SafetyCertificateOutline,
  ScheduleOutline, SearchOutline, ShopOutline, SolutionOutline, StarFill, SwapOutline,
  TeamOutline, ThunderboltOutline, ToolOutline, UpOutline, WhatsAppOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // 'enabled' rather than 'top': going back should put you where you
      // were, not at the top of a page you have already read.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
      withNavigationErrorHandler(recoverFromStaleBundle),
    ),
    provideNzI18n(en_US),
    provideNzIcons(icons),
    { provide: TitleStrategy, useClass: LocalisedTitleStrategy },
    // the copy has to be in hand before the first view renders, otherwise the
    // visitor sees a frame of translation keys
    provideAppInitializer(() => inject(I18nService).init()),
  ],
};
