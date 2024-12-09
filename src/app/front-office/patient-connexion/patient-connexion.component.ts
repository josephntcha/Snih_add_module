import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-connexion',
  templateUrl: './patient-connexion.component.html',
  styleUrl: './patient-connexion.component.css'
})
export class PatientConnexionComponent implements OnInit{

  form1!: FormGroup;
  form2!: FormGroup;
  currentStep: boolean = true;
  currentStep2: boolean = false;
  username: any;
  password: any;

  images: string[] = [
    'assets/téléchargement1.jpeg', 
    'assets/téléchargement2.jpeg', 
    'assets/téléchargement3.jpeg', 
    'assets/téléchargement4.jpeg', 
    
  ];

  constructor(private apiService: ApiServiceService, 
              private fromBuilder: FormBuilder, 
              private route: Router,
              private authService: AuthService){}


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
 this.username = this.form1.value.code;

if (this.form1.valid) {
  this.apiService.postVerifyIdentity(this.form1.value.phone, this.form1.value.code).subscribe({
    next: (response) => {
      if(response.success){
        this.currentStep = false;
        this.currentStep2 = true;
        this.username = this.form1.value.code;

        Swal.fire({
          title: 'Un code code vous a été envoyé par SMS et expire dans 2 minutes',
          text: '',
          icon: 'info',
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true 
        });
      }else{
        Swal.fire({
          title: response.errorMessage,
          text: '',
          icon: 'error',
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true 
        });
      }
    },
    error: error => {      
     if(error.status == 200){
      this.currentStep = false;
      this.currentStep2 = true;

      Swal.fire({
        title: 'Un code code vous a été envoyé par SMS et expire dans 2 minutes',
        text: '',
        icon: 'info',
        timer: 3500,
        showConfirmButton: false,
        timerProgressBar: true 
      });
     }
    }
  })
  
}
}

  submitForm2() {
    if (this.form2.valid) {
      this.authService.login(this.username, this.form2.get("code2")?.value).subscribe({
        next: (response)=>{       
          this.authService.loadProfile(response);
          this.route.navigateByUrl('/patient-dashboard');   
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }   

  }


  regenerateCode(){
    this.authService.regenerateOPTCode(this.username).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Un code code vous a été envoyé par SMS et expire dans 2 minutes',
          text: '',
          icon: 'info',
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true 
        });
  
      },error: (err) => {
        if(err.status == 200){
          Swal.fire({
            title: 'Un code code vous a été envoyé par SMS et expire dans 2 minutes',
            text: '',
            icon: 'info',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
        }else{
          console.log(err);
        }
        
        
      }
    })
  }

}
