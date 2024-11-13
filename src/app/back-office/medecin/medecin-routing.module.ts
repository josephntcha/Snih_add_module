import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from '../back-office.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AvailabilityComponent } from './availability/availability.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateAvailabilityComponent } from './create-availability/create-availability.component';

const routes: Routes = [
 
      {
        path: "calendar", 
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


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedecinRoutingModule { }
