import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import { FileExportService } from '../../../services/file-export.service';
import { Constant, Permission, TypeConstant } from '../../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-constante',
  templateUrl: './constante.component.html',
  styleUrl: './constante.component.css'
})
export class ConstanteComponent implements OnInit{
    constantForm!:FormGroup;
    constants!:TypeConstant[];
    constant:any;
    canViewList = false;
    canCreateConstant = false;
    canEditConstant = false;
    isVisible=false;
    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<number>();
    window = window;

    constructor( private apiService: ApiServiceService,
                private router: Router, 
                private fb: FormBuilder,
                private fileExport: FileExportService,
                private authService: AuthService){}

    ngOnInit(): void {
      this.constantForm=this.fb.group({
        name:["",Validators.required],
        unit:["",Validators.required]
      });
      this.getConnectedUserPermissionsOnComponent();
      this.getConstants();
    }

    getConnectedUserPermissionsOnComponent(){
      this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Constantes").subscribe({
        next: (response) => {
          if(response.success){
            const currentUserPermissions: Permission[] = response.data;
            const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
            
            if(permissionsCodeNames.includes("VIEW_LIST_CONSTANT")){
              this.canViewList = true;
            }else{
              this.canViewList = false;
            }
            if(permissionsCodeNames.includes("CREATE_CONSTANT")){
              this.canCreateConstant = true;
            }else{
              this.canCreateConstant = false;
            }
            if(permissionsCodeNames.includes("UPDATE_CONSTANT")){
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

    getConstants(){
      this.apiService.getConstantes().subscribe({
        next:response=>{
          this.constants=response   
        },
        error:error=>{
          console.log(error);
          
        }
      })
    }

    initializeForm(){
      this.constantForm = this.fb.group({
        name: ['', Validators.required],
        unit: ['', Validators.required]
      });
    }

    exportToFile(){
      this.fileExport.exportToExcel('constantes', this.constants);
    }

  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  editHospital(existedConstant: TypeConstant){
    this.constant = existedConstant;
    this.showModal()
    this.patchForm(existedConstant);
  }

  patchForm(constant: TypeConstant){
    this.constantForm.patchValue({
      name: constant.name,
      unit: constant.unit
    });
  }

  resetForm(event: Event){
    event.preventDefault();
    this.constantForm.reset();
  }
  refreshCheckedStatus(): void {
    if(!this.constants) return;
    const listOfEnabledData = this.constants.filter(({ id }) => !this.setOfCheckedId.has(id));
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.constants
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
    if (this.constantForm.valid) {
      const data = {
        name: this.constantForm.value.name,
        unit: this.constantForm.value.unit
      }
      if(this.constant){
        this.apiService.updateConstantes(this.constant.id, data).subscribe({
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
              this.constant = null;
              this.getConstants()
              this.router.navigateByUrl("/Administration/constant");
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
        this.apiService.postConstantes(data).subscribe({
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
              this.getConstants()
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
