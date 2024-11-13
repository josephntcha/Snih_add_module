import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office/back-office.component';

const routes: Routes = [
  {
    path: "",
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
