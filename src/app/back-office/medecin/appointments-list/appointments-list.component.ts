import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceService } from '../../../services/api-service.service';
import { Permission } from '../../../models/model';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css',
  providers: [DatePipe],
})
export class AppointmentsListComponent {

checkForm!:FormGroup;
secretaryForm!:FormGroup;  
appointments: any[] = [];
appointmentId:any;
newDate!:Date;
formattedDate: string | null | undefined;
formattedDateFollow: string | null | undefined;
formattedDatePostpone: string | null | undefined;
day: any;
hospitalId:any;
specialityId:any;
doctorId: any;
availabilities: any;
days:any;
originalAppointments: any[] = [];
secretaries: any;
autorities: any;
secretaryId:any;
isVisible = false;
isOkLoading = false;
canViewListAppointment=false;
canGiveRightToSecretaire=false;

constructor(private apiService:ApiServiceService,private authService:AuthService,private formBuilder:FormBuilder,private route:ActivatedRoute,private datePipe: DatePipe,private router: Router){}

showModal(): void {
  this.isVisible = true;
}


handleOk(): void {
  this.isOkLoading = true;
  setTimeout(() => {
    this.isVisible = false;
    this.isOkLoading = false;
  }, 500);
}

handleCancel(): void {
  this.isVisible = false;
}


ngOnInit(): void {
  this.getConnectedUserPermissionsOnComponent();

  this.doctorId=this.authService.userId;    
  this.checkForm=this.formBuilder.group({
    CONFIRM:[''],
    POSTPONE:[''],
    CANCEL:[''],
  })
  this.secretaryForm=this.formBuilder.group({
    secretary:['']
  });

    this.appointmentId = history.state.availability;
    this.day = history.state.date;
    this.hospitalId=history.state.hospitalId;
    this.specialityId=history.state.specialityId;
    
    this.loadAppointmentsByAvailability(); 

    this.apiService.getAutorities().subscribe(response=>{

      this.autorities=response
    })
    
    this.apiService.getSecretary(this.hospitalId,this.specialityId).subscribe(response=>{
     this.secretaries=response;
     
    })

    this.secretaryForm.get('secretary')?.valueChanges.subscribe(selectedSecretaryId=>{
      this.secretaryId=selectedSecretaryId;
    });
 
}


getConnectedUserPermissionsOnComponent(){
  this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Calendrier").subscribe({
    next: (response) => {
      if(response.success){
        const currentUserPermissions: Permission[] = response.data;
        const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
        
        if(permissionsCodeNames.includes("VIEW_LIST_APPOINTMENTS")){
          this.canViewListAppointment = true;
        }else{
          this.canViewListAppointment = false;
        }
        if(permissionsCodeNames.includes("GIVE_RIGHT_TO_SECRETARY")){
          this.canGiveRightToSecretaire = true;
        }else{
          this.canGiveRightToSecretaire = false;
        }
      }
    },error: (err) => {
      console.log(err.message);        
    }
  })
}




allow(autority:any){

  Swal.fire({
    title: 'Attention!',
    text: "Voulez-vous vraiment donner ce droit au sécretaire",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'oui!',
    cancelButtonText: 'non'
  }).then((result) => {
    if (result.isConfirmed) {
      this.apiService.postAutority(this.secretaryId,autority.id,this.doctorId).subscribe(response=>{
       if (response.success) {
        Swal.fire({
          title: 'Droit autorisé',
          text: "Vous avez donné ce droit au sécretaire",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'oui!',
          cancelButtonText: 'non'
        })
       }
      })
    }
  });
   

   
}




loadAppointmentsByAvailability(){
  if (this.appointmentId) {
    const selectedAppointments = this.appointmentId.appointments.filter((appointment: any) =>
      moment(appointment.newDate).isSame(this.day, 'day')
    );
    this.appointments = selectedAppointments;
    this.originalAppointments = [...selectedAppointments]; // Gardez une copie
  }  
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


  postponeAppointment(id: any,newDate:any) {
    this.apiService.postponeAppointment(id,newDate).subscribe(response=>{
      
      for (let index = 0; index < this.appointments.length; index++) {
        const element = this.appointments[index]['id'];
        if (element==response.data['id']) {
          this.appointments[index] = response.data; 
        }
      }

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
        <select id="availability" class="form-select form-control">
          <option value="">-- Choisissez une disponibilité --</option>
          ${this.availabilities.map((availability: any,index: number) => `<option value="${index}">${availability.day.name} || ${availability.startTime} à ${availability.endTime}</option>`).join('')}
        </select> <br>
        <select id="days" class="form-select form-control" disabled>
          <option value="">-- Choisissez un jour --</option>
        </select>
      `,
      didOpen: () => {
        const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
        const daysSelect = document.getElementById('days') as HTMLSelectElement;
  
        availabilitySelect.addEventListener('change', (event) => {
          const selectedIndex = (event.target as HTMLSelectElement).value;
          const selectedAvailability = this.availabilities[parseInt(selectedIndex)]; 
          if (selectedIndex) {
             this.apiService.getDaysForAvailability(selectedAvailability.id,selectedAvailability.period).subscribe(response => {
               this.days = response.data;
               daysSelect.innerHTML = this.days.map((day: any) => `<option value="${day}">${day}</option>`).join('');
               daysSelect.disabled = false;
             });
          } else {
            daysSelect.innerHTML = `<option value="">-- Choisissez un jour --</option>`;
            daysSelect.disabled = true;
          }
        });
  
      },
      preConfirm: () => {
        const selectedAvailability = (document.getElementById('availability') as HTMLSelectElement).value;
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
        this.postponeAppointment(appointment.id,this.formattedDatePostpone);
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

 followAppointment(appointment: any) {

  this.apiService.getAvailabilitiesByDoctorAndHospital(this.doctorId,this.hospitalId).subscribe(response=>{
    this.availabilities=response; 
    
    Swal.fire({
      title: 'Date de suivi',
      text: "Veuillez sélectionner la date de suivi",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler',
      html: `
        <select id="availability" class="form-select form-control">
          <option value="">-- Choisissez une disponibilité --</option>
          ${this.availabilities.map((availability: any,index:number) => `<option value="${index}">${availability.day.name} || ${availability.startTime} à ${availability.endTime}</option>`).join('')}
        </select> <br>
        <select id="days" class="form-select form-control" disabled>
          <option value="">-- Choisissez un jour --</option>
        </select>
      `,
      didOpen: () => {
        const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
        const daysSelect = document.getElementById('days') as HTMLSelectElement;
  
        availabilitySelect.addEventListener('change', (event) => {
          const selectedIndex = (event.target as HTMLSelectElement).value;
          const selectedAvailability = this.availabilities[parseInt(selectedIndex)]; 
          if (selectedIndex) {
            this.apiService.getDaysForAvailability(selectedAvailability.id,selectedAvailability.period).subscribe(response => {
              this.days = response.data;
  
              daysSelect.innerHTML = this.days.map((day: any) => `<option value="${day}">${day}</option>`).join('');
              daysSelect.disabled = false;
            });
          } else {
            daysSelect.innerHTML = `<option value="">-- Choisissez un jour --</option>`;
            daysSelect.disabled = true;
          }
        });
  
      },
      preConfirm: () => {
        const selectedAvailability = (document.getElementById('availability') as HTMLSelectElement).value;
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
       
        this.formattedDateFollow = this.datePipe.transform(result.value.selectedDay, 'yyyy/MM/dd');
        this.apiService.followAppointment(appointment.id,this.formattedDateFollow).subscribe(response=>{
                
         });

      }
    });
     
   });

}

filterAppointment(status: string) {
  this.appointments = this.originalAppointments.filter((appointment: any) => 
    appointment.status?.toLowerCase() === status.toLowerCase()
  );
}

}
