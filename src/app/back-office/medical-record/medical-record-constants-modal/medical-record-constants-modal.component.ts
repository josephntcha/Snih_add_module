import { Component, Inject, OnInit } from '@angular/core';
import { TypeConstant } from '../../../core/models/model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-medical-record-constants-modal',
  templateUrl: './medical-record-constants-modal.component.html',
  styleUrl: './medical-record-constants-modal.component.css'
})
export class MedicalRecordConstantsModalComponent implements OnInit{
  recordForm!: FormGroup;
  recordId!: number;
  allTypeConstants: TypeConstant[] = [];
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
      // Traiter les données du formulaire ici
      console.log(formValue);
      this.handleCancel();
    }
  }

  addConstants(medicalRecordId: number): void {
    this.recordId = medicalRecordId;
    this.showModal();
  }

}
