import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FileExportService } from '../../../services/file-export.service';
import { Permission, PublicDay } from '../../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-day',
  templateUrl: './public-day.component.html',
  styleUrl: './public-day.component.css'
})
export class PublicDayComponent implements OnInit{
  publicDayForm!:FormGroup;
  canViewList=false;
  canCreatePublicDay=false;
  canEditPublicDay=false;
  canDeletePublicDay=false;
  isVisible=false;
  publicDays:any;
  listOfData:readonly PublicDay[] = [];
  indeterminate = false;
  hospitalId:any;

  checked = false;

    listOfCurrentPageData:readonly PublicDay[] = [];
  
  setOfCheckedId = new Set<number>();
    constructor(private apiService: ApiServiceService,
                  private route: ActivatedRoute,
                  private exportService: FileExportService,
                  private authService: AuthService,
                  private formBuilder: FormBuilder){}


ngOnInit(): void {
  this.getConnectedUserPermissionsOnComponent();



    
}

getPublicDays(){
  this.apiService.getPublicDays().subscribe({
    next:response=>{
      this.listOfData = response; 
    },
    error:error=>{

    }
  })
}
 getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Bâtiments").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_LIST_PUBLICDAYS")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("CREATE_PUBLICDAYS")){
            this.canCreatePublicDay = true;
          }else{
            this.canCreatePublicDay = false;
          }
          if(permissionsCodeNames.includes("UPDATE_PUBLICDAYS")){
            this.canEditPublicDay = true;
          }else{
            this.canEditPublicDay = false;
          }
          if(permissionsCodeNames.includes("DELETE_PUBLICDAYS")){
            this.canDeletePublicDay = true;
          }else{
            this.canDeletePublicDay = false;
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

   initializeForm(){
      this.publicDayForm = this.formBuilder.group({
        date: ['', Validators.required],
      });
    }

  showModal(): void {
      this.isVisible = true;
      this.initializeForm();
    }
  
    resetForm(event: Event){
      event.preventDefault();
      this.publicDayForm.reset();
    }
    handleCancel(): void {
      this.isVisible = false;
    }

    onCurrentPageDataChange($event: readonly PublicDay[]): void {
        this.listOfCurrentPageData = $event;
        this.refreshCheckedStatus();
      }
    updateCheckedSet(id: number, checked: boolean): void {
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    }
    onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
    }
    onAllChecked(value: boolean): void {
      this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
      this.refreshCheckedStatus();
    }
  
    exportToFile(){
      this.exportService.exportToExcel('publicDays', this.listOfData);
    }
    refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
      this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }

     onSubmit() {
        if (this.publicDayForm.valid) {
            this.apiService.postPublicDays(this.hospitalId, this.publicDayForm.get('date')?.value) .subscribe({
              next: response => {
                if (response.success) {
                  Swal.fire({
                    title: 'Jour Férié créé avec succès',
                    text: '',
                    icon: 'success',
                    timer: 3500,
                    showConfirmButton: false,
                    timerProgressBar: true 
                  });
                  this.isVisible = false;
                  this.getPublicDays();
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
