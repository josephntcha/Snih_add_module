import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceService } from '../../../services/api-service.service';
import moment from 'moment';
type AppointmentStatus = 'ASKED' | 'POSTPONE' | 'CONFIRMED' | 'CANCEL';
@Component({
  selector: 'app-appointments-doctor',
  templateUrl: './appointments-doctor.component.html',
  styleUrl: './appointments-doctor.component.css',
  providers: [DatePipe],
})
export class AppointmentsDoctorComponent implements OnInit{

hospitalId:any;
doctorId:any;
appointments:any;
formattedDate: string | null | undefined;
rightConfirm:boolean=false;
rightPostpone:boolean=false;
rightCancel:boolean=false;
secretary: any;
availabilities:any;
doctors:any[]=[];
days:any;
formattedDatePostpone: string | null | undefined;


constructor(private apiService:ApiServiceService,private datePipe: DatePipe,private route:ActivatedRoute,private router:Router,private authService:AuthService){}

  
  ngOnInit(): void {

    this.hospitalId=this.route.snapshot.paramMap.get('hospitalId');
    this.doctorId=this.route.snapshot.paramMap.get('doctorId');

    this.apiService.getAvailabilitiesByDoctorAndHospital(this.doctorId,this.hospitalId).subscribe(response=>{
       this.availabilities=response;
      if (this.availabilities.length==0) {
        Swal.fire({
          title: 'Aucune disponibilité définie',
          text: "Le médecin n'a pas défini ses disponibilités",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'retour!',
          cancelButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
           
             this.router.navigate(['/back-office/Administration/secretaire-dashboard']);
          }
        });
      }
    })

   
    const user_id=this.authService.userId;
    this.apiService.getUserById(user_id).subscribe(response=>{
      this.secretary=response.data;
      
      for (let index = 0; index < this.secretary.rights.length; index++) {
       
        this.apiService.getDoctorGiveRight(this.secretary.rights[index]['id'],user_id).subscribe(response=>{
         
          const existing=response.find((item:any) => item.id == this.doctorId);

          if (this.secretary.rights[index]['name']=="CONFIRM" && existing) {
            this.rightConfirm=true;
          }
          if (this.secretary.rights[index]['name']=="POSTPONE" && existing) {
            this.rightPostpone=true;
          }
          if (this.secretary.rights[index]['name']=="CANCEL" && existing) {
            this.rightCancel=true;
          }
        })
      }
        
   
    })

    
}

private statusColors: Record<AppointmentStatus, string> = {
  'ASKED': 'blue',
  'POSTPONE': 'orange',
  'CONFIRMED': 'green',
  'CANCEL': 'red'
};

private statusLabels: Record<AppointmentStatus, string> = {
  'ASKED': 'En attente',
  'POSTPONE': 'Reporté',
  'CONFIRMED': 'Confirmé',
  'CANCEL': 'Annulé'
};

getStatusColor(status: string): string {
  return this.statusColors[status as AppointmentStatus] || 'default';
}

getStatusLabel(status: string): string {
  return this.statusLabels[status as AppointmentStatus] || status;
}



confirmAppointment(appointment: any) {
  this.apiService.confirmAppointment(appointment.id).subscribe(updatedAppointment=>{
     
    for (let index = 0; index < this.appointments.length; index++) {
      const element = this.appointments[index]['id'];
      if (element==updatedAppointment.data['id']) {
        this.appointments[index] = updatedAppointment.data; 
      }
    }
  })
}

showConfirmationDialog(appointment:any) {
  Swal.fire({
    title: 'confirmer ce rendez-vous!',
    text: "Veuillez confirmer ou annuler le RDV",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
     this.confirmAppointment(appointment);
     
    }
  });
}


postponeAppointment(id: any,newDate:any,availabilityId:any, doctorId:any) {
  this.apiService.postponeAppointment(id,newDate,availabilityId,doctorId).subscribe(response=>{

  })
}

showpostponeDialog(appointment:any) {
 this.apiService.getAvailabilitiesByDoctorAndHospital(this.doctorId,this.hospitalId).subscribe(response=>{
    this.availabilities=response; 
    
    Swal.fire({
      title: 'Date de repport',
      text: "Veuillez sélectionner la date pour le repport",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler',
      html: `
       <select id="availability" class="custom-select" style="width: 100%; padding: 6px 12px; font-size: 1rem; line-height: 1.5; color: #495057; background-color: #fff; border: 1px solid #ced4da; border-radius: 0.25rem;">
        <option value="">Choisissez une disponibilité </option>
        ${this.availabilities.map((availability: any, index: number) => 
          `<option value="${index}">${availability.day.name} || ${availability.startTime} à ${availability.endTime}</option>`
        ).join('')}
      </select>
     <br><br>
      <select id="days" class="custom-select" disabled style="width: 100%; padding: 6px 12px; font-size: 1rem; line-height: 1.5; color: #495057; background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 0.25rem;">
        <option value="">Choisissez un jour</option>
      </select>
      `,
      didOpen: () => {
        const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
        const daysSelect = document.getElementById('days') as HTMLSelectElement;
  
        availabilitySelect.addEventListener('change', (event) => {
          const selectedIndex = (event.target as HTMLSelectElement).value;
          const selectedAvailability = this.availabilities[parseInt(selectedIndex)]; 
          if (selectedIndex) {
             this.apiService.getDaysForAvailability(selectedAvailability.day.id,selectedAvailability.period).subscribe(response => {
               this.days = response.data;
               daysSelect.innerHTML = this.days.map((day: any) => `<option value="${day}">${this.datePipe.transform(day, 'd MMMM y', 'fr-FR')}</option>`).join('');
               daysSelect.disabled = false;
               daysSelect.style.backgroundColor = '#fff';
             });
          } else {
            daysSelect.innerHTML = `<option value="">-- Choisissez un jour --</option>`;
            daysSelect.disabled = true;
            daysSelect.style.backgroundColor = '#e9ecef'; 
          }
        });
  
      },
      preConfirm: () => {
        const index = (document.getElementById('availability') as HTMLSelectElement).value;
        const selectedAvailability = this.availabilities[parseInt(index)]; 
        const selectedDay = (document.getElementById('days') as HTMLSelectElement).value;
  
        if (!selectedAvailability || !selectedDay) {
          Swal.showValidationMessage('Veuillez sélectionner une disponibilité et un jour');
          return false;
        }
  
        return {
          selectedAvailability,
          selectedDay
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.formattedDatePostpone = this.datePipe.transform(result.value.selectedDay, 'yyyy/MM/dd');
        this.postponeAppointment(appointment.id,this.formattedDatePostpone,result.value.selectedAvailability.id,this.doctorId);
      }
    });
   });


}



deleteAppointment(id: any) {
this.apiService.deleteAppointment(id).subscribe(response=>{

   for (let index = 0; index < this.appointments.length; index++) {
      const element = this.appointments[index]['id'];
      if (element==response.data['id']) {
        this.appointments[index] = response.data; 
      }
    }
    
  })
}

showdeleteDialog(appointment:any) {
Swal.fire({
  title: 'Annuler ce rendez-vous!',
  text: "Veuillez annuler le RDV",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Confirmer!',
  cancelButtonText: 'Annuler'
}).then((result) => {
  if (result.isConfirmed) {
   this.deleteAppointment(appointment.id);
  }
});
}
}
