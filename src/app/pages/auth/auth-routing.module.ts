import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full',
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./login/login.module')
      .then(m => m.LoginModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./register/register.module')
      .then(m => m.RegisterModule),
  },
  {
    path: 'recuperar-contraseña',
    loadChildren: () => import('./forgot/forgot.module')
      .then(m => m.ForgotModule),
  },
  {
    path: 'crear-contraseña',
    loadChildren: () => import('./new-password/new-password.module')
      .then(m => m.NewPasswordModule),
  },
  {
    path: '**',
    redirectTo: 'iniciar-sesion',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild( routes ),
  ],
})
export class AuthRoutingModule { }
