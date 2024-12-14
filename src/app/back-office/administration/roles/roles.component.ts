import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Permission, Role, User } from '../../../models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  listOfData!: Role[];
  canViewList = false;
  canCreateRole = false;
  canEditeRole = false;
  canDeleteRole = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  isVisible = false;
  roleForm!: FormGroup;
  manageRoleForm!: FormGroup;
  role: any
  roleId!: number;
  isToCreate = true;
  isToAssign = true;
  roles!: Role[];
  users!: User[];
  selectedUser!: User;


  constructor(private apiService: ApiServiceService, private router: Router, private fb: FormBuilder, private authService: AuthService){}


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getRoles()
  }


  getRoles(){
    this.apiService.getRights().subscribe({
      next: (data) => {
        this.listOfData = data;
        if(this.selectedUser != undefined && this.selectedUser.roles != undefined){
          this.roles = this.isToAssign ? this.listOfData
            .filter(role => !this.selectedUser.roles.some(userRole => userRole.id === role.id)) : this.selectedUser.roles ;
        }else{
          this.roles = this.listOfData;
        }
      },error: (err) => {
        console.log(err.message);   
      }
    });
  }

  getStaff(){
    this.apiService.getStaff(this.authService.userId).subscribe({
      next: (data: User[]) => {
        this.users = data.filter(staff => staff.id != this.authService.userId);
      },error: (err) => {
        console.log(err.message);      
      }
    });
  }

  chooseUser(){
    this.selectedUser = this.manageRoleForm.controls['user'].value;
    this.getRoles();
  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Rôles").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("CREATE_ROLE")){
            this.canCreateRole = true;
          }else{
            this.canCreateRole = false;
          }
          if(permissionsCodeNames.includes("VIEW_LIST_ROLES")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
          if(permissionsCodeNames.includes("UPDATE_ROLE")){
            this.canEditeRole = true;
          }else{
            this.canEditeRole = false;
          }
          if(permissionsCodeNames.includes("DELETE_ROLE")){
            this.canDeleteRole = true;
          }else{
            this.canDeleteRole = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  initializeForm(form: 'roleForm' | 'manageRoleForm'){
    if(form === 'roleForm'){
      this.roleForm = this.fb.group({
        name: ['', Validators.required]
      });
    }else{
      this.manageRoleForm = this.fb.group({
        role: ['', Validators.required],
        user: ['', Validators.required]
      });
    }
  }
   

  patchForm(role: Role){
    this.roleForm.patchValue({
      name: role.name
    })
  }

  editRole(existedRole: Role){
    this.role = existedRole
    this.showModal('roleForm')
    this.patchForm(existedRole);
  }

  showModal(form: 'roleForm' | 'manageRoleForm', action: string | null = null): void {
    this.isToCreate = form === 'roleForm';
    this.isToAssign = action === 'assign';
    if(!this.isToCreate){
      this.getStaff();
    }
    this.initializeForm(form);
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  onSubmit(){
    if (this.isToCreate && this.roleForm.valid) {
      const data = {
        name: this.roleForm.value.name
      }
      if(this.role){
        this.apiService.updateRole(this.role.id, data).subscribe({
          next: (response) => {
            if(response.success){
              this.showNotification('success', "information mise à jour avec succès !");
              this.isVisible = false;
              this.role = null;
              this.getRoles()
            }else{
              this.showNotification('error', response.errorMessage);
            }
          },error: (err) => {
            this.showNotification('error', 'Une erreur inconnue s\'est produite, veuillez ressayer');    
          }
        })
      }else{
        this.apiService.saveRole(data) .subscribe({
          next: response => {
            if (response.success) {
              this.showNotification('success', 'Rôle créé avec succès');
              this.isVisible = false;
              this.getRoles();
            }else{
              this.showNotification('error', response.errorMessage);
            }
          },
          error:error=>{
            this.showNotification('error', 'Une erreur inconnue s\'est produite, veuillez ressayer');
          }
        });
      }
    }else if(this.manageRoleForm.valid){
      if(this.isToAssign){
        this.apiService.assignRoleToUser(this.manageRoleForm.value.role, this.manageRoleForm.value.user.id).subscribe({
          next: response => {
            if(response.success){
              this.showNotification('success', 'Rôle assigné avec succès');
              this.manageRoleForm.reset();
              this.isVisible = false;
            }else{
              this.showNotification('error', response.errorMessage);
            }
          },error: () => {
            this.showNotification('error', 'Une erreur inconnue s\'est produite, veuillez ressayer');
          }
        });
      }else{
        this.apiService.substractUserFromRole(this.manageRoleForm.value.role, this.manageRoleForm.value.user.id).subscribe({
          next: response => {
            if(response.success){
              this.showNotification('success', 'Rôle soustrait avec succès');
              this.manageRoleForm.reset();
              this.isVisible = false;
            }else{
              this.showNotification('error', response.errorMessage);
            }
          },error: () => {
            this.showNotification('error', 'Une erreur inconnue s\'est produite, veuillez ressayer');
          }
        });
      }
    }
  }

  showNotification(icon: 'success' | 'error', title: string) {
    Swal.fire({
      title,
      text: '',
      icon,
      timer: icon === 'success' ? 3500 : 4500,
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

  resetForm(event: Event, form: FormGroup){
    event.preventDefault();
    form.reset();
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
