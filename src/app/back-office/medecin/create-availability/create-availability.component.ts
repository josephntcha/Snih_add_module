import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-create-availability',
  templateUrl: './create-availability.component.html',
  styleUrl: './create-availability.component.css'
})
export class CreateAvailabilityComponent implements OnInit{

  appointmentform!:FormGroup;
  hospitals:any;
  frequencies:any;
  availabilities: any;
  doctorId:any;
  doctor:any;
  days:any;
  rooms:any;
  mensuelle:boolean=false;
  buildings: any;

constructor(private apiService:ApiServiceService,private authService:AuthService, private fromBuilder:FormBuilder, private route:Router){}


ngOnInit(): void {


  this.apiService.getDays().subscribe(response=>{
  this.days=response;
  })


  this.appointmentform=this.fromBuilder.group({
   day:['',Validators.required],
   startTime:['',Validators.required],
   endTime:['',Validators.required],
   frequency:['',Validators.required],
   hospital:['',Validators.required],
   maxNumberOfAppointments:['',Validators.required],
   room:[''],
   building:[''],
   period:['',Validators.required],
   orderOfDay:[''],

  });

  this.appointmentform.get('frequency')?.valueChanges.subscribe(frequency=>{

    if (frequency.name==="MENSUELLE") {
      
     this.mensuelle=true;
    }else{
      this.mensuelle=false;
    }
   });

this.loadAppointments()
    
}
loadAppointments() {
   
    this.doctorId=this.authService.userId;
        this.apiService.getDataHospitalsByDoctor(this.doctorId).subscribe(response=>{
           this.hospitals=response;
           
          });
    

    this.apiService.getUserById(this.doctorId).subscribe(response=>{
      this.doctor=response.data;
    })


    this.apiService.getDataFrequencies().subscribe(reponse=>{
    this.frequencies=reponse;
     });

     this.appointmentform.get('building')?.valueChanges.subscribe(selectBuildingId=>{

      this.apiService.getRooms(selectBuildingId).subscribe(response=>{
        this.rooms=response;
       });
     })

     this.appointmentform.get('hospital')?.valueChanges.subscribe(selectedHospitalId=>{

        this.apiService.getBuildings(selectedHospitalId).subscribe(response=>{
          this.buildings=response;
          
        })

   

      this.apiService.getAvailabilitiesByHospitalAndSpeciality(selectedHospitalId,this.doctor.speciality.id).subscribe(response=>{
        this.availabilities=response;
        
         for (let index1 = 0; index1 < this.availabilities.length; index1++) {

          this.apiService.getMaxNumberForAvaillability(this.availabilities[index1]['id'],selectedHospitalId,this.doctor.speciality.id).subscribe(response=>{
               
            
              for (let index2 = 0; index2 < response.length; index2++) {
                if(this.appointmentform.get('building')?.value != ""){
                 for (let index3 = 0; index3 < this.rooms.length; index3++) {

                  if ((response[index2].day.id==this.appointmentform.get('day')?.value) && 
                      (response[index2].startTime==this.appointmentform.get('startTime')?.value) &&
                      (response[index2].endTime==this.appointmentform.get('endTime')?.value) &&
                      (response[index2].room==this.rooms[index3]['room'])) {
                  
                  this.rooms=this.rooms.filter((room:any)=> room.room !== response[index2].room)                     
                  }
                 }
                }
                 
              }
          
          });
          
         }
      });
      
   });
  

  }

  onSubmit(){
    if (this.appointmentform.valid) {
         const data={
         startTime:this.appointmentform.value.startTime,
         endTime:this.appointmentform.value.endTime,
         maxNumberOfAppointments:this.appointmentform.value.maxNumberOfAppointments,
         frequency:this.appointmentform.value.frequency,
         building:this.appointmentform.value.building,
         room:this.appointmentform.value.room,
         period:this.appointmentform.value.period,
         orderOfDay:this.appointmentform.value.orderOfDay,
         }
          this.apiService.postAvailability(this.appointmentform.value.day,this.doctorId,this.appointmentform.value.hospital,data).subscribe({
           next:response=>{
            if (response.success == true) {
             Swal.fire({
                 title: 'Disponibilité définie',
                 text: 'Operation reussite',
                 icon: 'success',
                 timer:3500,
                 showConfirmButton:false,
                 timerProgressBar:true 
               });

               this.route.navigateByUrl("/back-office/medecin/availability");
            }else{
                   Swal.fire({
                    title: 'Non Modifié',
                    text: response.errorMessage,
                    icon: 'success',
                    timer: 3500,
                    showConfirmButton: false,
                    timerProgressBar: true
                  });
             }
           },
           error:error=>{
             console.log(error);
           }
          })
      }
    
  }
}
