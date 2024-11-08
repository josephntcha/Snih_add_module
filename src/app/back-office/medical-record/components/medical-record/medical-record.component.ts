import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../../services/api-service.service';
import { FileExportService } from '../../../../core/services/file-export.service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.css'
})
export class MedicalRecordComponent implements OnInit{
  patientId: any;
  patients: any;
  medicalRecords: any
  searcbForm!: FormGroup;
  recordForm!: FormGroup;
  isByCode = true;
  listOfData!: any[];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly any[] = [];

  isVisible = false;


  constructor(private route: ActivatedRoute, private apiService: ApiServiceService, private fb: FormBuilder, private router: Router, private exportService: FileExportService){}
  
 
  ngOnInit(): void {
    this.initializeForm(this.searcbForm);

    // this.patientId = this.route.snapshot.params["patientId"];
    
    // this.apiService.getPatientMedicalRecord(this.patientId).subscribe({
    //   next: (data) => {
    //     if(data.success){
    //       this.dossier = data.data;
    //     }else{
    //       Swal.fire({
    //         title: 'Erreur',
    //         text: data.errorMessage,
    //         icon: 'error',
    //         timer: 4000,
    //         showConfirmButton: false,
    //         timerProgressBar: true
    //       });
    //       this.router.navigateByUrl("/search-medical-record");
    //     }
    //   },error: () => {
    //     this.router.navigateByUrl("/search-medical-record");
    //   }
    // });
  }


  initializeForm(form: FormGroup){
    if(form == this.searcbForm){
      this.searcbForm = this.fb.group({
        firstName: [null],
        lastName: [null],
        code: [null]
      });
    }else{
      this.recordForm = this.fb.group({
        patientId: [null],
      });
    }
  }


  getPatients(){
    this.apiService.getDataPatient().subscribe({
      next: (data) => {
        this.patients = data;
      },error: (err) => {
        console.log(err.message);
      }
    });
  }

  chooseSearchMode(){
    this.isByCode = ! this.isByCode;
  }


  onSubmitSearchForm(){
    this.apiService.searchMedicalRecord(this.searcbForm.value.firstName, this.searcbForm.value.lastName).subscribe({
      next: (data) => {
        if(data.length != 0){
          this.medicalRecords = data;
        }else{
          Swal.fire({
            title: 'Aucun dossier trouvé',
            text: "Aucun résultat ne correspond à votre recherche",
            icon: 'warning',
            timer: 6000,
            showConfirmButton: false,
            timerProgressBar: true
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createRecord(){
    this.getPatients();
    this.showModal()
  }


  addInfoMedRecord(medicalRecordId: number) {
    this.router.navigateByUrl("/create-info-medical-record/" + medicalRecordId);
  }


  consulter(medicalRecordId: number){
    this.router.navigateByUrl("/medical-record-details/" + medicalRecordId);
  }
  
  addConstant(medicalRecordId: number){
    this.router.navigateByUrl("/add-constant/" + medicalRecordId);
  }

  addAnalisis(medicalRecordId: number){
    this.router.navigateByUrl("/add-analysis-result/" + medicalRecordId);
  }


  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
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

  // editBuilding(existbuilding: any){
  //   this.building = existbuilding;
  //   this.showModal();
  //   this.patchForm(existbuilding);
  // }

  viewRooms(buildingId: number){
    this.router.navigateByUrl(`/Administration/buildings/${buildingId}/rooms`);
  }


  exportToFile(){
    this.exportService.exportToExcel("buildings", this.listOfData);
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm(this.recordForm);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // patchForm(building: any){
  //   this.buildingForm.patchValue({
  //     name: building.name
  //   });
  // }


  onSubmit(){
  //   if(this.buildingForm.valid){
  //     const data = {
  //       name: this.buildingForm.value.name
  //     };
  //     if(this.building){
  //       this.apiService.updateBuilding(this.building.id, data).subscribe({
  //         next: (response) => {
  //           if(response.success){
  //             Swal.fire({
  //               title: "information mise à jour avec succès !",
  //               text: '',
  //               icon: 'success',
  //               timer: 3500,
  //               showConfirmButton: false,
  //               timerProgressBar: true 
  //             });
  //             this.isVisible = false;
  //             this.building = null;
  //             this.getBuildings()
  //           }else{
  //             Swal.fire({
  //               title: response.errorMessage,
  //               text: '',
  //               icon: 'error',
  //               timer: 4000,
  //               showConfirmButton: false,
  //               timerProgressBar: true 
  //             });
  //           }
  //         },error: (err) => {
  //           console.log(err.message);            
  //         }
  //       });
  //     }else{
  //       this.apiService.getUserById(this.authService.userId).subscribe({
  //         next: (response) => {
  //           if(response.success){
  //             const hospitalId = response.data.hospital.id;
  //             this.apiService.postBuilding(hospitalId, data).subscribe({
  //               next: (response) => {
  //                 if(response.success){
  //                   Swal.fire({
  //                     title: "Bâtiment créé avec succès !",
  //                     text: '',
  //                     icon: 'success',
  //                     timer: 3500,
  //                     showConfirmButton: false,
  //                     timerProgressBar: true 
  //                   });
  //                   this.isVisible = false;
  //                   this.getBuildings()
  //                 }else{
  //                   Swal.fire({
  //                     title: response.errorMessage,
  //                     text: '',
  //                     icon: 'error',
  //                     timer: 4000,
  //                     showConfirmButton: false,
  //                     timerProgressBar: true 
  //                   });
  //                 }
  //               },error: (err) => {
  //                 console.log(err.message);                
  //               }
  //             })
  //           }
  //         }
  //       });
  //     }
  //   }
  // }

  // deleteBuilding(roleId: number){
  //   Swal.fire({
  //     title: 'Suppression',
  //     text: "Voulez-vous vraiment supprimer ce bâtiment ?",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Confirmer!',
  //     cancelButtonText: 'Annuler'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.apiService.deleteBuilding(roleId).subscribe({
  //         next: () => {
  //           Swal.fire({
  //             title: "Bâtiment supprimé avec succès !",
  //             text: '',
  //             icon: 'success',
  //             timer: 3500,
  //             showConfirmButton: false,
  //             timerProgressBar: true 
  //           });
  //         },error: () => {
  //           Swal.fire({
  //             title: "Une erreur inconnue s'est produite, veuillez ressayer plus tard",
  //             text: '',
  //             icon: 'error',
  //             timer: 4000,
  //             showConfirmButton: false,
  //             timerProgressBar: true 
  //           });
  //         }
  //       });
  //     }
  //   });
  }

  resetForm(event: Event){
    event.preventDefault();
    this.searcbForm.reset();
  }

}
