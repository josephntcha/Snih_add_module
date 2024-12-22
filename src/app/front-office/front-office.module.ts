import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { TakeAppointmentComponent } from './take-appointment/take-appointment.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { PatientConnexionComponent } from './patient-connexion/patient-connexion.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { KnownDoctorComponent } from './known-doctor/known-doctor.component';
import { PatientMedicalRecordComponent } from './patient-medical-record/patient-medical-record.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { MedecinModule } from '../back-office/medecin/medecin.module';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    TakeAppointmentComponent,
    PatientConnexionComponent,
    PatientDashboardComponent,
    KnownDoctorComponent,
    PatientMedicalRecordComponent,
    LandingPageComponent,
  ],
  imports: [
    NgClass,
    CommonModule,
    FrontOfficeRoutingModule,
    NzButtonModule,
    NzDropDownModule,
    NzCardModule,
    NzImageModule,
    NzDividerModule,
    NzSelectModule,
    NzFormModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
    NzModalModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    NzCarouselModule,
    NzIconModule,
    MedecinModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontOfficeModule { }
