import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrl: './secretary.component.css'
})
export class SecretaryComponent implements OnInit{

  hospitalId:any;
  specialityId:any;
  doctors:any;
  secretaryId:any;
  secretary:any;

  constructor(private apiService:ApiServiceService,private route:ActivatedRoute,private router:Router,private authService:AuthService){}


  ngOnInit(): void {
  
    this.secretaryId=this.authService.userId;
  
    this.apiService.getUserById(this.secretaryId).subscribe(response=>{
  
     this.secretary=response.data;
     this.hospitalId=this.secretary.hospital.id;
     this.specialityId=this.secretary.speciality.id;
  
     this.apiService.getDoctorHospitalSpeciality(this.hospitalId,this.specialityId).subscribe(response=>{
      this.doctors=response.data;
      });
    });
  
  }
  
  
appointmentsDoctor(doctor: any) {
  this.router.navigate(['/Administration/appointmentsDoctors',this.hospitalId,doctor.id]);
   }
 
  

}
