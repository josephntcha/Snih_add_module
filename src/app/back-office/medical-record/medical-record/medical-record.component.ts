import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../services/api-service.service';
import { FileExportService } from '../../../core/services/file-export.service';
import { InfoMedicalRecord, TypeConstant } from '../../../core/models/model';
import { MedicalRecordConstantsModalComponent } from '../medical-record-constants-modal/medical-record-constants-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MedicalRecordAnalyseResultsModalComponent } from '../medical-record-analyse-results-modal/medical-record-analyse-results-modal.component';

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

  /************** Setion of constant adding ****************/
  recordId: any
  typeConstants: TypeConstant[] = [];
  allTypeConstants: TypeConstant[] = [];

  /************** Section of analyses adding ***************/
  constructor(private route: ActivatedRoute, 
              private apiService: ApiServiceService, 
              private fb: FormBuilder, 
              private router: Router, 
              private exportService: FileExportService,
              private modalService: NzModalService){}
  
 
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
    this.router.navigateByUrl("/create-info-medical-record/" + medicalRecordId);
  }


  consulter(medicalRecordId: number){
    this.router.navigateByUrl("/medical-record-details/" + medicalRecordId);
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
            this.router.navigateByUrl('/Administration/medical-records');
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


  /************** Setion of constant adding ****************/


// Récupérer les types de constantes depuis le serveur
  // getTypeConstants(): void{
  //   this.apiService.getTypeConstants().subscribe(data => {
  //     this.allTypeConstants = data;
  //     if (this.constant.length === 0) {
  //       this.addAnotherConstant();
  //     }
  //   });
  // }


  // get constant(): FormArray {
  //   return this.recordForm.get('constants') as FormArray;
  // }

  // createConstant(): FormGroup {
  //   return this.fb.group({
  //     typeConstant: [null, Validators.required],
  //     valeur: ['', Validators.required]
  //   });
  // }

  // addAnotherConstant(): void {
  //   const selectedConstants = this.constant.controls
  //     .map(control => control.get('typeConstant')?.value)
  //     .filter(value => value !== null && value !== undefined);

  //   if (selectedConstants.length < this.allTypeConstants.length) {
  //     this.constant.push(this.createConstant());
  //   } else {
  //     Swal.fire({
  //       title: 'Info',
  //       text: 'Toutes les constantes disponibles ont déjà été ajoutées.',
  //       icon: 'info',
  //       timer: 4500,
  //       showConfirmButton: false,
  //       timerProgressBar: true
  //     });
  //   }
  // }

  // // Mettre à jour les constantes disponibles en fonction des éléments déjà sélectionnés
  // updateAvailableConstants() {
  //   const selectedConstants = this.constant.controls
  //     .map(control => control.get('typeConstant')?.value)
  //     .filter(value => value !== null && value !== undefined);

  //   this.typeConstants = this.allTypeConstants.filter(constant => 
  //     !selectedConstants.includes(constant.id) || 
  //     this.constant.controls.some(control => control.get('typeConstant')?.value === constant.id)
  //   );
  // }

  // // Récupérer les constantes disponibles en excluant celles déjà sélectionnées
  // getAvailableConstants(index: number): TypeConstant[] {
  //   const currentValue = this.constant.at(index).get('typeConstant')?.value;
  //   const otherSelectedConstants = this.constant.controls
  //     .filter((_, i) => i !== index) // Exclure la constante courante
  //     .map(control => control.get('typeConstant')?.value)
  //     .filter(value => value !== null && value !== undefined);

  //   return this.allTypeConstants.filter(constant => 
  //     !otherSelectedConstants.includes(constant.id) || 
  //     constant.id === currentValue
  //   );
  // }

  // getSelectedConstantUnit(index: number): string | undefined {
  //   const typeConstantId = this.constant.at(index).get('typeConstant')?.value;
  //   if (typeConstantId) {
  //     const selectedConstant = this.allTypeConstants.find(c => c.id === typeConstantId);
  //     return selectedConstant?.unit;
  //   }
  //   return undefined;
  // }

  // onSubmitForm(): void {
  //   if (this.recordForm.valid) {
  //     const formValue = this.recordForm.value;

  //     // Transformation des constants
  //     formValue.constants = formValue.constants.map((item: any) => ({
  //       typeConstant: { id: item.typeConstant },
  //       valeur: item.valeur
  //     }));
  //     formValue.analyses_resultats = null;
  //     formValue.traitement = null;

  //     this.infoMedRecord = formValue;
      

  //   this.apiService.addConstant(this.infoMedRecord, this.recordId).subscribe({
  //     next:response=>{
  //       if (response.success==true) {
  //         console.log(response.data);
  //         this.ngOnInit()
  //        Swal.fire({
  //          title: 'Succès',
  //          text: "Données ajoutées avec succès",
  //          icon: 'success',
  //          timer:4000,
  //          showConfirmButton:false,
  //          timerProgressBar:true
  //        });
  //       //  this.router.navigateByUrl('/MedicalRecord/' + this.medicalRec.patient.id);
  //       }else{
  //         this.ngOnInit()
  //         Swal.fire({
  //           title: 'Erreur',
  //           text: response.errorMessage,
  //           icon: 'info',
  //           timer:4000,
  //           showConfirmButton:false,
  //           timerProgressBar:true
  //         });
  //       }
  //      },
  //     error: err=>{
  //       Swal.fire({
  //         title: 'Erreur',
  //         text: "Une erreur inconnue s'est produite",
  //         icon: 'error',
  //         timer:4000,
  //         showConfirmButton:false,
  //         timerProgressBar:true
  //       });
  //      }
  //   });
  //   } else {
  //     console.log('Formulaire invalide');
  //   }
  // }



  // getMedicalRecordById(medId: number){
  //   this.apiService.getMedicalRecord(medId).subscribe({
  //     next: (data) => {
  //       if(data.success == true){
  //         this.medicalRec = data.data
          
  //       }
  //     },error: (err) => {
  //       console.log(err.message);
  //     }
  //   });
  // }
}
