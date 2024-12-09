import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../../services/api-service.service';
import { FileExportService } from '../../../services/file-export.service';
import { InfoMedicalRecord, Permission, TypeConstant } from '../../../models/model';
import { MedicalRecordConstantsModalComponent } from '../medical-record-constants-modal/medical-record-constants-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MedicalRecordAnalyseResultsModalComponent } from '../medical-record-analyse-results-modal/medical-record-analyse-results-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.css'
})
export class MedicalRecordComponent implements OnInit{
  patientId: any;
  patients: any;
  searcbForm!: FormGroup;
  recordForm!: FormGroup;
  selectForm!: FormGroup;
  isByCode = true;
  newRecord = false;
  listOfData!: any[];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly any[] = [];
  isVisible = false;

  recordId: any
  typeConstants: TypeConstant[] = [];
  allTypeConstants: TypeConstant[] = [];

  canViewListRecords = false;
  canViewRecord = false;
  canSearchRecords = false;
  canAddAnalyses = false;
  canAddConstants = false;
  canFillRecord = false;
  canCreateRecord = false;

  constructor(private route: ActivatedRoute, 
              private apiService: ApiServiceService, 
              private fb: FormBuilder, 
              private router: Router, 
              private exportService: FileExportService,
              private modalService: NzModalService,
              private authService: AuthService){}
  
 
  ngOnInit(): void {
    this.initializeForm(this.searcbForm);
    this.selectForm = this.fb.group({
      searchMode: ['', Validators.required]
    });
  }


  initializeForm(form: FormGroup){
    if(form == this.searcbForm){
      if(this.isByCode){
        this.searcbForm = this.fb.group({
          code: [null, Validators.required]
        });
      }else{
        this.searcbForm = this.fb.group({
          firstName: [null, Validators.required],
          lastName: [null, Validators.required]
        });
      }
    }else{
      this.recordForm = this.fb.group({
        patientId: [null, Validators.required],
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
    if(this.selectForm.controls['searchMode'].value === true){
      this.isByCode = true;
      this.initializeForm(this.searcbForm);
    }else if(this.selectForm.controls['searchMode'].value === false){
      this.isByCode = false;
      this.initializeForm(this.searcbForm);
    }
  }


  onSubmitSearchForm(){
    if(this.isByCode){
      this.apiService.searchMedicalRecordByCode(this.searcbForm.value.code).subscribe({
        next: (data) => {
          if(data.success){
            this.listOfData = [data.data];            
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
    }else{
      this.apiService.searchMedicalRecord(this.searcbForm.value.firstName, this.searcbForm.value.lastName).subscribe({
        next: (data) => {
          if(data.length != 0){
            this.listOfData = data;
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
    
  }

  createRecord(){
    this.newRecord = true;
    this.getPatients();
    this.showModal()
  }


  addInfoMedRecord(medicalRecordId: number) {
    this.router.navigateByUrl("/back-office/medecin/info-medical-records/" + medicalRecordId);
  }


  consulter(medicalRecordId: number){
    this.router.navigateByUrl("/back-office/medecin/view-medical-record/" + medicalRecordId);
  }
  
  addConstants(medicalRecordId: number) {
    const modalRef = this.modalService.create({
      nzContent: MedicalRecordConstantsModalComponent,
      nzFooter: null,
      // Passer des paramètres en utilisant la propriété 'data'
      nzData: { recordId: medicalRecordId }
    });
  
    // Récupérer une référence au composant modal
    const modalComponent = modalRef.getContentComponent();
  
    // Accéder aux propriétés et méthodes du composant
    modalComponent.recordId = medicalRecordId;
    modalComponent.showModal();
  }

  addAnalisis(medicalRecordId: number){
    const modalRef = this.modalService.create({
      nzContent: MedicalRecordAnalyseResultsModalComponent,
      nzFooter: null,
      // Passer des paramètres en utilisant la propriété 'data'
      nzData: { recordId: medicalRecordId }
    });
  
    // Récupérer une référence au composant modal
    const modalComponent = modalRef.getContentComponent();
  
    // Accéder aux propriétés et méthodes du composant
    modalComponent.recordId = medicalRecordId;
    modalComponent.showModal();
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


  exportToFile(){
    this.exportService.exportToExcel("records", this.listOfData);
  }


  showModal(): void {
    this.isVisible = true;
    this.initializeForm(this.recordForm);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  onSubmit(){
    if(this.recordForm.valid){
      const patientId = this.recordForm.value.patientId;
      this.apiService.postMedicalRecord(this.recordForm.value.patientId).subscribe({
        next: (response) => {
          if (response.success == true) {
            Swal.fire({
              title: '',
              text: "Dossier créer avec succès",
              icon: 'success',
              timer: 4000,
              showConfirmButton: false,
              timerProgressBar: true
            });
            this.listOfData = [response.data];
            this.isVisible = false;
            this.router.navigateByUrl('/back-office/medecin/medical-records');
          }else{
            Swal.fire({
              title: 'Dossier existant',
              text: response.errorMessage,
              icon: 'error',
              timer: 4000,
              showConfirmButton: false,
              timerProgressBar: true
            });
          }
        },
        error: () => {
          Swal.fire({
            title: 'Erreur inconnu',
            text: "Une erreur inconnue s'est produite",
            icon: 'error',
            timer: 4000,
            showConfirmButton: false,
            timerProgressBar: true
          });
        }
      });
    }
  }

  resetForm(event: Event, form: FormGroup){
    event.preventDefault();
    form.reset();
  }



  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Dossiers médicaux").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          
          if(permissionsCodeNames.includes("VIEW_RECORD")){
            this.canViewRecord = true;
          }else{
            this.canViewRecord = false;
            this.router.navigateByUrl("/login");
          }
        }
      },error: (err) => {
        console.log(err.message);
      }
    })
  }
}
