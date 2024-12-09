import { Component, OnInit } from '@angular/core';
import { Hospital, Permission } from '../../../models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FileExportService } from '../../../services/file-export.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.css'
})
export class HospitalsComponent implements OnInit{
  listOfData!: Hospital[];
  canViewList = false;
  canCreateHospital = false;
  canEditHospital = false;
  canDeleteHospital = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly Hospital[] = [];


  hospitalForm!: FormGroup;
  isVisible = false;
  hospital: any;


  constructor(private apiService: ApiServiceService, 
              private router: Router, 
              private fileExport: FileExportService,
              private fb: FormBuilder,
              private authService: AuthService){}


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getHospitals()
  }


  getHospitals(){
    this.apiService.getDataHospitals().subscribe({
      next: (data) => {
        this.listOfData = data;
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Hôpitaux").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_LIST_HOSPITALS")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("CREATE_HOSPITAL")){
            this.canCreateHospital = true;
          }else{
            this.canCreateHospital = false;
          }
          if(permissionsCodeNames.includes("UPDATE_HOSPITAL")){
            this.canEditHospital = true;
          }else{
            this.canEditHospital = false;
          }
          if(permissionsCodeNames.includes("DELETE_HOSPITAL")){
            this.canDeleteHospital = true;
          }else{
            this.canDeleteHospital = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  initializeForm(){
    this.hospitalForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  patchForm(hospital: Hospital){
    this.hospitalForm.patchValue({
      name: hospital.name,
      location: hospital.location
    });
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  editHospital(existedHospital: Hospital){
    this.hospital = existedHospital;
    this.showModal()
    this.patchForm(existedHospital);
  }


  onSubmit() {
    if (this.hospitalForm.valid) {
      const data = {
        name: this.hospitalForm.value.name,
        location: this.hospitalForm.value.location
      }
      if(this.hospital){
        this.apiService.updateHospital(this.hospital.id, data).subscribe({
          next: (response) => {
            if(response.success){
              Swal.fire({
                title: "information mise à jour avec succès !",
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.isVisible = false;
              this.hospital = null;
              this.getHospitals()
              this.router.navigateByUrl("/Administration/hospitals");
            }else{
              Swal.fire({
                title: response.errorMessage,
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          },error: (err) => {
            console.log(err.message);            
          }
        })
      }else{
        this.apiService.postHospital(data).subscribe({
          next: response => {
            if (response.success) {
              Swal.fire({
                title: 'H$opital créé avec succès',
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.isVisible = false;
              this.getHospitals()
            }else{
              Swal.fire({
                title: response.errorMessage,
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          },
          error:error=>{
            Swal.fire({
              title: 'Une erreur inconnue s\'est produite, veuillez ressayer',
              text: '',
              icon: 'error',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
          }
        });
      }
    }
  }

  resetForm(event: Event){
    event.preventDefault();
    this.hospitalForm.reset();
  }



  onCurrentPageDataChange($event: readonly Hospital[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    if(!this.listOfData) return;
    const listOfEnabledData = this.listOfData.filter(({ id }) => !this.setOfCheckedId.has(id));
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfData
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }


  exportToFile(){
    this.fileExport.exportToExcel('hospitals', this.listOfData);
  }



  deleteHospital(hospitalId: number){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer cet hôpital ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteHospital(hospitalId).subscribe(response => {
          Swal.fire({
            title: "Hôpital supprimé avec succès !",
            text: '',
            icon: 'success',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
          this.getHospitals()
          this.router.navigateByUrl("/Administration/hospitals");
        });
      }
    });
  }

}
