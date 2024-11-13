import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NewPersonalComponent } from './new-personal/new-personal.component';
import { RolesComponent } from './roles/roles.component';
import { UpdateUsersComponent } from './update-users/update-users.component';
import { SecretaryComponent } from './secretary/secretary.component';
import { AppointmentsDoctorComponent } from './appointments-doctor/appointments-doctor.component';


const routes: Routes = [
  {
    path: "Administration", 
    component: BackOfficeComponent,
    data: {
      breadcrumb: "Administration"
    },
      children: [
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
        path: "staff-dashboard",
        component: SecretaryComponent,
        data: {
          breadcrumb: 'Sécretariat',
          title: 'Docteurs | Rendez-vous'
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
