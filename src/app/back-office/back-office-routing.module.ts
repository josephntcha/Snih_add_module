import { NgModule } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
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
  {
    path: "medecin-dashboard",
    data: {
      breadcrumb: 'Medecin',
    },
    loadChildren: () => import('./medecin/medecin-routing.module').then(module => module.MedecinRoutingModule)
  },
  {
    path: "settings",
    data: {
      breadcrumb: 'settings',
    },
    loadChildren: () => import('./settings/settings-routing.module').then(module => module.SettingsRoutingModule)
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
