import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { log } from 'ng-zorro-antd/core/logger';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-known-doctor',
  templateUrl: './known-doctor.component.html',
  styleUrl: './known-doctor.component.css'
})
export class KnownDoctorComponent implements OnInit{

  Hospitalform!:FormGroup;
  dataDoctors:any;
  hospitals:any;
  availabilities:any;
  doctorId:any;
  specialityId:any;
  days:any;
  priceBySpeciality:number=0;
  selectedDoctor:any;
  selectedAvailability:any;
  hospitalId:any;

  constructor(private apiService:ApiServiceService, private fromBuilder:FormBuilder, private route:Router){}


  checkAvailabilityAndRemoveDays() {
    if (!this.availabilities || !this.days) {
        console.log("pas de données");
        
      }
     this.availabilities.forEach((availability:any) => {
        const appointmentCountByDate: { [key: string]: number } = {};
  
        availability.appointments.forEach((appointment:any) => {
          const appointmentDate = appointment.date.split('T')[0];
  
          if (appointmentCountByDate[appointmentDate]) {
            appointmentCountByDate[appointmentDate]++;
          } else {
            appointmentCountByDate[appointmentDate] = 1;
          }
        });
  
        Object.keys(appointmentCountByDate).forEach((appointmentDate) => {
          const n = appointmentCountByDate[appointmentDate]; 
  
          if (n === availability.maxNumberOfAppointments) {
            this.days = this.days.filter((dayDate:any) => dayDate !== appointmentDate);
          }
        });
      });
  }
  

  ngOnInit(): void {

    this.Hospitalform=this.fromBuilder.group(
           {
             patientLastName:['',Validators.required],
             patientFirstName:['',Validators.required],
             patientEmail:[''],
             patientPhone:['',Validators.required],
             doctor:['',Validators.required],
             hospital:['',Validators.required],
             speciality:[''],
             availability:['',Validators.required],
             date:['',Validators.required],
             price:['']
           }
         );   
 
           this.apiService.getDataDoctors().subscribe(response=>{
           this.dataDoctors=response
        
           
           
            });
 
           this.Hospitalform.get('doctor')?.valueChanges.subscribe(selectedDoctorId=>{
             this.specialityId=selectedDoctorId.speciality.id;
             this.apiService.getDataHospitalsByDoctor(selectedDoctorId.id).subscribe(response=>{
             this.hospitals=response; 
             this.doctorId=selectedDoctorId.id;
 
         
 
            });
          }); 
 
           this.Hospitalform.get('hospital')?.valueChanges.subscribe(selectedHospitalId=>{
 
             this.apiService.getPriceByHospitalAndSpeciality(selectedHospitalId,this.specialityId).subscribe(response=>{
               this.priceBySpeciality=response.data;
            
              })
 
            this.apiService.getAvailabilitiesByDoctorAndHospital(this.doctorId,selectedHospitalId).subscribe(response=>{
             this.availabilities=response; 
            });
 
         });
 
 
          this.Hospitalform.get('availability')?.valueChanges.subscribe(selectedAvailabilityId=>{
            
           if (selectedAvailabilityId.frequency.name === "HEBDOMADAIRE") {
             this.apiService.getDaysForAvailability(selectedAvailabilityId.day.id,selectedAvailabilityId.period).subscribe(response=>{
               this.days=response.data;
               this.checkAvailabilityAndRemoveDays();
                })
           }
           if (selectedAvailabilityId.frequency.name === "MENSUELLE") {
             this.apiService.getDaysForAvailability2(selectedAvailabilityId.day.id,selectedAvailabilityId.orderOfDay,selectedAvailabilityId.period).subscribe(response=>{
               this.days=response.data;
               this.checkAvailabilityAndRemoveDays();
                })
             
           }
      
         
         });
 
   
   }
 

   onSubmit(){    
    if (this.Hospitalform.valid) {
      Swal.fire({
        title: 'Prendre RDV!',
        text: "Voulez-vous vraiment donner ce rendez-vous?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'oui!',
        cancelButtonText: 'non'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.postAppointment(this.Hospitalform.value.availability.id,this.Hospitalform.value.hospital,this.Hospitalform.value).subscribe({
            next:response=>{
              if (response.success) {
                Swal.fire({
                  title: 'RDV prit',
                  text: response.code,
                  icon: 'success',
                  timer:3500,
                  showConfirmButton:false,
                  timerProgressBar:true 
                });
              }
            },
            error:error=>{
              console.log(error);
            }
           })
        }
      })
    }else{
       alert("Le formulaire n'est pas valide");    
    }
  }

}
