import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Permission, Role, User } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';
import { FileExportService } from '../../../services/file-export.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit{
  listOfData!: Permission[];
  searchValue = "";
  filteredData!: Permission[]

  currentUserPermissions!: Permission[];
  canManageUserPermission = false;
  canManageRolePermission = false;
  canViewList = false;
  connectedUser!: User;

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


  constructor(private apiService: ApiServiceService, private router: Router, private fb: FormBuilder, private authService: AuthService, private fileExport: FileExportService){
    this.initializeForms();
  }

  initializeForms() {
    this.rolePermissionForm = this.fb.group({
      role: ['', Validators.required],
      permissions: [[], Validators.required]
    });
    
    this.userPermissionForm = this.fb.group({
      user: ['', Validators.required],
      permissions: [[], Validators.required]
    });
  }


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.getPermissions();
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
        this.filteredData = [...this.listOfData];
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
      next: (data: Role[]) => {
        let uroles: string[] = Array.isArray(this.authService.roles) ? this.authService.roles : [this.authService.roles];
        this.roles = data.filter(role => !uroles.includes(role.name)); // Filtrer pour enlever celui de l'utilisateur courant
      },error: (err) => {
        console.log(err.message);      
      }
    });
  }

  getUsers(){
    this.apiService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.filter(user => user.id != this.authService.userId);
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

  showModal(form: 'role' | 'user'): void {
    this.isRoleForm = form === 'role';
    this.isVisible = true;
    
    if (this.isRoleForm) {
      this.getRoles();
    } else {
      this.getUsers();
    }
  }


  loadPermissions() {
    const selectedEntity = this.isRoleForm 
    ? this.rolePermissionForm.get('role')?.value 
    : this.userPermissionForm.get('user')?.value;

    if (!selectedEntity) return;

    // Récupérer les permissions existantes de l'entité
    const existingPermissions = selectedEntity.permissions || [];
    const existingPermissionIds = new Set(existingPermissions.map((perm: Permission) => perm.id));

    // Formater la liste pour le transfert
    this.list = this.listOfData.map(permission => ({
      key: permission.id,
      title: permission.name,
      description: permission.codeName,
      // Déterminer la direction en fonction de si la permission existe déjà
      direction: existingPermissionIds.has(permission.id) ? 'right' : 'left'
    }));
  }



  handleCancel(): void {
    this.rolePermissionForm.reset();
    this.userPermissionForm.reset();
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

  exportFile(){
    this.fileExport.exportToExcel('permissions', this.listOfData);
  }

  
  private showError(message: string) {
    Swal.fire({
      title: message,
      icon: 'error',
      timer: 4000,
      showConfirmButton: false,
    });
  }

  onSearch(){
    const search = this.searchValue.toLowerCase();
    this.filteredData = this.listOfData.filter(data => 
      data.codeName.toLowerCase().includes(search) || 
      data.name.toLowerCase().includes(search) || 
      data.description.toLowerCase().includes(search)
    );
  }


  filterOption(inputValue: string, item: any): boolean {
    return item.description.indexOf(inputValue) > -1;
  }


  change(event: { from: string; list: TransferItem[]; to: string }): void {
    const selectedForm = this.isRoleForm ? this.rolePermissionForm : this.userPermissionForm;
    const selectedEntity = this.isRoleForm 
      ? selectedForm.get('role')?.value 
      : selectedForm.get('user')?.value;

    if (!selectedEntity) return;

    // Déterminer si on ajoute ou retire des permissions
    const isAdding = event.from === 'left' && event.to === 'right';
    const isRemoving = event.from === 'right' && event.to === 'left';

    const ids: number[] = event.list.map(item => item['key']);
    
    // event.list.forEach(item => {
      if (isAdding) {
        this.grantPermission(selectedEntity.id, ids);
      } else if (isRemoving) {
        this.removePermission(selectedEntity.id, ids);
      }
    // });

    // Mettre à jour la liste des permissions
    selectedForm.patchValue({ permissions: event.list });
  }


  grantPermission(entityId: number, permissionIds: number[]) {
    const apiMethod = this.isRoleForm 
      ? this.apiService.setPermissionToRole 
      : this.apiService.grantPermissionToUser;

    apiMethod.call(this.apiService, entityId, permissionIds).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessMessage('ajoutées');
          this.isVisible = false;
          this.getPermissions();
        } else {
          this.showErrorMessage(response.errorMessage);
        }
      },
      error: (err) => {
        console.log(err);
        
        this.showErrorMessage("Erreur lors de l'ajout de la permission")
      }
    });
  }

  removePermission(entityId: number, permissionIds: number[]) {
    const apiMethod = this.isRoleForm 
      ? this.apiService.removePermissionFromRole 
      : this.apiService.removeUserPermission;

    apiMethod.call(this.apiService, entityId, permissionIds).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessMessage('retirées');
          this.isVisible = false;
          this.getPermissions();
        } else {
          this.showErrorMessage(response.errorMessage);
        }
      },
      error: () => this.showErrorMessage("Erreur lors du retrait de la permission")
    });
  }

  private showSuccessMessage(action: string) {
    Swal.fire({
      title: `Permissions ${action} avec succès !`,
      icon: 'success',
      timer: 3500,
      showConfirmButton: false,
    });
  }

  private showErrorMessage(message: string) {
    Swal.fire({
      title: message,
      icon: 'error',
      timer: 4000,
      showConfirmButton: false,
    });
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


  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
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
