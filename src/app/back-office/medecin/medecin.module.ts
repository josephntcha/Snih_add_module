import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { MedecinRoutingModule } from './medecin-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { CreateAvailabilityComponent } from './components/create-availability/create-availability.component';

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


@NgModule({
  declarations: [
    CalendarComponent,
    AppointmentsListComponent,
    AvailabilityComponent,
    CreateAvailabilityComponent
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
  ]
})
export class MedecinModule {}
