import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../back-office/services/api-service.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit{
  patientId:any;
  appointments:any;

  constructor(private route:ActivatedRoute,private apiService:ApiServiceService,private router:Router){}

  ngOnInit(): void {

    this.patientId=this.route.snapshot.paramMap.get('patientId');
    this.apiService.getPatinetAppointments(this.patientId).subscribe(response=>{
      this.appointments=response;
      
    })
}

deconnexion() {

  localStorage.removeItem('token');
  this.router.navigateByUrl("/");
 }
}
