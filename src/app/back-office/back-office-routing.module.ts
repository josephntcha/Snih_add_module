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
import { AppointmentsDoctorComponent } from './administration/appointments-doctor/appointments-doctor.component';
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
  // {
  //   path: "Administration", 
  //   component: BackOfficeComponent,
  //   data: {
  //     breadcrumb: "Administration"
  //   },
  //     children: [
      {
        path: "hospitals", 
        component: HospitalsComponent, 
        data: {
          breadcrumb: 'hôpitaux',
          title: 'Hôpitaux | Gestion des hôpitaux'
        }
      },
      {
        path: "specialities",
        component: SpecialitiesComponent,
        data: {
          breadcrumb: 'spécialités',
          title: 'Spécialités | Gestion des spécialités'
        }
      },
      {
        path: "roles", 
        component: RolesComponent,
        data: {
          breadcrumb: 'roles',
          title: 'Rôles | Gestion des rôles ou privilèges'
        }
      },
      {
        path: "new-personal", 
        component: NewPersonalComponent,
        data: {
          breadcrumb: 'new-personal',
          title: 'Personnel | Gestion du personnel de l\'hôpital'
        }
      },
      {
        path: "admin-dashboard", 
        component: AdminDashboardComponent,
        data: {
          breadcrumb: 'Tableau de bard',
          title: 'Administrateur | Tableau de bard'
        }
      },
      {
        path: "super-admin-dashboard", 
        component: SuperAdminDashboardComponent,
        data: {
          breadcrumb: 'tableau de bard',
          title: 'Super-administrateur | Tableau de bard'
        }
      },
      {
        path:"users",
        component: UsersComponent,
        data: {
          breadcrumb: 'utilisateurs',
          title: 'Utilisateurs | Gestion des utilisateurs'
        }
      },
      {
        path: "users/:userId",
        component: UpdateUsersComponent,
        data: {
          breadcrumb: 'Utilistateurs',
          title: 'Utilistateurs | Mise à jour de compte utilistateur'
        }
      },
      {
        path: "buildings",
        component: BuildingsComponent,
        data: {
          breadcrumb: 'disponibilités',
          title: 'Disponibilités | Liste des disponibilités'
        }
      },
      {
        path: "buildings/:buildingId/rooms",
        component: RoomsComponent,
        data: {
          breadcrumb: 'salles',
          title: 'Salles | Gestion des salles des bâtiments'
        }
      },
      {
        path: "settings",
        component: SettingsComponent,
        data: {
          breadcrumb: 'paramètres',
          title: 'Paramètres | Paramétrage de la plateforme'
        }
      },
      {
        path: "appointmentsDoctors/:hospitalId/:doctorId",
        component: AppointmentsDoctorComponent,
        data: {
          breadcrumb: 'Autorisations',
          title: 'Docteurs | Rendez-vous'
        }
      },
    // ]
  // }
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
