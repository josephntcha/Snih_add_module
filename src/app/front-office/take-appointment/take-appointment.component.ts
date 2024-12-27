import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { KkiapayService } from '../../kkiapay-service.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import {
  openKkiapayWidget,
  addKkiapayListener,
  removeKkiapayListener,
} from "kkiapay";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-take-appointment',
  templateUrl: './take-appointment.component.html',
  styleUrl: './take-appointment.component.css'
})
export class TakeAppointmentComponent {

  
  Hospitalform!: FormGroup;
  dataHospitals: any;
  specialities: any;
  specialityId: any;
  hospitalId: number = 0;
  availabilities: any;
  availability: any;
  dateRdv: any;
  days: any;
  maxNumberOfAppointments: any;
  priceBySpeciality: number = 0;
  patientFirstName = "";
  patientLastName = "";
  patientPhone = "97000000";
  patientEmail = "";
  defaultMail = environment.defaultMailForAppointments;
  selectedAvailability: any;
  daysH: any = [];
  daysM: any = [];
  daysFromFirstResponse: string[] = [];
  daysFromSecondResponse: string[] = [];
  appointmentData: any;
  availabilityId!: number;


  constructor(private apiService: ApiServiceService, 
              private kkiapayService: KkiapayService, 
              private fromBuilder: FormBuilder, 
              private route:Router){}

  mergeArraysWithoutDuplicates(A1: any[], B1: any[]): any[] {
    return [...new Set([...A1, ...B1])];
  }
  
  ngOnInit(): void {
    this.apiService.getDataHospitals().subscribe(response => {
      this.dataHospitals = response;
    });

    this.Hospitalform = this.fromBuilder.group({
      patientLastName: ['', [Validators.required, Validators.minLength(3)]],
      patientFirstName: ['', [Validators.required, Validators.minLength(3)]],
      patientEmail: [''],
      patientPhone: ['', [Validators.required, Validators.minLength(8)]],
      date: ['', Validators.required],
      hospital: ['', Validators.required],
      speciality: ['', Validators.required],
      availability: ['', Validators.required],
      price: [''],
    });

    this.Hospitalform.patchValue({ price: this.priceBySpeciality });

    this.Hospitalform.get('hospital')?.valueChanges.subscribe(selectedHospitalId => {
      this.apiService.getSpecialitiesByHospital(selectedHospitalId).subscribe(response => {
        this.specialities = response.data;
        this.hospitalId = selectedHospitalId;
      });
    });

    this.Hospitalform.get('speciality')?.valueChanges.subscribe(selectedSpecialityId => {
      this.specialityId = selectedSpecialityId;

      this.apiService.getPriceByHospitalAndSpeciality(this.hospitalId, selectedSpecialityId).subscribe(response => {
        this.priceBySpeciality = response.data;
      }); 
      this.apiService.getAvailabilitiesByHospitalAndSpeciality(this.hospitalId, selectedSpecialityId).subscribe(response => {
         this.availabilities = response;
       
      });

    });

    this.Hospitalform.get('availability')?.valueChanges.subscribe(selectedAvailabilityId => {
      this.loadDays(selectedAvailabilityId);
    });

    addKkiapayListener('success', (response: any) => this.successHandler(response));
  }

  async loadDays(selectedAvailabilityId: any) {
    try {
      
      const response = await firstValueFrom(this.apiService.getMaxNumberForAvaillability(selectedAvailabilityId.id, this.hospitalId, this.specialityId));
      
      const totalMaxNumber = response.reduce((sum: number, availability: any) => sum + availability.maxNumberOfAppointments, 0);
      const period = response.reduce((sum: number, availability: any) => {
                
        return sum + availability.period;
      }, 0);
       
      let requestsCompleted = 0;

      if (response.length==1 && (response[0]['frequency']['name']=="HEBDOMADAIRE")) {
        this.apiService.getDaysForAvailability(selectedAvailabilityId.day.id,period).subscribe(response=>{
          this.days=response.data;
          const appointmentCountByDate: { [key: string]: number } = {};
     
           
          selectedAvailabilityId.appointments.forEach((appointment:any) => {
            const appointmentDate = appointment.date.split('T')[0];
    
            if (appointmentCountByDate[appointmentDate]) {
              appointmentCountByDate[appointmentDate]++;
            } else {
              appointmentCountByDate[appointmentDate] = 1;
            }
          });
    
            Object.keys(appointmentCountByDate).forEach((appointmentDate) => {
              const n = appointmentCountByDate[appointmentDate]; 
              
              if (n === totalMaxNumber) {
                this.days = this.days.filter((dayDate:any) => dayDate !== appointmentDate);
              }
            });

        });
      }else{
        for (let index = 0; index < response.length; index++) {
          if (response[index]['frequency']['name'] === "HEBDOMADAIRE") {
            const result = await firstValueFrom(this.apiService.getDaysForAvailability(selectedAvailabilityId.day.id, response[index]['period'])) ;
            this.daysFromFirstResponse = result.data;
            this.filterDaysByMaxAppointments(selectedAvailabilityId, totalMaxNumber, this.daysFromFirstResponse);
          } else {
            const result = await firstValueFrom( this.apiService.getDaysForAvailability2(selectedAvailabilityId.day.id, selectedAvailabilityId.orderOfDay, response[index]['period']));
            this.daysFromSecondResponse = result.data;
            this.filterDaysByMaxAppointments(selectedAvailabilityId, totalMaxNumber, this.daysFromSecondResponse);
          }
  
          requestsCompleted++;
          if (requestsCompleted === response.length) {
            this.mergeDays();
          }
        }
      }

    } catch (error) {
      console.error("Erreur lors du chargement des jours : ", error);
    }
  }

  filterDaysByMaxAppointments(selectedAvailabilityId: any, totalMaxNumber: number, daysArray: any[]) {
    const appointmentCountByDate: { [key: string]: number } = {};

    selectedAvailabilityId.appointments.forEach((appointment: any) => {
      const appointmentDate = appointment.date.split('T')[0];
      appointmentCountByDate[appointmentDate] = (appointmentCountByDate[appointmentDate] || 0) + 1;
    });

    Object.keys(appointmentCountByDate).forEach(appointmentDate => {
      if (appointmentCountByDate[appointmentDate] === totalMaxNumber) {
        daysArray = daysArray.filter((dayDate: any) => dayDate !== appointmentDate);
      }
    });
  }

  mergeDays() {
    const mergedDays = [...new Set([...this.daysFromFirstResponse, ...this.daysFromSecondResponse])];
    this.days = mergedDays;
  }

  onSubmit() {    
    if (this.Hospitalform.valid) {
      Swal.fire({
        title: 'Prendre RDV!',
        text: "Voulez-vous vraiment demander ce rendez-vous?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'oui!',
        cancelButtonText: 'non'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.Hospitalform.valid) {
            this.apiService.testAppointmentSaving(
              this.Hospitalform.value.availability.id, 
              this.Hospitalform.value.hospital, 
              this.Hospitalform.value
            ).subscribe({
              next: (data) => {
                if(data.data) {
                  this.availabilityId = this.Hospitalform.value.availability.id;
                  this.hospitalId = this.Hospitalform.value.hospital;
                  this.appointmentData = this.Hospitalform.value;

                  this.patientFirstName = this.Hospitalform.value.patientFirstName;
                  this.patientLastName = this.Hospitalform.value.patientLastName;
                  this.patientEmail = this.Hospitalform.value.patientEmail ? this.Hospitalform.value.patientEmail : this.defaultMail;
                  this.patientPhone = this.Hospitalform.value.patientPhone;                  
      
                  // Initier le paiement
                  this.open();
                } else {
                  Swal.fire({
                    title: "",
                    text: data.errorMessage,
                    icon: 'warning',
                    timer: 5000,
                    showConfirmButton: false,
                    timerProgressBar: true 
                  });
                }
              },
              error: (err) => {
                console.error('Erreur lors de la vérification du rendez-vous:', err);
              }
            });
          }
        }
      });
    }else{
      Swal.fire({
        title: 'Le formulaire n\'est pas valide',
        text: '',
        icon: 'error',
        timer: 3500,
        showConfirmButton: false,
        timerProgressBar: true 
      });
    }
  }

  open() {
    openKkiapayWidget({
      amount: this.priceBySpeciality,
      fullname: this.patientFirstName + ' ' + this.patientLastName,
      email: this.patientEmail,
      api_key: "021734b06f6511ef86df8fbf72b655ad",
      sandbox: true,
      phone: this.patientPhone,
    });
  }

  successHandler = (transactionData: any) => {
    if (!this.availabilityId || !this.hospitalId || !this.appointmentData) {
      return;
    }

    this.apiService.postAppointment(this.availabilityId, this.hospitalId, this.appointmentData).subscribe({
      next: response => {
        if (response.success) {
          Swal.fire({
            title: 'Rendez-vous pris avec succès',
            text: '',
            icon: 'success',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
          window.localStorage.setItem("username", response.data.patientUsername);
          this.route.navigateByUrl("/patient-dashboard");
        } else {
          this.ngOnInit()
          Swal.fire({
            title: "Erreur",
            text: response.errorMessage || 'Une erreur est survenue',
            icon: 'warning',
            timer: 6000,
            showConfirmButton: false,
            timerProgressBar: true 
          });
        }
      },
      error: error => {
        this.ngOnInit()
        Swal.fire({
          title: "Erreur",
          text: 'Une erreur est survenue lors de l\'enregistrement du rendez-vous',
          icon: 'error',
          timer: 6000,
          showConfirmButton: false,
          timerProgressBar: true 
        });
      }
    });
  }

}
