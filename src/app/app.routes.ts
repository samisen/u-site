import { Routes } from '@angular/router';
import { BRAND } from './core/brand';

const t = (page: string) => `${page} — ${BRAND.name}`;

/**
 * The funnel: why the island, then why the numbers, then what is open, then
 * design one. Every page ends in the same two actions — write to us, or message
 * us on WhatsApp.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: `${BRAND.name} — ${BRAND.descriptor}`,
  },
  {
    path: 'why-bali',
    loadComponent: () => import('./pages/why-bali/why-bali').then((m) => m.WhyBaliPage),
    title: t('Why Bali'),
  },
  {
    path: 'opportunity',
    loadComponent: () => import('./pages/opportunity/opportunity').then((m) => m.OpportunityPage),
    title: t('The Opportunity'),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.ProjectsPage),
    title: t('Projects'),
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/projects/project-detail').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'design-your-villa',
    loadComponent: () => import('./pages/design/design').then((m) => m.DesignPage),
    title: t('Design Your Villa'),
  },
  {
    path: 'how-we-build',
    loadComponent: () => import('./pages/process/process').then((m) => m.ProcessPage),
    title: t('How We Build'),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
    title: t('Contact'),
  },

  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights').then((m) => m.InsightsPage),
    title: t('Insights'),
  },
  {
    path: 'insights/:slug',
    loadComponent: () => import('./pages/insights/insight-detail').then((m) => m.InsightDetailPage),
  },

  // pages folded into the ones above
  { path: 'areas', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'about', redirectTo: 'how-we-build', pathMatch: 'full' },
  { path: 'operations', redirectTo: 'how-we-build', pathMatch: 'full' },
  { path: 'management', redirectTo: 'how-we-build', pathMatch: 'full' },
  { path: 'how-it-works', redirectTo: 'how-we-build', pathMatch: 'full' },

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: t('Page not found'),
  },
];
