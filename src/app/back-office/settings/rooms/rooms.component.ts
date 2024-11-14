import { Component, OnInit } from '@angular/core';
import { Room } from '../../../models/model';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute } from '@angular/router';
import { FileExportService } from '../../../services/file-export.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit{
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Room[] = [];
  listOfData: readonly Room[] = [];
  setOfCheckedId = new Set<number>();

  buildingId!: number;
  roomRorm!: FormGroup;

  isVisible = false;
  room: any


  constructor(private apiService: ApiServiceService,
              private route: ActivatedRoute,
              private exportService: FileExportService,
              private authService: AuthService,
              private formBuilder: FormBuilder){}


  ngOnInit(): void {
    this.buildingId = this.route.snapshot.params['buildingId'];
    this.getRooms();
  }


  getRooms(){
    if(this.buildingId){
      this.apiService.getRooms(this.buildingId).subscribe({
        next: (data) => {
          this.listOfData = data;          
        },error: (err) => {
          console.log(err.message);      
        }
      });
    }
  }

  

  initializeForm(){
    this.roomRorm = this.formBuilder.group({
      room: ['', Validators.required],
    });
  }

  patchForm(room: Room){
    this.roomRorm.patchValue({
      room: room.room
    });
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  editRoom(existedRoom: Room){
    this.room = existedRoom;
    this.showModal()
    this.patchForm(existedRoom);
  }


  exportToFile(){
    this.exportService.exportToExcel('rooms', this.listOfData);
  }


  onSubmit() {
    if (this.roomRorm.valid) {
      const data = {
        room: this.roomRorm.value.room
      }
      if(this.room){
        this.apiService.updateRoom(this.room.id, data).subscribe({
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
              this.room = null;
              this.getRooms()
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
        this.apiService.postRoom(this.buildingId, data) .subscribe({
          next: response => {
            if (response.success) {
              Swal.fire({
                title: 'Salle créée avec succès',
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.isVisible = false;
              this.getRooms();
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
    this.roomRorm.reset();
  }



  deleteRoom(roomId: number){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer cette salle ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteRoom(roomId).subscribe({
          next: () => {
            Swal.fire({
              title: "Salle supprimée avec succès !",
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

  onCurrentPageDataChange($event: readonly Room[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

}
