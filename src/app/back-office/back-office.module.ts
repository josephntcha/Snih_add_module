import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { HospitalsComponent } from './components/hospitals/hospitals.component';
import { SpecialitiesComponent } from './components/specialities/specialities.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BuildingsComponent } from './components/buildings/buildings.component';
import { SettingsComponent } from './components/settings/settings.component';
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
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';


@NgModule({
  declarations: [
    BackOfficeComponent,
    HospitalsComponent,
    SpecialitiesComponent,
    RoomsComponent,
    BuildingsComponent,
    SettingsComponent
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
    FormsModule,
    RouterLink,
    RouterOutlet
  ]
})
export class BackOfficeModule { }
