import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-patient-medical-record',
  templateUrl: './patient-medical-record.component.html',
  styleUrl: './patient-medical-record.component.css'
})
export class PatientMedicalRecordComponent implements OnInit{
  patientId: any;
  dataMedicalRecord:any;

  constructor(private route:ActivatedRoute,private apiService:ApiServiceService,private router:Router){}


  ngOnInit(): void {
    this.patientId=this.route.snapshot.paramMap.get('patientId');

    this.apiService.getDataMedicalRecordPatient(this.patientId).subscribe({
      next:response=>{
        this.dataMedicalRecord=response;
        console.log(response);
        
      },
      error:error=>{
        console.log(error);
        

      }
    })

  }

  deconnexion() {

    localStorage.removeItem('token');
    this.router.navigateByUrl("/");
  }

}
