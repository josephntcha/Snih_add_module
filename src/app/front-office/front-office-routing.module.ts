import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakeAppointmentComponent } from './components/take-appointment/take-appointment.component';
import { PatientConnexionComponent } from './components/patient-connexion/patient-connexion.component';
import { KnownDoctorComponent } from './components/known-doctor/known-doctor.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';

const routes: Routes = [
    {
      path: "rdv",
      component: TakeAppointmentComponent,
      
    },
    {
      path: "patient-connexion",
      component: PatientConnexionComponent,
      
    },
    {
      path: "je_connais_mon_medecin",
      component: KnownDoctorComponent,
    },
    {
      path: "patient-dashboard",
      component: PatientDashboardComponent,
    },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
