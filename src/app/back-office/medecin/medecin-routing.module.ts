import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from '../back-office.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { CreateAvailabilityComponent } from './components/create-availability/create-availability.component';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';

const routes: Routes = [
  {
    path: "Administration", 
    component: BackOfficeComponent,
    data: {
      breadcrumb: "Administration"
    },
    children:[
      {
        path: "doctor-dashboard", 
        component: CalendarComponent,
        data: {
          breadcrumb: 'Tableau de bard',
          title: 'Médecin | CALENDRIER'
        }
      },
      {
        path: "availability", 
        component: AvailabilityComponent,
        data: {
          breadcrumb: 'Tableau de bard',
          title: 'Disponibilité | Tableau de bard'
        }
      },
      {
        path: "create-availability", 
        component: CreateAvailabilityComponent,
        data: {
          breadcrumb: 'Disponibilité',
          title: 'Créer disponibilité | Tableau de bard'
        }
      },
      {
        path: "list-appointment", 
        component: AppointmentsListComponent,
        data: {
          breadcrumb: 'Rendez-vous',
          title: 'liste des  RDV| Tableau de bard'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedecinRoutingModule { }
