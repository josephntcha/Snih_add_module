import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import { Permission, Building } from '../../../models/model';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent implements  OnInit{
  doctorId:any;
  availabilities:any;
  availabilities1:any;
  frequencies:any;
  days:any;
  availabiltyForm!:FormGroup;
  rooms: any;
  rooms1: any;
  hospitals: any;
  hospitalId:any;
  doctor: any;
  mensuelle: boolean=false;
  buildings: any;
  isVisible = false;
  availability:any;
  canCreateAvailibility=false;
  canEditAvailibility=false;
  canViewListAvailibility=false;

  constructor(private apiService:ApiServiceService, private route:Router, private formBuilder:FormBuilder, private authService:AuthService ){}



  
  ngOnInit(): void {
    
    this.getConnectedUserPermissionsOnComponent();

    this.availabiltyForm=this.formBuilder.group({
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

 
     this.doctorId=this.authService.userId;
     this.apiService.getDataHospitalsByDoctor(this.doctorId).subscribe(response=>{
      this.hospitals=response;
     });
     this.apiService.getUserById(this.doctorId).subscribe(response=>{
      this.doctor=response.data;
    })
    

     this.apiService.getDoctorAvailabilities(this.doctorId).subscribe(response=>{
      this.availabilities=response.data;
      
      });
       this.apiService.getDays().subscribe(response=>{
        this.days=response;
        });

        this.apiService.getDataFrequencies().subscribe(reponse=>{
          this.frequencies=reponse;
           });

           this.availabiltyForm.get('frequency')?.valueChanges.subscribe(frequency=>{

            if (frequency.name==="MENSUELLE") {
              
             this.mensuelle=true;
            }else{
                this.mensuelle=false;
            }
           });

           this.availabiltyForm.get('building')?.valueChanges.subscribe(selectBuildingId=>{

            this.apiService.getRooms(selectBuildingId).subscribe(response=>{
              this.rooms=response;
             });
           });

           this.availabiltyForm.get('hospital')?.valueChanges.subscribe(selectedHospitalId=>{

            this.apiService.getBuildings(selectedHospitalId).subscribe(response=>{
              this.buildings=response;
              
            })
    
              this.apiService.getAvailabilitiesByHospitalAndSpeciality(selectedHospitalId,this.doctor.speciality.id).subscribe(response=>{
                this.availabilities1=response;
                
                 for (let index1 = 0; index1 < this.availabilities1.length; index1++) {

                  this.apiService.getMaxNumberForAvaillability(this.availabilities1[index1]['id'],selectedHospitalId,this.doctor.speciality.id).subscribe(response=>{
                       
                      for (let index2 = 0; index2 < response.length; index2++) {
                        if(this.availabiltyForm.get('building')?.value != ""){
                          for (let index3 = 0; index3 < this.rooms.length; index3++) {
        
                            if ((response[index2].day.id==this.availabiltyForm.get('day')?.value) && 
                                (response[index2].startTime==this.availabiltyForm.get('startTime')?.value) &&
                                (response[index2].endTime==this.availabiltyForm.get('endTime')?.value) &&
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
  
  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Disponibilités").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("CREATE_AVAILABILITY")){
            this.canCreateAvailibility = true;
          }else{
            this.canCreateAvailibility = false;
          }
          if(permissionsCodeNames.includes("UPDATE_AVAILABILITY")){
            this.canEditAvailibility = true;
          }else{
            this.canEditAvailibility = false;
          }
          if(permissionsCodeNames.includes("VIEW_LIST_AVAILABILITIES")){
            this.canViewListAvailibility = true;
          }else{
            this.canViewListAvailibility = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  updateAvailability1(availability: any) { 
    this.availability=availability;
    
    const dayId=availability.day.id;
    const hospitalId=availability.hospitalDTO.id;
    const frq=availability.frequency;
    
    this.availabiltyForm.patchValue({
        day:dayId,
        startTime: availability.startTime,
        endTime: availability.endTime,
        frequency: [frq],
        orderOfDay: availability.orderOfDay,
        Availibility: hospitalId,
        maxNumberOfAppointments: availability.maxNumberOfAppointments,
        room: availability.room,
        buildingId: availability.building,
        period: availability.period
      });
    this.isVisible = true;
    
   
}

handleOk(): void {  
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  Submit(){   
    
    const data = {
        startTime:this.availabiltyForm.value.startTime,
        endTime:this.availabiltyForm.value.endTime,
        frequency:this.availabiltyForm.value.frequency,
        orderOfDay:this.availabiltyForm.value.orderOfDay,
        maxNumberOfAppointments:this.availabiltyForm.value.maxNumberOfAppointments,
        room:this.availabiltyForm.value.room,
        buildingId: this.availabiltyForm.value.building,
        period:this.availabiltyForm.value.period
      }                
    
     this.apiService.putAvailability(this.availability.id,this.availabiltyForm.value.day,this.doctorId,this.availabiltyForm.value.hospital,data).subscribe({
         next:response=>{
            console.log(response);
             this.apiService.getDoctorAvailabilities(this.doctorId).subscribe(response=>{
                 this.availabilities=response.data;
             });

             if (response.success == true) {
                 Swal.fire({
                     title: 'Modification effectuée',
                     text: 'Opération réussie',
                     icon: 'success',
                     timer: 3500,
                     showConfirmButton: false,
                     timerProgressBar: true
                 });

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

             this.isVisible = false;
         },
         error:error=>{
        
             Swal.fire({
                 title: 'Error',
                 text: 'une erreur inattendue s\'est produite',
                 icon: 'warning',
                 timer: 3500,
                 showConfirmButton: false,
                 timerProgressBar: true
             });
         }
     })
  }

}
