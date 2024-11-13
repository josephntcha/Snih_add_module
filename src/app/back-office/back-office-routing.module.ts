import { NgModule } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { HospitalsComponent } from './administration/hospitals/hospitals.component';
import { SpecialitiesComponent } from './administration/specialities/specialities.component';
import { BuildingsComponent } from './administration/buildings/buildings.component';
import { RoomsComponent } from './administration/rooms/rooms.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './administration/users/users.component';
import { SuperAdminDashboardComponent } from './administration/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './administration/admin-dashboard/admin-dashboard.component';
import { NewPersonalComponent } from './administration/new-personal/new-personal.component';
import { RolesComponent } from './administration/roles/roles.component';
import { UpdateUsersComponent } from './administration/update-users/update-users.component';
import { SecretaryComponent } from './secretary/secretary.component';
import { AppointmentsDoctorComponent } from './appointments-doctor/appointments-doctor.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


const routes: Routes = [
  {
    path: "Administration",
    data: {
      breadcrumb: 'Administration',
    },
    loadChildren: () => import('./administration/administration-routing.module').then(module => module.AdministrationRoutingModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

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
  ],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
