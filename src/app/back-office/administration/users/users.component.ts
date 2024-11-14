import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FileExportService } from '../../../services/file-export.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  listOfData!: User[];

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


  constructor(private apiService: ApiServiceService, private router: Router, private fileExport: FileExportService){}


  ngOnInit(): void {
    this.getUsers();
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
