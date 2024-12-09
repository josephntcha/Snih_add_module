import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Permission } from '../../../models/model';

@Component({
  selector: 'app-new-personal',
  templateUrl: './new-personal.component.html',
  styleUrl: './new-personal.component.css'
})
export class NewPersonalComponent implements OnInit{
  specialities: any;
  hospitals: any;
  roles:any;

  addDoctorToHospitalform!: FormGroup
  isToAddDoctorToHospital: boolean = false;
  doctors: any;
  userId: any;
  hospitalId: any;

  isStaff: boolean = false;

  userTypes: string[] = ["Staff", "Doctor"]
  
  staffForm!: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    sex: FormControl<string>;
    userRoles: FormControl<any>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    speciality: FormControl<any>;
    hospital: FormControl<any>;
    userType: FormControl<any>;
  }>;

  canAddDoctorToAnotherHospital = false;
  canAddDoctorToOwnHospital = false;

  
  constructor(private apiService: ApiServiceService, 
            private fromBuilder: FormBuilder, 
            private router: Router,
            private authService: AuthService){}


  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
    this.staffForm = this.fromBuilder.group({
      hospital: [null] as unknown as FormControl<any>,
      firstName: ['', Validators.required] as unknown as FormControl<string>,
      lastName: ['', Validators.required] as unknown as FormControl<string>,
      sex: ['', Validators.required] as unknown as FormControl<string>,
      email: ['', Validators.required] as unknown as FormControl<string>,
      phone: ['', Validators.required] as unknown as FormControl<string>,
      username: ['', Validators.required] as unknown as FormControl<string>,
      password: ['', Validators.required] as unknown as FormControl<string>,
      speciality: [null, Validators.required] as unknown as FormControl<any>,
      userRoles: [null] as unknown as FormControl<any>,
      userType: [null, Validators.required] as unknown as FormControl<any>
    });

    this.apiService.getDataHospitals().subscribe(response=>{
      this.hospitals=response;
    }); 
      
    this.apiService.getDataSpecialities().subscribe(response => {
      this.specialities = response;
    });

    this.apiService.getRights().subscribe(response=>{
      this.roles=response;
    });



    const token = localStorage.getItem('jwt-token');
    if (token) {

      const decodedToken:any = jwtDecode(token);
      
      this.userId = decodedToken.sub.split(" ")[1]; 
    }
   
    this.apiService.getUserById(this.userId).subscribe(response => {
      this.hospitalId = this.canAddDoctorToAnotherHospital ? null : response.data.hospital.id;
    });
    

    this.addDoctorToHospitalform = this.fromBuilder.group({
      doctor: ['',Validators.required],
      hospital: ['']
    }); 
      
    this.apiService.getDataDoctors().subscribe(response=>{
      this.doctors=response;
    });
  }


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Utilisateurs").subscribe({
      next: (response) => {
        
        if(response.success){
          const currentUserPermissions = response.data;
          const permissionsCodeNames = currentUserPermissions.map((permission: Permission) => permission.codeName);
          
          if(permissionsCodeNames.includes("ADD_DOCTOR_TO_ANOTHER_HOSPITAL")){
            this.canAddDoctorToAnotherHospital = true;
          }else{
            this.canAddDoctorToAnotherHospital = false;
          }
          if(permissionsCodeNames.includes("ADD_DOCTOR_TO_OWN_HOSPITAL")){
            this.canAddDoctorToOwnHospital = true;
          }else{
            this.canAddDoctorToOwnHospital = false;
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  onSubmitAdmin() {
    if (this.staffForm.valid) {

      let data;

      if(this.isStaff){
        data = {
          firstName: this.staffForm.value.firstName,
          lastName: this.staffForm.value.lastName,
          sex: this.staffForm.value.sex,
          email: this.staffForm.value.email,
          phone: this.staffForm.value.phone,
          username: this.staffForm.value.username,
          password: this.staffForm.value.password,
          speciality: this.staffForm.value.speciality,
          roles: this.staffForm.value.userRoles,
        }

        this.apiService.postAdmin(this.staffForm.value.hospital, data).subscribe({
          next: response => {
            if(response.success){
              Swal.fire({
                title: 'Compte créé avec succès',
                text: '',
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
              this.staffForm.reset();
              this.router.navigateByUrl("/back-office/Administration/users");
            }else{
              Swal.fire({
                title: 'Erreur',
                text: response.errorMessage,
                icon: 'error',
                timer:3500,
                showConfirmButton:false,
                timerProgressBar:true 
              });
            }
          },
          error:error=>{
            console.log(error);
          }
        });

      }else{
        data = {
          firstName: this.staffForm.value.firstName,
          lastName: this.staffForm.value.lastName,
          sex: this.staffForm.value.sex,
          email: this.staffForm.value.email,
          phone: this.staffForm.value.phone,
          username: this.staffForm.value.username,
          password: this.staffForm.value.password,
          speciality: this.staffForm.value.speciality,
        }
          
        this.apiService.postDoctor(data).subscribe({
          next:response => {
            if(response.success){
              this.addDoctor(response.data.id)
            }else{
              Swal.fire({
                title: response.errorMessage,
                text: '',
                icon: 'error',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true 
              });
            }
          },
          error: error => {
            Swal.fire({
              title: 'Une erreur inconnue s\'est produite, veuillez ressayer plus tard.',
              text: '',
              icon: 'error',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
          }
        });
      }
   }
 }

  resetAdminForm(event: Event){
    event.preventDefault();
    this.staffForm.reset()
  }

  addDoctor(doctorId: number | null){
    let dbDoctorId = null;
    if (this.addDoctorToHospitalform.valid || doctorId != null) {
      if(this.addDoctorToHospitalform.valid && doctorId == null){
        dbDoctorId = this.addDoctorToHospitalform.value.doctor;
      }else if(this.addDoctorToHospitalform.invalid && doctorId != null){
        dbDoctorId = doctorId;
      }
      if(this.canAddDoctorToAnotherHospital){
        this.hospitalId = this.addDoctorToHospitalform.value.hospital
      }
      this.apiService.postAddDoctorHospital(dbDoctorId, this.hospitalId).subscribe({
        next:response=>{
          if (response.success==true) {
            Swal.fire({
              title: 'Effectué avec succès',
              text: '',
              icon: 'success',
              timer:3500,
              showConfirmButton:false,
              timerProgressBar:true 
            });
            this.router.navigateByUrl("/back-office/Administration/users");
          }else{
            Swal.fire({
              title: response.errorMessage,
              text: '',
              icon: 'error',
              timer:3500,
              showConfirmButton:false,
              timerProgressBar:true 
            });
          }
        },
        error:error=>{
          Swal.fire({
            title: 'Une erreur inconnue s\'est produite, veuillez ressayer plus tard.',
            text: '',
            icon: 'error',
            timer:3500,
            showConfirmButton:false,
            timerProgressBar:true 
          });
        }
      });
    }
  }

  resetDoctorForm(event: Event){
    event.preventDefault();
    this.staffForm.reset();
  }

  resetAddForm(event : Event){
    event.preventDefault();
    this.addDoctorToHospitalform.reset()
  }
  
  addDoctorToHospital(){
    this.isToAddDoctorToHospital = ! this.isToAddDoctorToHospital;
  }


  chooseUserType(){
    if(this.staffForm.controls['userType'].value == "Staff"){
      this.isStaff = true
    }else if(this.staffForm.controls['userType'].value == "Doctor"){
      this.isStaff = false;
    }
  }

}
