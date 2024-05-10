import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./routes/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./routes/documentation/documentation.component').then(m => m.DocumentationComponent)
      }
    ]
  },
];
