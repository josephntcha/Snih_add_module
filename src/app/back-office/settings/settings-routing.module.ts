import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SettingsComponent } from './settings.component';
import { BuildingsComponent } from './buildings/buildings.component';

const routes: Routes = [
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
    path: "buildings",
    component: BuildingsComponent,
    data: {
      breadcrumb: 'bâtiments',
      title: 'Bâtiments | Liste des bâtiments'
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
