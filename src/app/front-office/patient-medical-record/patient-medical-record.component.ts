import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-medical-record',
  templateUrl: './patient-medical-record.component.html',
  styleUrl: './patient-medical-record.component.css'
})
export class PatientMedicalRecordComponent implements OnInit{
  patientId: any;
  medicalRec: any;

  constructor(private route: ActivatedRoute,
              private apiService: ApiServiceService,
              private router:Router,
              private authService: AuthService){}


  ngOnInit(): void {
    this.patientId = this.authService.userId;

    this.apiService.getDataMedicalRecordPatient(this.patientId).subscribe({
      next: (data) => {
        if(data.success == true){
          this.medicalRec = data.data

          if(this.medicalRec.date_creation != null){
            this.medicalRec.date_creation = this.convertToDate(this.medicalRec.date_creation);
          }
          for(let info of this.medicalRec.infoMedicalRecords){
            if(info.date != null){
              info.date = this.convertToDate(info.date)
            }
          }
        }else{
          Swal.fire({
            title: 'Erreur',
            text: data.errorMessage,
            icon: 'error',
            timer: 6000,
            showConfirmButton: false,
            timerProgressBar: true
          });
        }
      },error: (err) => {
        Swal.fire({
          title: 'Erreur',
          text: "Un erreur inconnue s'est produite",
          icon: 'error',
          timer: 6000,
          showConfirmButton: false,
          timerProgressBar: true
        });
      }
    });

  }

  deconnexion() {

    localStorage.removeItem('token');
    this.router.navigateByUrl("/");
  }


  convertToDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-');
    return new Date(+year, +month - 1, +day); // mois commence à 0 en JavaScript
  }

}
