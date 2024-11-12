import { Component, Inject, OnInit } from '@angular/core';
import { InfoMedicalRecord, TypeConstant } from '../../../core/models/model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiServiceService } from '../../services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medical-record-constants-modal',
  templateUrl: './medical-record-constants-modal.component.html',
  styleUrl: './medical-record-constants-modal.component.css'
})
export class MedicalRecordConstantsModalComponent implements OnInit{
  recordForm!: FormGroup;
  recordId!: number;
  allTypeConstants: TypeConstant[] = [];
  infoMedRecord!: InfoMedicalRecord;
  addConstant = false;
  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private message: NzMessageService,
    private modalService: NzModalService,
    @Inject(NZ_MODAL_DATA) public data: { recordId: number }
  ) {
    this.recordId = data.recordId;
  }

  ngOnInit(): void {
    this.recordForm = this.fb.group({
      constants: this.fb.array([])
    });
    this.getTypeConstants();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.modalService.closeAll();
  }

  getTypeConstants(): void {
    this.apiService.getTypeConstants().subscribe(data => {
      this.allTypeConstants = data;
      if (this.constant.length === 0) {
        this.addAnotherConstant();
      }
    });
  }

  get constant(): FormArray {
    return this.recordForm.get('constants') as FormArray;
  }

  createConstant(): FormGroup {
    return this.fb.group({
      typeConstant: [null, Validators.required],
      valeur: ['', Validators.required]
    });
  }

  addAnotherConstant(): void {
    const selectedConstants = this.constant.controls
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    if (selectedConstants.length < this.allTypeConstants.length) {
      this.constant.push(this.createConstant());
    } else {
      this.message.info('Toutes les constantes disponibles ont déjà été ajoutées.');
    }
  }

  getAvailableConstants(index: number): TypeConstant[] {
    const currentValue = this.constant.at(index).get('typeConstant')?.value;
    const otherSelectedConstants = this.constant.controls
      .filter((_, i) => i !== index)
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    return this.allTypeConstants.filter(constant => 
      !otherSelectedConstants.includes(constant.id) || 
      constant.id === currentValue
    );
  }

  getSelectedConstantUnit(index: number): string | undefined {
    const typeConstantId = this.constant.at(index).get('typeConstant')?.value;
    if (typeConstantId) {
      const selectedConstant = this.allTypeConstants.find(c => c.id === typeConstantId);
      return selectedConstant?.unit;
    }
    return undefined;
  }

  onSubmit(): void {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.value;
      // Transformation des constants
      formValue.constants = formValue.constants.map((item: any) => ({
        typeConstant: { id: item.typeConstant },
        valeur: item.valeur
      }));
      formValue.analyses_resultats = null;
      formValue.traitement = null;

      this.infoMedRecord = formValue;
      

      this.apiService.addConstant(this.infoMedRecord, this.recordId).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({
              title: 'Succès',
              text: "Données ajoutées avec succès",
              icon: 'success',
              timer:4000,
              showConfirmButton:false,
              timerProgressBar:true
            });
            // this.message.success("Données ajoutées avec succès")
            // this.handleCancel();
            this.modalService.closeAll();
          }else{
            Swal.fire({
              title: 'Erreur',
              text: response.errorMessage,
              icon: 'info',
              timer: 4000,
              showConfirmButton: false,
              timerProgressBar: true
            });
            this.modalService.closeAll();
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Erreur',
            text: "Une erreur inconnue s'est produite",
            icon: 'error',
            timer: 4000,
            showConfirmButton: false,
            timerProgressBar: true
          });
        }
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             );
    } else {
      console.log('Formulaire invalide');
    }
  }
}
