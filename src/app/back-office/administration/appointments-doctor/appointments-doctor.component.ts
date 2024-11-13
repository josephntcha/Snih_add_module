import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceService } from '../../../services/api-service.service';

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
        })
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
Swal.fire({
  title: 'reporter ce rendez-vous!',
  text: "Veuillez reporter ou annuler le RDV",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Confirmer!',
  cancelButtonText: 'Annuler'
}).then((result) => {
  if (result.isConfirmed) {
      Swal.fire({
      title: 'Saisissez une nouvelle date',
      text: "Veuillez saissir  la nouvelle date du  RDV",
      icon: 'warning',
      input: 'date',  
      inputPlaceholder: 'Nouvelle date de RDV', 
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler',
      customClass: {
          input: 'w-50' 
        },
  
    }).then((result) => {
      if (result.isConfirmed) {

        this.formattedDate = this.datePipe.transform(result.value, 'yyyy/MM/dd'); 
        this.postponeAppointment(appointment.id,this.formattedDate);
      }
    });
  }
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
