import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit{
  patientId: any;
  appointments: any;
  isVisible = false;
  usernameForm!: FormGroup;
  username!: string | null;

  constructor(private apiService: ApiServiceService,
              private router: Router, 
              public authService: AuthService,
              private fb: FormBuilder){}

  ngOnInit(): void {
    this.username = window.localStorage.getItem('username');
    
    if(this.authService.isAuthenticated){
      this.patientId= this.authService.userId;
      this.apiService.getPatinetAppointments(this.patientId).subscribe(response => {
        this.appointments = response;
      });
    }else if(this.username != 'undefined' && this.username != null){
      this.getAppointments(this.username);
    }else{
      this.showModal();
    }
    
  }

  showModal(): void {
    this.initializeForm();
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  initializeForm(){
    this.usernameForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  resetForm(event: Event){
    event.preventDefault();
    this.usernameForm.reset();
  }

  getAppointments(username: string){
    this.apiService.getPatientAppointmentsByUsername(username).subscribe({
      next: (data) => {
        this.appointments = data;
        window.localStorage.setItem('username', username);
        this.handleCancel();
      },error: (err) => {
        console.log(err);
      }
    });
    
    
  }
  
  onSubmitSerch(){
    if(this.usernameForm.valid){
      this.getAppointments(this.usernameForm.value.username);
    }
  }

  deconnexion() {
    if(this.authService.isAuthenticated){
      this.authService.logout();
    }else{
      window.localStorage.removeItem("username");
      this.router.navigateByUrl("");
    }
  }
}
