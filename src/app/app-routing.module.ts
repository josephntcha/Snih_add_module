import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./auth/auth-routing.module').then(module => module.AuthRoutingModule)
  },
  {
    path: "Administration",
    loadChildren: () => import('./back-office/back-office-routing.module').then(module => module.BackOfficeRoutingModule)
  },

  // {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
