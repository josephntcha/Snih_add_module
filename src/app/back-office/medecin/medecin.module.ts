import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { MedecinRoutingModule } from './medecin-routing.module';

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
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AvailabilityComponent } from './availability/availability.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateAvailabilityComponent } from './create-availability/create-availability.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { MedicalRecordAnalyseResultsModalComponent } from './medical-record-analyse-results-modal/medical-record-analyse-results-modal.component';
import { MedicalRecordConstantsModalComponent } from './medical-record-constants-modal/medical-record-constants-modal.component';
import { InfoMedicalRecordComponent } from './info-medical-record/info-medical-record.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';


@NgModule({
  declarations: [
    CalendarComponent,
    AppointmentsListComponent,
    AvailabilityComponent,
    CreateAvailabilityComponent,
    MedicalRecordComponent,
    MedicalRecordAnalyseResultsModalComponent,
    MedicalRecordConstantsModalComponent,
    InfoMedicalRecordComponent
  ],
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    CommonModule,
    MedecinRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzInputModule,
    NzDropDownModule,
    NzTagModule,
    NzSwitchModule,
    NzCardModule,
    NzPaginationModule,
    NzAvatarModule,
    NzImageModule,
    NzDividerModule,
    NzBadgeModule,
    NzSelectModule,
    NzToolTipModule,
    NzModalModule,
    NzFormModule,
    NzSpaceModule
  ]
})
export class MedecinModule {}
