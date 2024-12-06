import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit{
  patientId:any;
  appointments:any;

  constructor(private route:ActivatedRoute,private apiService:ApiServiceService,private authService:AuthService,private router:Router){}

  ngOnInit(): void {

    this.apiService.getPatinetAppointments(this.authService.userId).subscribe(response=>{
      this.appointments=response;
      
    })
}

deconnexion() {

  localStorage.removeItem('token');
  this.router.navigateByUrl("/");
 }
}
