import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{
  changePasswordForm: FormGroup;
  mustChangePassword = false;
  isLoading = false;

  images: string[] = [
    'assets/téléchargement1.jpeg', 
    'assets/téléchargement2.jpeg', 
    'assets/téléchargement3.jpeg', 
    'assets/téléchargement4.jpeg', 
    
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.changePasswordForm = this.fb.group({
      username: ['', Validators.required],
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit() {
    // Vérifiez si le changement de mot de passe est obligatoire
    this.route.queryParams.subscribe(params => {
      this.mustChangePassword = params['mustChangePassword'] === 'true';
    });
  }

  // Validateur personnalisé pour vérifier la correspondance des mots de passe
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    return newPassword && confirmPassword && newPassword.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  submitForm() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      
      const changePasswordData = {
        username: this.changePasswordForm.get('username')?.value,
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value,
        confirmNewPassword: this.changePasswordForm.get('confirmPassword')?.value
      };

      this.authService.changePassword(changePasswordData).subscribe({
        next: () => {               
          Swal.fire({
            title: 'Mot de passe changé avec succès',
            text: '',
            icon: 'success',
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
          
          // Reconnectez automatiquement l'utilisateur
          this.authService.login(changePasswordData.username, changePasswordData.newPassword).subscribe({
            next: (response) => {
              this.authService.loadProfile(response);
              if(!this.authService.isPatient()){
                if(this.authService.isSuperAdmin()){
                  this.router.navigateByUrl("/back-office/Administration/super-admin-dashboard");
                }else if(this.authService.isAdmin()){
                  this.router.navigateByUrl("/back-office/Administration/admin-dashboard");
                }else if(this.authService.isDoctor()){
                  this.router.navigateByUrl("/back-office/medecin/calendar");
                }else{
                  this.router.navigateByUrl("/back-office/Administration/secretaire-dashboard");
                }
              }else{
                this.router.navigateByUrl("/patient-dashboard");
              }
            },
            error: () => {
              // En cas d'échec, redirigez vers la page de connexion
              this.router.navigate(['/login']);
            },
            complete: () => {
              this.isLoading = false;
            }
          });
        },
        error: (err) => {          
          Swal.fire({
            title: 'Erreur lors du changement de mot de passe',
            text: '',
            icon: 'error',
            timer: 4500,
            showConfirmButton: false,
            timerProgressBar: true 
          });
          this.isLoading = false;
        }
      });
    }
  }

}
