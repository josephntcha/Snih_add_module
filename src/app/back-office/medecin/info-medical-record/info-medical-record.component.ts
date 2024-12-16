import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Analysis, TypeConstant } from '../../../models/model';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private apiService: ApiServiceService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.recordId = this.route.snapshot.params["id"];
    
    this.getMedicalRecordById(this.recordId);
    this.getCurrentDayInfoMedRecord(this.recordId);

    this.medicalRecordForm = this.fb.group({
      diagnostique: ['', Validators.required],
      traitement: ['', Validators.required],
      analyses_resultats: this.fb.array([]),
      constants: this.fb.array([])
    });

    this.getTypeConstants();
    this.getAnalysis();
  }

  


  getTypeConstants(): void{
    this.apiService.getTypeConstants().subscribe(data => {
      this.allTypeConstants = data;
      if (this.constant.length === 0) {
        this.addConstant();
      }
    });
  }

  // Récupérer les analysis depuis le serveur
  getAnalysis(): void{
    this.apiService.getAnalyses().subscribe(data => {
      this.allAnalyses = data;
      this.analysis = [...this.allAnalyses];
      
      // Ajouter un champ initial si aucune analyse n'est sélectionnée
      if (this.analysisResults.length === 0) {
        this.addAnalysisResult();
      }
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
      analysis: [null],
      result: ['']
    });
    
  }

  createConstant(): FormGroup {
    return this.fb.group({
      typeConstant: [null],
      valeur: ['']
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
      Swal.fire({
        title: 'Info',
        text: 'Toutes les analyses disponibles ont déjà été ajoutées.',
        icon: 'info',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true
      });
    }
  }

  addConstant(): void {
    const selectedConstants = this.constant.controls
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    if (selectedConstants.length < this.allTypeConstants.length) {
      this.constant.push(this.createConstant());
    } else {
      Swal.fire({
        title: 'Info',
        text: 'Toutes les constantes disponibles ont déjà été ajoutées.',
        icon: 'info',
        timer: 4500,
        showConfirmButton: false,
        timerProgressBar: true
      });
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
  getAvailableAnalyses(index: number): Analysis[] {
    const currentValue = this.analysisResults.at(index).get('analysis')?.value;
    const otherSelectedAnalyses = this.analysisResults.controls
      .filter((_, i) => i !== index)
      .map(control => control.get('analysis')?.value)
      .filter(value => value !== null && value !== undefined);

    return this.allAnalyses.filter(analysis => 
      !otherSelectedAnalyses.includes(analysis.id) || 
      analysis.id === currentValue
    );
  }

  // Récupérer les constantes disponibles en excluant celles déjà sélectionnées
  getAvailableConstants(index: number): TypeConstant[] {
    const currentValue = this.constant.at(index).get('typeConstant')?.value;
    const otherSelectedConstants = this.constant.controls
      .filter((_, i) => i !== index) // Exclure la constante courante
      .map(control => control.get('typeConstant')?.value)
      .filter(value => value !== null && value !== undefined);

    return this.allTypeConstants.filter(constant => 
      !otherSelectedConstants.includes(constant.id) || 
      constant.id === currentValue
    );
  }

  onSubmit(): void {
    if (this.medicalRecordForm.valid) {
      const formValue = this.medicalRecordForm.value;

      formValue.analyses_resultats = formValue.analyses_resultats.map((item: any) => ({
        analysis: { id: item.analysis },
        result: item.result
      }));

      // Transformation des constants
      formValue.constants = formValue.constants.map((item: any) => ({
        typeConstant: { id: item.typeConstant },
        valeur: item.valeur,
        date: item.date
      }));

      this.infoMedRecord = formValue;

    this.apiService.createInforMedicalRecord(this.infoMedRecord, this.recordId).subscribe({
      next:response=>{
        if (response.success==true) {
         Swal.fire({
           title: 'Succès',
           text: "Données ajoutées avec succès",
           icon: 'success',
           timer:4000,
           showConfirmButton:false,
           timerProgressBar:true
         });
         this.router.navigateByUrl('/back-office/medecin/medical-records/' + this.medicalRec.patient.id);
        }else{
          this.ngOnInit()
          Swal.fire({
            title: 'Erreur',
            text: response.errorMessage,
            icon: 'info',
            timer:4000,
            showConfirmButton:false,
            timerProgressBar:true
          });
        }
       },
      error: err=>{
        this.ngOnInit()
        Swal.fire({
          title: 'Erreur',
          text: "Une erreur inconnue s'est produite",
          icon: 'error',
          timer:4000,
          showConfirmButton:false,
          timerProgressBar:true
        });
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
          this.existingInfoMedRecord.analyses_resultats[0].result
        }
      },error: (err) => {
        console.log(err.message);
      }
    })
  }

  addAnalysisAndResults(): boolean{
    return this.addAnalysis = !this.addAnalysis;
  }

}
