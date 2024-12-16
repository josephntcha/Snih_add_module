import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { Permission } from '../../../models/model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-view-medical-record',
  templateUrl: './view-medical-record.component.html',
  styleUrl: './view-medical-record.component.css'
})
export class ViewMedicalRecordComponent implements OnInit{
  medicalRecordId!: number
  medicalRec: any;

  canViewRecord = false;

  constructor(private route: ActivatedRoute, 
              private authService: AuthService, 
              private apiService: ApiServiceService,
              private router: Router){}

  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.medicalRecordId = this.route.snapshot.params["id"];
    
    this.apiService.getMedicalRecord(this.medicalRecordId).subscribe({
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

  convertToDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-');
    return new Date(+year, +month - 1, +day); // mois commence à 0 en JavaScript
  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Dossiers médicaux").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_RECORD")){
            this.canViewRecord = true;
          }else{
            this.canViewRecord = false;
            this.router.navigateByUrl("/login");
          }
        }
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

}
