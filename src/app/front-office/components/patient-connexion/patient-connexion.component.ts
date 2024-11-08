import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiServiceService } from '../../../back-office/services/api-service.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-connexion',
  templateUrl: './patient-connexion.component.html',
  styleUrl: './patient-connexion.component.css'
})
export class PatientConnexionComponent implements OnInit{

  form1!:FormGroup;
  form2!:FormGroup;
  currentStep:boolean=true;
  currentStep2:boolean=false;
  username:any;
  password:any;

  constructor(private apiService:ApiServiceService, private fromBuilder:FormBuilder, private route:Router,private authService:AuthService){}


 ngOnInit(): void {

     this.form1=this.fromBuilder.group({
       code:['',Validators.required],
       phone:['',Validators.required],
     });


     this.form2=this.fromBuilder.group({
      code2:['',Validators.required]
    });


 }


 
 submitForm1() {
 this.username=this.form1.value.code;

if (this.form1.valid) {
  this.apiService.postVerifyIdentity(this.form1.value.phone,this.form1.value.code).subscribe({
    next: (response) => {
  
      this.currentStep=false;
      this.currentStep2=true;
    },
    error:error=>{
     console.log(error);
     if(error.status==200){
      this.currentStep=false;
      this.currentStep2=true;
     }
    }
  })
  
}
}

  submitForm2() {
    console.log(this.username);
    
   if (this.form2.valid) {
    this.apiService.postLogin(this.username,this.form2.get("code2")?.value).subscribe({
      next: (response)=>{
        const patientId=this.authService.userId;           
        this.route.navigate(['/patient-dashboard',patientId]);   
      },
      error:(error)=>{
       console.log(error.error);    
      }
    })
   }   

  }

}
