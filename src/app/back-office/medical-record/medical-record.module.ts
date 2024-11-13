import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalRecordRoutingModule } from './medical-record-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { MedicalRecordConstantsModalComponent } from './medical-record-constants-modal/medical-record-constants-modal.component';
import { MedicalRecordAnalyseResultsModalComponent } from './medical-record-analyse-results-modal/medical-record-analyse-results-modal.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { InfoMedicalRecordComponent } from './info-medical-record/info-medical-record.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';


@NgModule({
  declarations: [
    MedicalRecordComponent,
    InfoMedicalRecordComponent,
    MedicalRecordConstantsModalComponent,
    MedicalRecordAnalyseResultsModalComponent
  ],
  imports: [
    CommonModule,
    MedicalRecordRoutingModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzSwitchModule,
    NzCardModule,
    NzSelectModule,
    NzFormModule,
    NzTableModule,
    NzInputModule,
    NzTagModule,
    NzPaginationModule,
    NzModalModule,
    NzDividerModule,
    NzSpaceModule,
    NzUploadModule,
    FormsModule,
    RouterLink,
  ]
})
export class MedicalRecordModule { }
