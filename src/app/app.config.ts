import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
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
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    provideNzI18n(en_US),
    provideNzIcons(icons),
    { provide: TitleStrategy, useClass: LocalisedTitleStrategy },
    // the copy has to be in hand before the first view renders, otherwise the
    // visitor sees a frame of translation keys
    provideAppInitializer(() => inject(I18nService).init()),
  ],
};
