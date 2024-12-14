import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import { FileExportService } from '../../../services/file-export.service';
import { Analysis, Permission, TypeConstant } from '../../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent implements OnInit{
  analysisForm!:FormGroup;
  analysis!:TypeConstant[];
  analysi:any;
  canViewList = false;
  canCreateConstant = false;
  canEditConstant = false;
 isVisible=false;
 checked = false;
 indeterminate = false;
 setOfCheckedId = new Set<number>();

  constructor( private apiService: ApiServiceService,
    private router: Router, 
    private fb: FormBuilder,
    private fileExport: FileExportService,
    private authService: AuthService){}

  ngOnInit(): void {
       this.analysisForm=this.fb.group({
        name:["",Validators.required]
      });
      this.getConnectedUserPermissionsOnComponent()
      this.getAnalysis()
  }
  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Analyses").subscribe({
      next: (response) => {
        console.log(response.data);
        
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_LIST_TYPE_ANALYSIS")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("CREATE_TYPE_ANALYSIS")){
            this.canCreateConstant = true;
          }else{
            this.canCreateConstant = false;
          }
          if(permissionsCodeNames.includes("EDIT_TYPE_ANALYSIS")){
            this.canEditConstant = true;
          }else{
            this.canEditConstant = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }

  getAnalysis(){
    this.apiService.getAnalysis().subscribe({
      next:response=>{
        this.analysis=response   
      },
      error:error=>{
        console.log(error);
        
      }
    })
  }

  initializeForm(){
    this.analysisForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  exportToFile(){
    this.fileExport.exportToExcel('constantes', this.analysis);
  }

showModal(): void {
  this.isVisible = true;
  this.initializeForm();
}

handleCancel(): void {
  this.isVisible = false;
}

editHospital(existedanalysi: TypeConstant){
  this.analysi = existedanalysi;
  this.showModal()
  this.patchForm(existedanalysi);
}

patchForm(analysi: Analysis){
  this.analysisForm.patchValue({
    name: analysi.name
  });
}

resetForm(event: Event){
  event.preventDefault();
  this.analysisForm.reset();
}
refreshCheckedStatus(): void {
  if(!this.analysis) return;
  const listOfEnabledData = this.analysis.filter(({ id }) => !this.setOfCheckedId.has(id));
  this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
  this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
}

onAllChecked(checked: boolean): void {
  this.analysis
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

onItemChecked(id: number, checked: boolean): void {
  this.updateCheckedSet(id, checked);
  this.refreshCheckedStatus();
}

onSubmit() {
  if (this.analysisForm.valid) {
    const data = {
      name: this.analysisForm.value.name
    }
    if(this.analysi){
      this.apiService.updateAnalysis(this.analysi.id, data).subscribe({
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
            this.analysi = null;
            this.getAnalysis()
            this.router.navigateByUrl("/Administration/analysis");
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
      this.apiService.postAnalysis(data).subscribe({
        next: response => {
          if (response.success) {
            Swal.fire({
              title: 'Constante créé avec succès',
              text: '',
              icon: 'success',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
            this.isVisible = false;
            this.getAnalysis()
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



}
