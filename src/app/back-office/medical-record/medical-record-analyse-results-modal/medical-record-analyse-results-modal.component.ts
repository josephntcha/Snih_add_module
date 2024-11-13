import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-medical-record-analyse-results-modal',
  templateUrl: './medical-record-analyse-results-modal.component.html',
  styleUrl: './medical-record-analyse-results-modal.component.css'
})
export class MedicalRecordAnalyseResultsModalComponent implements OnInit{
  infoMedRecord: any;
  analysisForm!: FormGroup;
  recordId: number;
  allAnalyses: any[] = [];
  isDataFromFile = false;
  isVisible = false;
  selectedFile: File | null = null;

  constructor(
    private apiService: ApiServiceService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: { recordId: number }
  ) {
    this.recordId = data.recordId;
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllAnalyses();
  }

  private initForm(): void {
    this.analysisForm = this.fb.group({
      analyses_resultats: this.fb.array([])
    });
  }

  get analysisResults(): FormArray {
    return this.analysisForm.get('analyses_resultats') as FormArray;
  }

  createAnalysisResult(): FormGroup {
    return this.fb.group({
      analysis: [null, Validators.required],
      result: ['', Validators.required]
    });
  }

  addAnalysisResult(): void {
    const selectedAnalyses = this.analysisResults.controls
      .map(control => control.get('analysis')?.value)
      .filter(value => value !== null && value !== undefined);

    if (selectedAnalyses.length < this.allAnalyses.length) {
      this.analysisResults.push(this.createAnalysisResult());
    } else {
      this.message.info('Toutes les analyses disponibles ont déjà été ajoutées.');
    }
  }

  getAvailableAnalyses(index: number): any[] {
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


  toggleInputMode(): void {
    this.isDataFromFile = !this.isDataFromFile;
    if (!this.isDataFromFile && this.analysisResults.length === 0) {
      this.addAnalysisResult();
    }
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    if (file.type !== 'application/pdf') {
      this.message.error('Vous pouvez uniquement télécharger des fichiers PDF!');
      return false;
    }
    this.selectedFile = new File([file.originFileObj as Blob], file.name, { type: file.type });
    return true;
  };

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} fichier téléchargé avec succès`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} échec du téléchargement.`);
    }
  }

  isFormValid(): boolean {
    if (this.isDataFromFile) {
      return !!this.selectedFile;
    }
    return this.analysisForm.valid;
  }


  handleCancel(): void {
    this.modalRef.close();
  }


  showModal(): void {
    this.isVisible = true;
  }

  // Récupérer les analysis depuis le serveur
  getAllAnalyses(): void{
    this.apiService.getAnalyses().subscribe(data => {
      this.allAnalyses = data;
      // this.allAnalyses = [...this.allAnalyses];
      
      // Ajouter un champ initial si aucune analyse n'est sélectionnée
      if (this.analysisResults.length === 0) {
        this.addAnalysisResult();
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      if(!this.isDataFromFile){
        const formValue = this.analysisForm.value;
        formValue.analyses_resultats = formValue.analyses_resultats.map((item: any) => ({
          analysis: { id: item.analysis },
          result: item.result
        }));

        this.infoMedRecord = formValue;

        this.apiService.addAnalysisResult(this.infoMedRecord, this.recordId).subscribe({
          next: response => {
            if (response.success == true) {
              this.analysisForm.reset()
              Swal.fire({
                title: 'Succès',
                text: "Données ajoutées avec succès",
                icon: 'success',
                timer:4000,
                showConfirmButton:false,
                timerProgressBar:true
              });
            }else{
              this.analysisForm.reset()
              Swal.fire({
                title: 'Erreur',
                text: response.errorMessage,
                icon: 'info',
                timer:6000,
                showConfirmButton:false,
                timerProgressBar:true
              });
              // Swal.fire({
              //   title: 'Succès',
              //   text: "Données ajoutées avec succès",
              //   icon: 'success',
              //   timer: 4000,
              //   showConfirmButton: false,
              //   timerProgressBar: true
              // });
            }
            this.handleCancel();
          },
          error: err=>{
            Swal.fire({
              title: 'Erreur',
              text: "Une erreur inconnue s'est produite",
              icon: 'error',
              timer: 6000,
              showConfirmButton: false,
              timerProgressBar: true
            });
          }
        });
      }else{
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          
          this.apiService.addAnalysisResultFromFile(formData, this.recordId).subscribe(response => {
            Swal.fire({
              title: 'Succès',
              text: "Données ajoutées avec succès",
              icon: 'success',
              timer:4000,
              showConfirmButton:false,
              timerProgressBar:true
            });
            this.handleCancel()
            // next: () => {
            //   Swal.fire({
            //     title: 'Succès',
            //     text: "Fichier téléchargé avec succès",
            //     icon: 'success',
            //     timer: 4000,
            //     showConfirmButton: false,
            //     timerProgressBar: true
            //   });
            // },
            // error: (err) => {
            //   console.error('Erreur lors du téléchargement:', err);
            //   Swal.fire({
            //     title: 'Erreur',
            //     text: "Une erreur s'est produite lors du téléchargement du fichier",
            //     icon: 'error',
            //     timer: 6000,
            //     showConfirmButton: false,
            //     timerProgressBar: true
            //   });
            // }
          });
        }
      }
    } else {
      console.log('Formulaire invalide');
    }
  }

}
