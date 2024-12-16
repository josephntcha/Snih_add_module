import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Building, Permission } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FileExportService } from '../../../services/file-export.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.css'
})
export class BuildingsComponent implements OnInit{
  listOfData!: Building[];
  hospitalId!: number;
  canViewList = false;
  canCreateBuilding = false;
  canEditBuilding = false;
  canDeleteBuilding = false;
  canViewRooms = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly Building[] = [];

  isVisible = false;
  buildingForm!: FormGroup;
  building: any;


  constructor(private apiService: ApiServiceService, 
              private router: Router, 
              public authService: AuthService,
              private exportService: FileExportService,
              private fb: FormBuilder){}


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getBuildings()
  }


  getBuildings(){
    this.apiService.getUserById(this.authService.userId).subscribe({
      next: (response) => {
        if(response.success){
          const hospitalId = response.data.hospital.id;
          if(hospitalId){
            this.apiService.getBuildings(hospitalId).subscribe({
              next: (data) => {
                this.listOfData = data;
              },error: (err) => {
                console.log(err.message);      
              }
            });
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    });
    
  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Bâtiments").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_LIST_BUILDINGS")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("CREATE_BUILDING")){
            this.canCreateBuilding = true;
          }else{
            this.canCreateBuilding = false;
          }
          if(permissionsCodeNames.includes("UPDATE_BUILDING")){
            this.canEditBuilding = true;
          }else{
            this.canEditBuilding = false;
          }
          if(permissionsCodeNames.includes("DELETE_BUILDING")){
            this.canDeleteBuilding = true;
          }else{
            this.canDeleteBuilding = false;
          }
          if(permissionsCodeNames.includes("VIEW_LIST_ROOMS")){
            this.canViewRooms = true;
          }else{
            this.canViewRooms = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  onCurrentPageDataChange($event: readonly Building[]): void {
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

  editBuilding(existbuilding: Building){
    this.building = existbuilding;
    this.showModal();
    this.patchForm(existbuilding);
  }

  viewRooms(buildingId: number){
    this.router.navigateByUrl(`/back-office/settings/buildings/${buildingId}/rooms`);
  }


  exportToFile(){
    this.exportService.exportToExcel("buildings", this.listOfData);
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  initializeForm(){
    this.buildingForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  patchForm(building: Building){
    this.buildingForm.patchValue({
      name: building.name
    });
  }


  onSubmit(){
    if(this.buildingForm.valid){
      const data = {
        name: this.buildingForm.value.name
      };
      if(this.building){
        this.apiService.updateBuilding(this.building.id, data).subscribe({
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
              this.building = null;
              this.getBuildings()
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
        });
      }else{
        this.apiService.getUserById(this.authService.userId).subscribe({
          next: (response) => {
            if(response.success){
              const hospitalId = response.data.hospital.id;
              this.apiService.postBuilding(hospitalId, data).subscribe({
                next: (response) => {
                  if(response.success){
                    Swal.fire({
                      title: "Bâtiment créé avec succès !",
                      text: '',
                      icon: 'success',
                      timer: 3500,
                      showConfirmButton: false,
                      timerProgressBar: true 
                    });
                    this.isVisible = false;
                    this.getBuildings()
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
            }
          }
        });
      }
    }
  }

  deleteBuilding(roleId: number){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer ce bâtiment ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteBuilding(roleId).subscribe({
          next: () => {
            Swal.fire({
              title: "Bâtiment supprimé avec succès !",
              text: '',
              icon: 'success',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
          },error: () => {
            Swal.fire({
              title: "Une erreur inconnue s'est produite, veuillez ressayer plus tard",
              text: '',
              icon: 'error',
              timer: 4000,
              showConfirmButton: false,
              timerProgressBar: true 
            });
          }
        });
      }
    });
  }

  resetForm(event: Event){
    event.preventDefault();
    this.buildingForm.reset();
  }

}
