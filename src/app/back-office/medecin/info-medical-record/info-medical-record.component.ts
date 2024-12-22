import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Analysis, TypeConstant } from '../../../models/model';
import moment from 'moment';

@Component({
  selector: 'app-info-medical-record',
  templateUrl: './info-medical-record.component.html',
  styleUrl: './info-medical-record.component.css'
})
export class InfoMedicalRecordComponent implements OnInit{
  infoMedRecord: any;
  existingInfoMedRecord!: any;
  recordId: any;
  medicalRec: any;
  medicalRecordForm!: FormGroup;
  typeConstants: TypeConstant[] = [];
  analysis: Analysis[] = [];
  allAnalyses: Analysis[] = [];
  allTypeConstants: TypeConstant[] = [];
  addAnalysis: boolean = false;
  addAdditionalConstants: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private apiService: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.recordId = this.route.snapshot.params["id"];
    
    this.getMedicalRecordById(this.recordId);
    this.getCurrentDayInfoMedRecord(this.recordId);

    this.medicalRecordForm = this.fb.group({
      diagnostiques: ['', Validators.required],
      traitements: ['', Validators.required],
      analyses_resultats: this.fb.array([]),
      constants: this.fb.array([])
    });

    this.getTypeConstants();
    this.getAnalysis();
  }

  


  getTypeConstants(): void{
    this.apiService.getTypeConstants().subscribe(data => {
      this.allTypeConstants = data;
      // if (this.constant.length === 0) {
      //   this.addAnotherConstant();
      // }
    });
  }

  // Récupérer les analysis depuis le serveur
  getAnalysis(): void{
    this.apiService.getAnalyses().subscribe(data => {
      this.allAnalyses = data;
      this.analysis = [...this.allAnalyses];
      
      // Ajouter un champ initial si aucune analyse n'est sélectionnée
      // if (this.analysisResults.length === 0) {
      //   this.addAnalysisResult();
      // }
    });
  }


  get analysisResults(): FormArray {
    return this.medicalRecordForm.get('analyses_resultats') as FormArray;
  }

  get constant(): FormArray {
    return this.medicalRecordForm.get('constants') as FormArray;
  }

  createAnalysisResult(): FormGroup {
    return this.fb.group({
      analysis: [null, this.addAnalysis ? Validators.required : null],
      result: ['', this.addAnalysis ? Validators.required : null]
    });
    
  }

  createConstant(): FormGroup {
    return this.fb.group({
      typeConstant: [null, this.addAdditionalConstants ? Validators.required : null],
      valeur: ['', this.addAdditionalConstants ? Validators.required : null]
    });
    
  }

  addAnalysisResult(): void {
    const selectedAnalyses = this.analysisResults.controls
      .map(control => control.get('analysis')?.value)
      .filter(value => value !== null && value !== undefined);

    if (selectedAnalyses.length < this.allAnalyses.length) {
      this.analysisResults.push(this.createAnalysisResult());
      this.updateAvailableOptions();
    } else {
      this.showNotification('info', 'Toutes les analyses disponibles ont déjà été ajoutées.');
    }
  }

  addAnotherConstant(): void {
    const selectedConstants = this.constant.controls
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    if (selectedConstants.length < this.allTypeConstants.length) {
      this.constant.push(this.createConstant());
    } else {
      this.showNotification('info', 'Toutes les constantes disponibles ont déjà été ajoutées.');
    }
  }

  updateAvailableOptions(): void {
    const selectedAnalyses = this.analysisResults.controls
      .map(control => control.get('analysis')?.value)
      .filter(value => value !== null && value !== undefined);

    this.analysis = this.allAnalyses.filter(analysis => 
      !selectedAnalyses.includes(analysis.id) || 
      this.analysisResults.controls.some(control => 
        control.get('analysis')?.value === analysis.id
      )
    );
  }

  // Mettre à jour les constantes disponibles en fonction des éléments déjà sélectionnés
  updateAvailableConstants() {
    const selectedConstants = this.constant.controls
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    this.typeConstants = this.allTypeConstants.filter(constant => 
      !selectedConstants.includes(constant.id) || 
      this.constant.controls.some(control => control.get('typeConstant')?.value === constant.id)
    );
  }

  // Récupérer les analysis disponibles en excluant celles déjà sélectionnées
  getAvailableAnalyses(index: number): any[] {
    const currentAnalysis = this.analysisResults.at(index).get('analysis')?.value;
    const otherSelectedAnalyses = this.analysisResults.controls
      .filter((_, i) => i !== index)
      .map(control => control.get('analysis')?.value)
      .filter(value => value !== null && value !== undefined);

    return this.allAnalyses.filter(analysis => 
      !otherSelectedAnalyses.some(selected => selected.id === analysis.id) || 
      (currentAnalysis && currentAnalysis.id === analysis.id)
    );
  }

  // Récupérer les constantes disponibles en excluant celles déjà sélectionnées
  getAvailableConstants(index: number): TypeConstant[] {
    const currentConstant = this.constant.at(index).get('typeConstant')?.value;
    const otherSelectedConstants = this.constant.controls
      .filter((_, i) => i !== index)
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    return this.allTypeConstants.filter(constant => 
      !otherSelectedConstants.some(selected => selected.id === constant.id) || 
      (currentConstant && currentConstant.id === constant.id)
    );
  }

  getSelectedConstantUnit(index: number): string | undefined {
    const typeConstant = this.constant.at(index).get('typeConstant')?.value;
    return typeConstant?.unit;
  }

  onSubmit(): void {
    if (this.medicalRecordForm.valid) {
      const formValue = this.medicalRecordForm.value;

      formValue.diagnostiques = [formValue.diagnostiques];
      formValue.traitements = [formValue.traitements];

      this.infoMedRecord = formValue;      

    this.apiService.createInforMedicalRecord(this.infoMedRecord, this.recordId).subscribe({
      next:response =>{
        if (response && response.success == true) {
         this.showNotification('success', "Données ajoutées avec succès");
         this.router.navigateByUrl('/back-office/medecin/view-medical-record/' + this.medicalRec.id);
        }else{
          this.medicalRecordForm.reset();
          this.showNotification('error', response.errorMessage);
        }
       },
      error: err=>{
        this.ngOnInit()
        this.showNotification('error', "Une erreur inconnue s'est produite");
       }
    });
    } else {
      console.log('Formulaire invalide');
    }
  }


  getMedicalRecordById(medId: number){
    this.apiService.getMedicalRecord(medId).subscribe({
      next: (data) => {
        if(data.success == true){
          this.medicalRec = data.data
        }
      },error: (err) => {
        console.log(err.message);
      }
    });
  }


  getCurrentDayInfoMedRecord(medicalRecordId: number){
    this.apiService.getCurrentDayInfoMedRecord(medicalRecordId).subscribe({
      next: (data) => {
        if(data != null){
          this.existingInfoMedRecord = data;
          this.existingInfoMedRecord.date = moment(this.existingInfoMedRecord.date, 'DD-MM-YYYY').toDate();
          // this.existingInfoMedRecord.date = new Date(Date.parse(this.existingInfoMedRecord.date));
          // this.existingInfoMedRecord.analyses_resultats[0].result
        }
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

  addAnalysisAndResults(): boolean{
    this.addAnalysis = !this.addAnalysis;
    this.createAnalysisResult();
    return this.addAnalysis;
  }

  addConstants(): boolean{
    this.addAdditionalConstants = !this.addAdditionalConstants;
    this.createConstant();
    return this.addAdditionalConstants;
  }


  showNotification(icon: 'success' | 'info' | 'error', text: string){
    Swal.fire({
      title: '',
      text,
      icon,
      timer: 4000,
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

}
