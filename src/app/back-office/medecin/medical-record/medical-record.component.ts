import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../../services/api-service.service';
import { FileExportService } from '../../../services/file-export.service';
import { InfoMedicalRecord, MedicalRecord, Permission, Speciality, TypeConstant } from '../../../models/model';
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
  specialities!: Speciality[]
  searcbForm!: FormGroup;
  recordForm!: FormGroup;
  transferForm!: FormGroup;
  selectForm!: FormGroup;
  isByCode = true;
  newRecord = false;
  listOfData!: any[];
  medicalRecord!: MedicalRecord;

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
  canTransferRecord = false;

  constructor(private route: ActivatedRoute, 
              private apiService: ApiServiceService, 
              private fb: FormBuilder, 
              private router: Router, 
              private exportService: FileExportService,
              private modalService: NzModalService,
              private authService: AuthService){}
  
 
  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.initializeForm('searcbForm');
    this.selectForm = this.fb.group({
      searchMode: ['', Validators.required]
    });
  }


  initializeForm(form: string){
    if(form === 'searcbForm'){
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
    }else if(form === 'transferForm'){
      this.transferForm = this.fb.group({
        speciality: [null, Validators.required]
      });
    }else if(form === 'recordForm'){
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

  getSpecialities(){
    this.apiService.getDataSpecialities().subscribe({
      next: (data: Speciality[]) => {
        //enlever la specialité actuelle
        this.specialities = data.filter(sp => sp.id != this.medicalRecord.speciality.id);
      },error: (err) => {
        console.log(err.message);
      }
    });
  }

  chooseSearchMode(){
    if(this.selectForm.controls['searchMode'].value === true){
      this.isByCode = true;
      this.initializeForm('searcbForm');
    }else if(this.selectForm.controls['searchMode'].value === false){
      this.isByCode = false;
      this.initializeForm('searcbForm');
    }
  }


  onSubmitSearchForm(){
    if(this.isByCode){
      this.apiService.searchMedicalRecordByCode(this.authService.userId, this.searcbForm.value.code).subscribe({
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
      this.apiService.searchMedicalRecord(this.authService.userId, this.searcbForm.value.firstName, this.searcbForm.value.lastName).subscribe({
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
    this.getPatients();
    this.initializeForm('recordForm');
    this.newRecord = true;
    this.showModal()
  }

  transfer(medicalRecord: MedicalRecord){
    this.medicalRecord = medicalRecord;
    this.newRecord = false;
    this.getSpecialities();
    this.initializeForm('transferForm');
    this.showModal();
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


  // exportToFile(){
  //   this.exportService.exportToExcel("records", this.listOfData);
  // }


  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  onSubmit(){
    if(this.newRecord && this.recordForm.valid){
      this.apiService.postMedicalRecord(this.recordForm.value.patientId, this.authService.userId).subscribe({
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
    }else if(this.transferForm.valid){
      this.apiService.transferRecordToSpeciality(this.medicalRecord.id, this.transferForm.value.speciality).subscribe({
        next: (response) => {
          if (response.success == true) {
            Swal.fire({
              title: '',
              text: "Dossier transféré avec succès",
              icon: 'success',
              timer: 4000,
              showConfirmButton: false,
              timerProgressBar: true
            });
            this.listOfData = this.listOfData.filter(record => record.id != this.medicalRecord.id);
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
          }
          if(permissionsCodeNames.includes("ADD_CONSTANTS")){
            this.canAddConstants = true;
          }else{
            this.canAddConstants = false;
          }
          if(permissionsCodeNames.includes("ADD_TESTS_RESULTS")){
            this.canAddAnalyses = true;
          }else{
            this.canAddAnalyses = false;
          }
          if(permissionsCodeNames.includes("CREATE_RECORD")){
            this.canCreateRecord = true;
          }else{
            this.canCreateRecord = false;
          }
          if(permissionsCodeNames.includes("SEARCH_RECORDS")){
            this.canSearchRecords = true;
          }else{
            this.canSearchRecords = false;
          }
          if(permissionsCodeNames.includes("FILL_RECORDS")){
            this.canFillRecord = true;
          }else{
            this.canFillRecord = false;
          }
          if(permissionsCodeNames.includes("VIEW_LIST_RECORDS")){
            this.canViewListRecords = true;
          }else{
            this.canViewListRecords = false;
          }
          if(permissionsCodeNames.includes("TRANSFER_RECORD")){
            this.canTransferRecord = true;
          }else{
            this.canTransferRecord = false;
          }
        }
      },error: (err) => {
        console.log(err.message);
      }
    })
  }
}
