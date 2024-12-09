import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakeAppointmentComponent } from './take-appointment/take-appointment.component';
import { PatientConnexionComponent } from './patient-connexion/patient-connexion.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { KnownDoctorComponent } from './known-doctor/known-doctor.component';
import { PatientMedicalRecordComponent } from './patient-medical-record/patient-medical-record.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent
  },
  {
    path: "prendre-rdv",
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
  {
    path: "patient-medical-record",
    component: PatientMedicalRecordComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
