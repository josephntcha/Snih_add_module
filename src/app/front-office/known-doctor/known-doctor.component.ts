import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { log } from 'ng-zorro-antd/core/logger';
import { ApiServiceService } from '../../services/api-service.service';
import { addKkiapayListener, openKkiapayWidget, removeKkiapayListener } from 'kkiapay';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-known-doctor',
  templateUrl: './known-doctor.component.html',
  styleUrl: './known-doctor.component.css'
})
export class KnownDoctorComponent implements OnInit{

  Hospitalform!: FormGroup;
  dataDoctors: any;
  hospitals: any;
  availabilities: any;
  doctorId: any;
  specialityId: any;
  days: any;
  priceBySpeciality: number = 0;
  patientFirstName = "";
  patientLastName = "";
  patientPhone = "97000000";
  patientEmail = "";
  defaultMail = environment.defaultMailForAppointments;
  selectedDoctor: any;
  selectedAvailability: any;
  hospitalId:any;
  availabilityId: any;
  appointmentData: any;

  constructor(private apiService:ApiServiceService, private fromBuilder:FormBuilder, private route:Router){}


  checkAvailabilityAndRemoveDays() {
    if (!this.availabilities || !this.days) {
        
      }
     this.availabilities.forEach((availability:any) => {
        const appointmentCountByDate: { [key: string]: number } = {};
  
        availability.appointments.forEach((appointment:any) => {
          const appointmentDate = appointment.date.split('T')[0];
  
          if (appointmentCountByDate[appointmentDate]) {
            appointmentCountByDate[appointmentDate]++;
          } else {
            appointmentCountByDate[appointmentDate] = 1;
          }
        });
  
        Object.keys(appointmentCountByDate).forEach((appointmentDate) => {
          const n = appointmentCountByDate[appointmentDate]; 
  
          if (n === availability.maxNumberOfAppointments) {
            this.days = this.days.filter((dayDate:any) => dayDate !== appointmentDate);
          }
        });
      });
  }
  

  ngOnInit(): void {

    this.Hospitalform=this.fromBuilder.group(
           {
             patientLastName:['', [Validators.required, Validators.minLength(3)]],
             patientFirstName: ['', [Validators.required, Validators.minLength(3)]],
             patientEmail: [''],
             patientPhone: ['', [Validators.required, Validators.minLength(8)]],
             doctor: ['', Validators.required],
             hospital: ['', Validators.required],
             speciality: [''],
             availability: ['', Validators.required],
             date: ['', Validators.required],
             price: ['']
           });
 
          this.apiService.getDataDoctors().subscribe(response=>{
            this.dataDoctors=response;
          });
 
           this.Hospitalform.get('doctor')?.valueChanges.subscribe(selectedDoctorId=>{
             this.specialityId=selectedDoctorId.speciality.id;
             this.apiService.getDataHospitalsByDoctor(selectedDoctorId.id).subscribe(response=>{
             this.hospitals=response; 
             this.doctorId=selectedDoctorId.id;
 
            });
          }); 
 
           this.Hospitalform.get('hospital')?.valueChanges.subscribe(selectedHospitalId=>{
 
             this.apiService.getPriceByHospitalAndSpeciality(selectedHospitalId,this.specialityId).subscribe(response=>{
               this.priceBySpeciality=response.data;
            
              })
 
            this.apiService.getAvailabilitiesByDoctorAndHospital(this.doctorId,selectedHospitalId).subscribe(response=>{
             this.availabilities=response; 
            });
 
         });
 
 
          this.Hospitalform.get('availability')?.valueChanges.subscribe(selectedAvailabilityId=>{
            
           if (selectedAvailabilityId.frequency.name === "HEBDOMADAIRE") {
             this.apiService.getDaysForAvailability(selectedAvailabilityId.day.id,selectedAvailabilityId.period).subscribe(response=>{
               this.days=response.data;
               this.checkAvailabilityAndRemoveDays();
                })
           }
           if (selectedAvailabilityId.frequency.name === "MENSUELLE") {
             this.apiService.getDaysForAvailability2(selectedAvailabilityId.day.id,selectedAvailabilityId.orderOfDay,selectedAvailabilityId.period).subscribe(response=>{
               this.days=response.data;
               this.checkAvailabilityAndRemoveDays();
                })
             
           }
         
         });

    addKkiapayListener('success', (response: any) => this.successHandler(response));
   
  }
 

  ngOnDestroy(){
    removeKkiapayListener('success')
  }

  onSubmit(){
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
        if(result.isConfirmed){
          this.apiService.testAppointmentSaving(
            this.Hospitalform.value.availability.id, 
            this.Hospitalform.value.hospital, 
            this.Hospitalform.value
          ).subscribe({
            next: (data) => {
              if(data.data){
                this.availabilityId = this.Hospitalform.value.availability.id;
                this.hospitalId = this.Hospitalform.value.hospital;
                this.appointmentData = this.Hospitalform.value;

                this.patientFirstName = this.Hospitalform.value.patientFirstName;
                this.patientLastName = this.Hospitalform.value.patientLastName;
                this.patientEmail = this.Hospitalform.value.patientEmail ? this.Hospitalform.value.patientEmail : this.defaultMail;
                this.patientPhone = this.Hospitalform.value.patientPhone;  
    
                // Initier le paiement
                this.open();
              }else{
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
      })
      
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
    })
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
        console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
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
