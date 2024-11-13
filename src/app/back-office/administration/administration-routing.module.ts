import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretaryComponent } from './secretary/secretary.component';

const routes: Routes = [
  {
    path: "staff-dashboard",
    component: SecretaryComponent,
    data: {
      breadcrumb: 'Sécretariat',
      title: 'Docteurs | Rendez-vous'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
