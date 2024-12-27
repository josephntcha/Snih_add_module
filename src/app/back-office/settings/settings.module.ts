import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { RoomsComponent } from './rooms/rooms.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { ConstanteComponent } from './constant/constante.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { SettingsComponent } from './settings.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';


@NgModule({
  declarations: [
    HospitalsComponent,
    SpecialitiesComponent,
    RoomsComponent,
    BuildingsComponent,
    ConstanteComponent,
    AnalysisComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzRadioModule

  ]
})
export class SettingsModule { }
