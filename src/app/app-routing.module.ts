import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office/back-office.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./front-office/front-office-routing.module').then(module => module.FrontOfficeRoutingModule)
  },
  {
    path: "login",
    loadChildren: () => import('./auth/auth-routing.module').then(module => module.AuthRoutingModule)
  },
  {
    path: "Administration",
    component: BackOfficeComponent,
    data: {
      breadcrumb: 'Administration',
    },
    loadChildren: () => import('./back-office/back-office-routing.module').then(module => module.BackOfficeRoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
