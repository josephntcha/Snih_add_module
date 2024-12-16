import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office/back-office.component';
import { authGuard } from './auth/auth.guard';

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
    path: "back-office",
    canActivate: [authGuard],
    component: BackOfficeComponent,
    data: {
      breadcrumb: 'back-office',
    },
    loadChildren: () => import('./back-office/back-office-routing.module').then(module => module.BackOfficeRoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
