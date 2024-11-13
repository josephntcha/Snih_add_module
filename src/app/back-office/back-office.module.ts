import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { HospitalsComponent } from './administration/hospitals/hospitals.component';
import { SpecialitiesComponent } from './administration/specialities/specialities.component';
import { RoomsComponent } from './administration/rooms/rooms.component';
import { BuildingsComponent } from './administration/buildings/buildings.component';
import { SettingsComponent } from './settings/settings.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsersComponent } from './administration/users/users.component';
import { RolesComponent } from './administration/roles/roles.component';
import { SuperAdminDashboardComponent } from './administration/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './administration/admin-dashboard/admin-dashboard.component';
import { NewPersonalComponent } from './administration/new-personal/new-personal.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UpdateUsersComponent } from './administration/update-users/update-users.component';
import { AppointmentsDoctorComponent } from './appointments-doctor/appointments-doctor.component';
import { SecretaryComponent } from './secretary/secretary.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    HospitalsComponent,
    SpecialitiesComponent,
    RoomsComponent,
    BuildingsComponent,
    SettingsComponent,
    UsersComponent,
    RolesComponent,
    SuperAdminDashboardComponent,
    AdminDashboardComponent,
    NewPersonalComponent,
    UpdateUsersComponent,
    SecretaryComponent,
    AppointmentsDoctorComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzSwitchModule,
    NzCardModule,
    NzAvatarModule,
    NzImageModule,
    NzDividerModule,
    NzBadgeModule,
    NzSelectModule,
    NzToolTipModule,
    NzFormModule,
    NzTableModule,
    NzInputModule,
    NzTagModule,
    NzPaginationModule,
    NzModalModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule
  ]
})
export class BackOfficeModule { }
