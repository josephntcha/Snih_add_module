import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Speciality, User } from '../../core/models/model';

@Component({
  selector: 'app-update-users',
  templateUrl: './update-users.component.html',
  styleUrl: './update-users.component.css'
})
export class UpdateUsersComponent implements OnInit{
  specialities!: Speciality[];
  hospitals: any;
  sexValues = ['FEMALE', 'MALE'];
  

  user!: User;
  userId: any;
  hospitalId: any;

  userForm!: FormGroup;

  
  constructor(private apiService: ApiServiceService, 
              private formBuilder: FormBuilder, 
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute){}


  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.initializeForm();
    this.getUser()
    this.getHospitals();
    this.getSpecialities();
  }


  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      hospital: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      speciality: [null, Validators.required]
    });
  }

  patchForm(): void {    
    if(this.user){
      if(this.user.userType == "Doctor"){
        this.userForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          sex: this.user.sex,
          email: this.user.email,
          phone: this.user.phone,
          speciality: this.user.speciality
        });
      }else{
        this.userForm.patchValue({
          hospital: this.user.hospital.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          sex: this.user.sex,
          email: this.user.email,
          phone: this.user.phone,
          speciality: this.user.speciality
        });
      }
    }
  }

  compareFn = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);


  getHospitals(): void {
    this.apiService.getDataHospitals().subscribe({
      next: (response) => {
        this.hospitals = response;
      },error: (err) => {
        console.log(err.message);
      }
    });
  }

  getSpecialities(): void {
    this.apiService.getDataSpecialities().subscribe({
      next: (response) => {
        this.specialities = response;
      },error: (err) => {
        console.log(err.message);
      }
    });
  }

  getUser(): void {
    this.apiService.getUserById(this.userId).subscribe({
      next: (response) => {
        if(response.success){
          this.user = response.data;
          this.patchForm()
        }
      },error: (err) => {
        console.log(err.message);        
      }
    })
  }


  onSubmit() {
    if (this.userForm.valid) {
      // const data = {
      //   firstName: this.userForm.value.firstName,
      //   lastName: this.userForm.value.lastName,
      //   sex: this.userForm.value.sex,
      //   email: this.userForm.value.email,
      //   phone: this.userForm.value.phone,
      //   // speciality: this.userForm.value.speciality
      // }

      const data = this.userForm.value;      

      this.apiService.updateUser(this.userId, data).subscribe({
        next: response => {
          if(response.success){
            Swal.fire({
              title: 'Compte mis à jour avec succès',
              text: '',
              icon: 'success',
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true 
            });
            this.router.navigateByUrl("/Administration/users");
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
    }
  }

  resetAdminForm(event: Event){
    event.preventDefault();
    this.userForm.reset()
  }

}
