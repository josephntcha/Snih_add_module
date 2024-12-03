import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { NewPersonalComponent } from './new-personal/new-personal.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { UsersComponent } from './users/users.component';
import { UpdateUsersComponent } from './update-users/update-users.component';
import { SecretaryComponent } from './secretary/secretary.component';
import { AppointmentsDoctorComponent } from './appointments-doctor/appointments-doctor.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
  {
    path: "roles", 
    component: RolesComponent,
    data: {
      breadcrumb: 'roles',
      title: 'Rôles | Gestion des rôles ou privilèges'
    }
  },{
    path: "roles", 
    component: RolesComponent,
    data: {
      breadcrumb: 'roles',
      title: 'Rôles | Gestion des rôles ou privilèges'
    }
  },
  {
    path: "permissions", 
    component: PermissionsComponent,
    data: {
      breadcrumb: 'permissions',
      title: 'Permissions | Gestion des permissions'
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
      breadcrumb: 'Tableau de bord',
      title: 'Administrateur | Tableau de bord'
    }
  },
  {
    path: "super-admin-dashboard", 
    component: SuperAdminDashboardComponent,
    data: {
      breadcrumb: 'tableau de bord',
      title: 'Super-administrateur | Tableau de bord'
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
    path: "secretaire-dashboard",
    component: SecretaryComponent,
    data: {
      breadcrumb: 'Sécretariat',
      title: 'Docteurs | Rendez-vous'
    }
  },
  {
    path: "doctor-appointments/:hospitalId/:doctorId",
    component: AppointmentsDoctorComponent,
    data: {
      breadcrumb: 'liste des RDV',
      title: 'Docteurs | Rendez-vous'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
