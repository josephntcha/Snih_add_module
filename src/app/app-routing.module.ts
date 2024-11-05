import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './core/auth/components/landing-page/landing-page.component';
import { LoginComponent } from './core/auth/components/login/login.component';

const routes: Routes = [
  {path: "", component: LandingPageComponent},

  // {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
