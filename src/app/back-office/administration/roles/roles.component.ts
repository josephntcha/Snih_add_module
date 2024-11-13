import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Role } from '../../../models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  listOfData!: Role[];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  isVisible = false;
  roleForm!: FormGroup;
  role: any
  roleId!: number;


  constructor(private apiService: ApiServiceService, private router: Router, private fb: FormBuilder){}


  ngOnInit(): void {
    this.getRoles()
  }


  getRoles(){
    this.apiService.getRights().subscribe({
      next: (data) => {
        this.listOfData = data;
      },error: (err) => {
        console.log(err.message);      
      }
    });
  }

  initializeForm(){
    this.roleForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  patchForm(role: Role){
    this.roleForm.patchValue({
      name: role.name
    })
  }

  editRole(existedRole: Role){
    this.role = existedRole
    this.showModal()
    this.patchForm(existedRole);
  }

  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  onSubmit(){
    if (this.roleForm.valid) {
      const data = {
        name: this.roleForm.value.name
      }
      if(this.role){
        this.apiService.updateRole(this.role.id, data).subscribe({
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
              this.role = null;
              this.getRoles()
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
        this.apiService.saveRole(data) .subscribe({
          next: response => {
            if (response.success) {
              Swal.fire({
                title: 'Rôle créé avec succès',
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.isVisible = false;
              this.getRoles();
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
    this.roleForm.reset();
  }


  onCurrentPageDataChange(listOfCurrentPageData: readonly Role[]): void {
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

  deleteRole(roleId: number){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer ce rôle ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteRole(roleId).subscribe({
          next: () => {
            Swal.fire({
              title: "Rôle supprimé avec succès !",
              text: '',
              icon: 'success',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
            this.getRoles();
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

}
