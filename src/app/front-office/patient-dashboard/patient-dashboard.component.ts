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

  constructor(private apiService: ApiServiceService,
              private router: Router, 
              private authService: AuthService,
              private fb: FormBuilder){}

  ngOnInit(): void {
    if(this.authService.isAuthenticated){
      this.patientId= this.authService.userId;
      this.apiService.getPatinetAppointments(this.patientId).subscribe(response => {
        this.appointments = response;
      });
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

  onSubmitSerch(){
    if(this.usernameForm.valid){
      this.apiService.getPatientAppointmentsByUsername(this.usernameForm.value.username).subscribe({
        next: (data) => {
          this.appointments = data;
          console.log(this.appointments);
          
          this.handleCancel();
        },error: (err) => {
          console.log(err);
        }
      });
    }
  }

  deconnexion() {
    this.authService.logout();
  }
}
