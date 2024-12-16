import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PermissionsComponent } from './permissions/permissions.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NewPersonalComponent } from './new-personal/new-personal.component';
import { UpdateUsersComponent } from './update-users/update-users.component';


@NgModule({
  declarations: [
    PermissionsComponent,
    UsersComponent,
    RolesComponent,
    SuperAdminDashboardComponent,
    AdminDashboardComponent,
    NewPersonalComponent,
    UpdateUsersComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
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
    NzTransferModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ]
})
export class AdministrationModule { }
