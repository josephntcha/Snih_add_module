import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalRecordComponent } from './components/medical-record/medical-record.component';
import { BackOfficeComponent } from '../back-office.component';
import { InfoMedicalRecordComponent } from './components/info-medical-record/info-medical-record.component';

const routes: Routes = [
  {
    path: "Administration",
    component: BackOfficeComponent,
    data: {
      breadcrumb: "Administration"
    },
    children: [
      {
        path: "medical-records",
        component: MedicalRecordComponent,
        data: {
          breadcrumb: 'dossier médical',
          title: 'Dossier médical | Gestion des dossiers médicaux'
        }
      },
      {
        path: "info-medical-records",
        component: InfoMedicalRecordComponent,
        data: {
          breadcrumb: 'dossier médical',
          title: 'Dossier médical | Remplissage du dossier médical'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRecordRoutingModule { }
