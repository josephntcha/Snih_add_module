import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FileExportService } from '../../../services/file-export.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  listOfData!: User[];
  isVisible = false;
  isVisible2 = false;
  permissionForm!:FormGroup<{
    user:FormControl<any>;
    permission:FormControl<any>;
  }>;
  retirerPermissionForm!:FormGroup;
  permissions:any;
  userPermissions:any;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();


  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  listOfCurrentPageData: readonly User[] = [];


  constructor(private apiService: ApiServiceService,public authService:AuthService, private router: Router, private fileExport: FileExportService,private formBuilder:FormBuilder){}

  showModal(): void {
    this.isVisible = true;
  }

  showModal2(): void {
    this.isVisible2 = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  ngOnInit(): void {
    this.getUsers();
    this.getPermissions();

    this.permissionForm=this.formBuilder.group({
      user:[null,Validators.required],
      permission:[null,Validators.required]
    });

    this.retirerPermissionForm=this.formBuilder.group({
      user:[null,Validators.required],
      permission:[[]]
    });

    this.retirerPermissionForm.get("user")?.valueChanges.subscribe(userSelected=>{
       this.apiService.getUserById(userSelected).subscribe(response=>{
        this.userPermissions=response.data.permissions;
       });
       
    })
  }

  onSubmitForm(){
    if(this.permissionForm.valid){
     for (let index = 0; index < this.permissionForm.get("permission")?.value.length; index++) {
      this.apiService.addPermissionsToUser(this.permissionForm.get("user")?.value,this.permissionForm.get("permission")?.value[index]).subscribe({
        next:(response)=>{
      console.log(response);
      
        },
        error:(err)=>{

        }
      })       
     }
        Swal.fire({
          text: 'Permission ajouté avec succès',
          icon: 'success',
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true 
        });
        
      this.isVisible = false;
    }    
  }

  onPermissionChange(event: Event, permissionId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentPermissions = this.retirerPermissionForm.get('permission')?.value || [];

    if (checked) {
      // Ajouter l'ID si la case est cochée
      this.retirerPermissionForm.get('permission')?.setValue([...currentPermissions, permissionId]);
    } else {
      // Retirer l'ID si la case est décochée
      this.retirerPermissionForm.get('permission')?.setValue(currentPermissions.filter((id: number) => id !== permissionId));
    }
  }

  isChecked(permissionId: number): boolean {
    return this.retirerPermissionForm.get('permission')?.value.includes(permissionId);
  }

  retirerPermissionSubmitForm(){
    console.log(this.retirerPermissionForm.value)
    if(this.retirerPermissionForm.valid){
    //  for (let index = 0; index < this.retirerPermissionForm.get("permission")?.value.length; index++) {
    //   this.apiService.removePermissionsToUser(this.retirerPermissionForm.get("user")?.value,this.retirerPermissionForm.get("permission")?.value[index]).subscribe({
    //     next:(response)=>{
    //   console.log(response);
      
    //     },
    //     error:(err)=>{

    //     }
    //   })       
    //  }
    //     Swal.fire({
    //       text: 'Permission retiré avec succès',
    //       icon: 'success',
    //       timer: 3500,
    //       showConfirmButton: false,
    //       timerProgressBar: true 
    //     });
        
    //   this.isVisible2 = false;
    }    
  }


  getUsers(){
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.listOfData = data;        
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

  getPermissions(){
    this.apiService.getPermissions().subscribe({
      next:(response)=>{
       this.permissions=response;
       
      },
      error:(err)=>{

      }
    })
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

  onCurrentPageDataChange($event: readonly User[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }


  editUser(userId: number){
    this.router.navigateByUrl("/back-office/Administration/users/" + userId);
  }


  exportFile(){
    this.fileExport.exportToExcel('users', this.listOfData);
  }


  manageUsers(userId: number, action: string){
    let label = action == "ACTIVATE" ? "activer" : "désactiver";
    Swal.fire({
      title: '',
      text: "Voulez-vous vraiment " + label + " cet compte utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.manageUser(userId, action).subscribe({
          next: (response) => {
            if(response.success){
              Swal.fire({
                title: "Opération effectué avec succès !",
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.getUsers();
              this.router.navigateByUrl("/Administration/users");
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
          },error: () => {
            Swal.fire({
              title: "Une erreur inconnue s'est produite, veuillez ressayer plus tard.",
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
