import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'basic',
  },
  {
    path: 'basic',
    loadComponent: () => import('./basic-smart-dumb-example'),
  },
  {
    path: 'infinite-scrolling',
    loadComponent: () => import('./infinite-scroll-example'),
  },
  {
    path: 'multi-source',
    loadComponent: () => import('./multiple-data-sources'),
  },
];
