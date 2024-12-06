import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Permission, Role, User } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit{
  listOfData!: Permission[];

  currentUserPermissions!: Permission[];
  canManageUserPermission = false;
  canManageRolePermission = false;
  canViewList = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  isVisible = false;
  rolePermissionForm!: FormGroup;
  userPermissionForm!: FormGroup;
  isAdd = true;
  users: User[] = [];
  roles: Role[] = [];
  isRoleForm = false;

  list: TransferItem[] = [];
  selectedPermissions: number[] = [];


  constructor(private apiService: ApiServiceService, private router: Router, private fb: FormBuilder, private authService: AuthService){
    this.rolePermissionForm = this.fb.group({
      actionType: ['', Validators.required],
      role: ['', Validators.required],
      permissions: [[], Validators.required]
    });
    
    this.userPermissionForm = this.fb.group({
      actionType: ['', Validators.required],
      user: ['', Validators.required],
      permissions: [[], Validators.required]
    });
  }


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getPermissions()

    this.rolePermissionForm.get('permissions')?.valueChanges.subscribe(value => {
      this.selectedPermissions = value;
    });
    this.userPermissionForm.get('permissions')?.valueChanges.subscribe(value => {
      this.selectedPermissions = value;
    });
  }

  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Permissions").subscribe({
      next: (response) => {
        
        if(response.success){
          this.currentUserPermissions = response.data;
          const permissionsCodeNames = this.currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("MANAGE_USER_PERMISSION")){
            this.canManageUserPermission = true;
          }else{
            this.canManageUserPermission = false;
          }
          if(permissionsCodeNames.includes("MANAGE_ROLE_PERMISSION")){
            this.canManageRolePermission = true;
          }else{
            this.canManageRolePermission = false;
          }
          if(permissionsCodeNames.includes("VIEW_LIST_PERMISSIONS")){
            this.canViewList = true;
          }else{
            this.canViewList = false;
          }
        }else{
          this.currentUserPermissions = [];
        }
      },error: (err) => {
        this.currentUserPermissions = [];
        console.log(err.message);        
      }
    })
  }


  getPermissions(){
    this.apiService.getAllPermissions().subscribe({
      next: (data) => {
        this.listOfData = data;
        this.formTransfertlist(this.listOfData);
      },error: (err) => {
        console.log(err.message);      
      }
    });
  }

  formTransfertlist(data: Permission[], excludePermissions: Permission[] = []){
    const excludeIds = excludePermissions.map(perm => perm.id);
    this.list = data
      .filter(permission => !excludeIds.includes(permission.id))
      .map(permission => ({
        key: permission.id,
        title: permission.name,
        description: permission.codeName,
        disabled: false
      }));
  }

  getRoles(){
    this.apiService.getRights().subscribe({
      next: (data) => {
        this.roles = data;
      },error: (err) => {
        console.log(err.message);      
      }
    });
  }

  getUsers(){
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;    
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

  showModal(form: 'role' | 'user'): void {
    this.isVisible = true;
    if(form === 'role'){
      this.getRoles();
      this.isRoleForm = true;
    }else if(form === 'user'){
      this.getUsers();
      this.isRoleForm = false;
    }
    
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getRolePermissions() {
    const selectedRole = this.rolePermissionForm.get('role')?.value;
    if (!selectedRole) return;
  
    if (this.rolePermissionForm.get('actionType')?.value === 'add') {
      this.formTransfertlist(this.listOfData, selectedRole.permissions || []);
    } else {
      // this.list = selectedRole.permissions || [];
      this.formTransfertlist(selectedRole.permissions || []);
    }
  }
  
  getUserPermissions() {
    const selectedUser = this.userPermissionForm.get('user')?.value;
    if (!selectedUser) return;
  
    if (this.userPermissionForm.get('actionType')?.value === 'add') {
      this.formTransfertlist(this.listOfData, selectedUser.permissions || []);
    } else {
      this.formTransfertlist(selectedUser.permissions || []);
    }
  }
  
  chooseActionType() {
    const roleActionType = this.rolePermissionForm.get('actionType')?.value;
    const userActionType = this.userPermissionForm.get('actionType')?.value;
  
    if (this.isRoleForm) {
      this.isAdd = roleActionType === 'add';
      this.getRolePermissions();
    } else {
      this.isAdd = userActionType === 'add';
      this.getUserPermissions();
    }
  }


  onSubmit(){
    if(this.isAdd){
      if(this.rolePermissionForm.valid){        
        const roleId = this.rolePermissionForm.get('role')?.value.id
        const formPermissions = this.rolePermissionForm.get('permissions')?.value;
        
        for(let permission of formPermissions){
          this.apiService.setPermissionToRole(roleId, permission.key).subscribe({
            next: (response) => {
              if(response.success){
                Swal.fire({
                  title: "Permissions données avec succès !",
                  text: '',
                  icon: 'success',
                  timer: 3500,
                  showConfirmButton: false,
                  timerProgressBar: true 
                });
                this.rolePermissionForm.reset();
                this.list = []; //vider complètement les deux listes
                this.formTransfertlist(this.listOfData);
                this.isVisible = false;
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
              Swal.fire({
                title: "Une erreur inconnue s'est produite !",
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          });
        }
      }else if(this.userPermissionForm.valid){
        const userId = this.userPermissionForm.get('user')?.value.id;
        const formPermissions = this.userPermissionForm.get('permissions')?.value;
        for(let permission of formPermissions){
          this.apiService.grantPermissionToUser(userId, permission.key).subscribe({
            next: (response) => {
              if(response.success){
                Swal.fire({
                  title: "Permissions données avec succès !",
                  text: '',
                  icon: 'success',
                  timer: 3500,
                  showConfirmButton: false,
                  timerProgressBar: true 
                });
                this.userPermissionForm.reset();
                this.list = [];
                this.formTransfertlist(this.listOfData);
                this.isVisible = false;
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
              Swal.fire({
                title: "Une erreur inconnue s'est produite !",
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          });
        }
      }
    }else if(!this.isAdd){
      if(this.rolePermissionForm.valid){
        const roleId = this.rolePermissionForm.get('role')?.value.id;
        const formPermissions = this.rolePermissionForm.get('permissions')?.value;
        for(let permission of formPermissions){
          this.apiService.removePermissionFromRole(roleId, permission.key).subscribe({
            next: (response) => {
              if(response.success){
                Swal.fire({
                  title: "Permissions retirées avec succès !",
                  text: '',
                  icon: 'success',
                  timer: 3500,
                  showConfirmButton: false,
                  timerProgressBar: true 
                });
                this.rolePermissionForm.reset();
                this.list = [];
                this.formTransfertlist(this.listOfData);
                this.isVisible = false;
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
              Swal.fire({
                title: "Une erreur inconnue s'est produite !",
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          });
        }
      }else if(this.userPermissionForm.valid){
        const userId = this.userPermissionForm.get('user')?.value.id;
        const formPermissions = this.userPermissionForm.get('permissions')?.value;
        for(let permission of formPermissions){
          this.apiService.removeUserPermission(userId, permission.key).subscribe({
            next: (response) => {
              if(response.success){
                Swal.fire({
                  title: "Permissions retirées avec succès !",
                  text: '',
                  icon: 'success',
                  timer: 3500,
                  showConfirmButton: false,
                  timerProgressBar: true 
                });
                this.userPermissionForm.reset();
                this.list = [];
                this.formTransfertlist(this.listOfData);
                this.isVisible = false;
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
              Swal.fire({
                title: "Une erreur inconnue s'est produite !",
                text: '',
                icon: 'error',
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          });
        }
      }
    }
    
  }


  filterOption(inputValue: string, item: any): boolean {
    return item.description.indexOf(inputValue) > -1;
  }


  change(event: { from: string; list: TransferItem[]; to: string }): void {
    const selectedPermissions = event.list.filter(item => item.direction === 'right');
    if (this.isRoleForm) {
      this.rolePermissionForm.patchValue({ permissions: selectedPermissions });
    } else {
      this.userPermissionForm.patchValue({ permissions: selectedPermissions });
    }
  }

  search(ret: {value: string}): void {
    const {value} = ret;
    this.list = this.list.map(item => ({
      ...item,
      hide: !item.title.toLowerCase().includes(value.toLowerCase())
    }));
  }


  resetForm(event: Event, form: FormGroup){
    event.preventDefault();
    this.selectedPermissions = [];

    this.list = []; //vider complètement les deux listes
    this.formTransfertlist(this.listOfData); //recharger celle avec toutes les permissions
    
    if (form) {
      form.reset();
      form.patchValue({
        actionType: '',
        role: '',
        user: '',
        permissions: []
      });
    }
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

}
