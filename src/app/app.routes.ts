import { Routes } from '@angular/router';

/**
 * The funnel: why the island, then why the numbers, then what is open, then
 * design one. Every page ends in the same two actions — write to us, or message
 * us on WhatsApp.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'title.home',
  },
  {
    path: 'why-bali',
    loadComponent: () => import('./pages/why-bali/why-bali').then((m) => m.WhyBaliPage),
    title: 'title.whyBali',
  },
  {
    path: 'opportunity',
    loadComponent: () => import('./pages/opportunity/opportunity').then((m) => m.OpportunityPage),
    title: 'title.opportunity',
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.ProjectsPage),
    title: 'title.projects',
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/projects/project-detail').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'design-your-villa',
    loadComponent: () => import('./pages/design/design').then((m) => m.DesignPage),
    title: 'title.design',
  },
  {
    path: 'how-we-build',
    loadComponent: () => import('./pages/process/process').then((m) => m.ProcessPage),
    title: 'title.process',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
    title: 'title.contact',
  },

  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights').then((m) => m.InsightsPage),
    title: 'title.insights',
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
    title: 'title.notFound',
  },
];
