import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { Route, RouterModule } from '@angular/router';
import { LayoutModule } from '../shared/components/layout/layout.module';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Route[] = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module')
          .then(x => x.HomeModule),
      },
      {
        path: 'inicio',
        loadChildren: () => import('./home/home.module')
          .then(x => x.HomeModule),
      },
      { 
        path: 'panel',
        loadChildren: () => import('./dashboard/dashboard.module')
          .then(x => x.DashboardModule ),
        canActivate: [AuthGuard]
      },
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module')
          .then(x => x.AuthModule),
      },
      {
        path: '**',
        redirectTo: ''
      },
    ]
  }
];

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild( routes ),
  ]
})
export class PagesModule { }
