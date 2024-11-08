import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakeAppointmentComponent } from './components/take-appointment/take-appointment.component';
import { PatientConnexionComponent } from './components/patient-connexion/patient-connexion.component';

const routes: Routes = [
    {
      path: "rdv",
      component: TakeAppointmentComponent,
      
    },
    {
      path: "patient-connexion",
      component: PatientConnexionComponent,
      
    },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
