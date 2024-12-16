import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { TakeAppointmentComponent } from './take-appointment/take-appointment.component';


import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { PatientConnexionComponent } from './patient-connexion/patient-connexion.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { KnownDoctorComponent } from './known-doctor/known-doctor.component';
import { PatientMedicalRecordComponent } from './patient-medical-record/patient-medical-record.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';


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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontOfficeModule { }
