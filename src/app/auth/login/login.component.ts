import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService){}

  images: string[] = [
    'assets/téléchargement1.jpeg', 
    'assets/téléchargement2.jpeg', 
    'assets/téléchargement3.jpeg', 
    'assets/téléchargement4.jpeg', 
    
  ];

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        remember: [false]
      })
  }


  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (data) => {          
          this.authService.loadProfile(data);
          if(!this.authService.isPatient()){
            if(this.authService.isSuperAdmin()){
              this.router.navigateByUrl("/back-office/Administration/super-admin-dashboard");
            }else if(this.authService.isAdmin()){
              this.router.navigateByUrl("/back-office/Administration/admin-dashboard");
            }else if(this.authService.isDoctor()){
              this.router.navigateByUrl("/back-office/Administration/doctor-dashboard");
            }else{
              this.router.navigateByUrl("/back-office/Administration/staff-dashboard");
            }
          }else{
            this.router.navigateByUrl("/patient-interface");
          }
        },error: (err) => {
          Swal.fire({
            title: err.message,
            text: '',
            icon: 'error',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
        }
      })
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
