import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Hospital, Permission, Speciality } from '../../../models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FileExportService } from '../../../services/file-export.service';

@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrl: './specialities.component.css'
})
export class SpecialitiesComponent implements OnInit{
  listOfData!: Speciality[];
  canViewList = false;
  canCreateSpeciality = false;
  canEditSpeciality = false;
  canDeleteSpeciality = false;
  canAddSpecialityToAnotherHospital=false;
  canAddSpecialityToOwnHospital=false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly Speciality[] = [];

  hospitalId!: number;
  isToFilterByHospital: boolean = false;
  filterForm!: FormGroup

  specialityForm!: FormGroup;
  addSpecialityform!: FormGroup;
  isVisible = false;
  speciality: any;
  isToAddSpecialityToHospital = false;
  hospitals!: Hospital[];
  buttonText = 'Ajouter une spécialité à un hôpital';
  window = window;



  constructor(
    private apiService: ApiServiceService, 
    public autService:AuthService,
    private router: Router, 
    private authService: AuthService,
    private fb: FormBuilder, 
    private fileExport: FileExportService){}



  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getConnectedAdminHospital();
    this.getAllSpecialities();
    this.filterForm = this.fb.group({
      filterInput: [null, Validators.required]
    });

  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Spécialités").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_LIST_SPECIALITIES")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("CREATE_SPECIALITY")){
            this.canCreateSpeciality = true;
          }else{
            this.canCreateSpeciality = false;
          }
          if(permissionsCodeNames.includes("UPDATE_SPECIALITY")){
            this.canEditSpeciality = true;
          }else{
            this.canEditSpeciality = false;
          }
          if(permissionsCodeNames.includes("DELETE_SPECIALITY")){
            this.canDeleteSpeciality = true;
          }else{
            this.canDeleteSpeciality = false;
          }
          if(permissionsCodeNames.includes("ADD_SPECIALITY_TO_ANOTHER_HOSPITAL")){
            this.canAddSpecialityToAnotherHospital = true;
          }else{
            this.canAddSpecialityToAnotherHospital = false;
          }
          if(permissionsCodeNames.includes("ADD_SPECIALITY_TO_OWN_HOSPITAL")){
            this.canAddSpecialityToOwnHospital = true;
          }else{
            this.canAddSpecialityToOwnHospital = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }
  

  getConnectedAdminHospital(){
    this.apiService.getUserById(this.authService.userId).subscribe({
      next: (response) => {
        if(response.success){
          this.hospitalId = response.data.id;
          // this.getHospitalSpecialities(this.hospitalId);
        }
      },error: (err) => {
        console.log(err.message);
      }
    });
    

  }

  getAllSpecialities(){
    this.apiService.getDataSpecialities().subscribe({
      next: (data) => {
        this.listOfData = data;
      },error: (err) => {
        console.log(err.message);        
      }
    });
  }

  getHospitals(){
    this.apiService.getDataHospitals().subscribe({
      next: (data) => {
        this.hospitals = data;
      },error: (err) => {
        console.log(err.message);
      }
    })
  }


  getHospitalSpecialities(hospitalId: number){
    if(this.hospitalId){
      this.apiService.getSpecialitiesByHospital(this.hospitalId).subscribe({
        next: (data) => {
          if(data.success){
            this.listOfData = data.data;
          }          
        },error: (err) => {
          console.log(err.message);        
        }
      });
    }
  }


  initializeForm(){
    this.getHospitals();
    if(this.isToAddSpecialityToHospital){
      this.addSpecialityform = this.fb.group({
        hospital: [''],
        speciality: ['', Validators.required],
        price: ['', Validators.required], 
      });
      this.buttonText = 'Créer spécialité';
    }else{
      this.buttonText = 'Ajouter une spécialité à un hôpital';
      this.specialityForm = this.fb.group({
        name: ['', Validators.required],
      });
    }
  }

  patchForm(speciality: Speciality){
    this.specialityForm.patchValue({
      name: speciality.name
    });
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isToAddSpecialityToHospital=false;
    this.isVisible = false;
  }

  editSpeciality(existedSpeciality: Speciality){
    this.speciality = existedSpeciality;
    this.showModal()
    this.patchForm(existedSpeciality);
  }


  onSubmit() {
    if (this.specialityForm.valid) {
      const data = {
        name: this.specialityForm.value.name
      }
      if(this.speciality){
        this.apiService.updateSpeciality(this.speciality.id, data).subscribe({
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
              this.speciality = null;
              this.getAllSpecialities();
              this.router.navigateByUrl("/back-office/Administration/specialities");
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
        this.apiService.postSpeciality(data).subscribe({
          next: response => {
            if (response.success) {
              Swal.fire({
                title: 'Spécialité créée avec succès',
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.isVisible = false;
              this.getAllSpecialities();
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

  addSpeciality(){
    if (this.addSpecialityform.valid) {
      if(this.addSpecialityform.get('hospital')?.value == ''){
        this.addSpecialityform.get('hospital')?.setValue(this.hospitalId);
      }
      
       this.apiService.postAddSpecialityHospital(this.addSpecialityform.value.hospital, this.addSpecialityform.value.speciality, this.addSpecialityform.value.price).subscribe({
         next: response => {          
           if(response.success){
             Swal.fire({
               title: 'Spécialité ajoutée à l\'hôpital',
               text: '',
               icon: 'success',
               timer: 3500,
               showConfirmButton: false,
               timerProgressBar: true 
             });
             this.addSpecialityform.reset();
             this.isVisible = false;
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
         error:error=>{
           console.log(error);
         }
        })
   }
  }

  addSpecialityToHospital(){
    this.isToAddSpecialityToHospital = !this.isToAddSpecialityToHospital;
    this.initializeForm();
  }

  resetForm(event: Event){
    event.preventDefault();
    this.specialityForm.reset();
    this.addSpecialityform.reset();
  }


  onCurrentPageDataChange($event: readonly Speciality[]): void {
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


  filterSpecialities(){
    if(this.filterForm.controls['filterInput'].value == true){
      this.isToFilterByHospital = true
      this.getHospitalSpecialities(this.hospitalId);
    }else if(this.filterForm.controls['filterInput'].value == false){
      this.isToFilterByHospital = false;
      this.getAllSpecialities();
    }
  }


  exportToFile(){
    this.fileExport.exportToExcel('specialities', this.listOfData);
  }
  

  deleteSpeciality(specialityId: number){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer cette spécialité ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteSpeciality(specialityId).subscribe( response =>{
          Swal.fire({
            title: "Spécialité supprimée avec succès !",
            text: '',
            icon: 'success',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
          this.getAllSpecialities();
        });
      }
    });
  }

}
