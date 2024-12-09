import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UrlStorageService } from './url-storage.service';
import { environment } from '../../environments/environment';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = `${environment.backendUrl}/auth/login`;
  passwordUrl: string = `${environment.backendUrl}/users`;

  private currentUserSubject = new BehaviorSubject<any>(null);
  // currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  userId: any;
  userModules: any[] = [];
  accessToken: any;
  tokenExpirationTimer: any

  constructor(private http: HttpClient, private router: Router, public urlStorage: UrlStorageService, private apiService: ApiServiceService) { }

  login(username: string, password: string): Observable<any>{
    const params = new HttpParams().set("username", username).set("password", password);
    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    };
    return this.http.post(this.baseUrl, params, options).pipe(
      map(response => {
        this.currentUserSubject.next(response);
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  loadProfile(data: any){
    this.isAuthenticated = true;
    this.accessToken = data["access-token"]
    let jwtDecoded:any = jwtDecode(this.accessToken);
    this.username = jwtDecoded.sub.split(" ")[0];
    this.userId = jwtDecoded.sub.split(" ")[1];
    this.roles = jwtDecoded.scope;

    window.localStorage.setItem("jwt-token", this.accessToken);

    this.apiService.loadAccessibleModules(this.username).subscribe(modules => {
      this.userModules = modules;      
    });

    this.setExpirationTimer(jwtDecoded.exp);
  }

  setExpirationTimer(expirationTime: number){
    const expiresIn = expirationTime * 1000 - Date.now(); // expiration timeout in millisecond
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()},
      expiresIn 
    )
  }

  logout() {
    this.username = undefined;
    this.userId = undefined;
    this.accessToken = undefined;
    this.roles = undefined;
    window.localStorage.removeItem("jwt-token");
    //clean the timer
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigateByUrl("/");
  }

  loadJwtTokenFromLocalStorage(){
    let token = window.localStorage.getItem("jwt-token");
    if(token){
      const jwtDecoder : any = jwtDecode(token);
      const expirationTime = jwtDecoder.exp * 1000; // convert into millisecond
      if(Date.now() >= expirationTime){
        this.logout();
        return;
      }
      this.urlStorage.saveCurrentUrl();
      // console.log(this.router.getCurrentNavigation());
      this.loadProfile({"access-token": token});
      
      this.redirectToLastVisitUrl();
    }
  }

  /**
   * Redirect the user to the last visited url
   */
  private redirectToLastVisitUrl() {
    const lastUrl = this.urlStorage.getLastVisiteUrl();
    if(lastUrl && lastUrl !== '/'){
      this.router.navigateByUrl(lastUrl);
    }else{
      this.router.navigateByUrl("/back-office/Administration");
    }
    this.urlStorage.clearLastVisitUrl();
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = "";
    
    if (error.status === 401) {
      console.log(error);
      
      if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = error.error.message;
      }else if (error.error && error.error.errorCode) {
        // Si l'erreur a un format spécifique
        switch (error.error.errorCode) {
            case "ACCOUNT_BLOCKED":
                errorMessage = "Votre compte est bloqué, prière contacter l'administrateur";
                break;
            case "MUST_CHANGE_PASSWORD":        
                // Redirigez vers la page de changement de mot de passe
                this.router.navigate(['/change-password'], { 
                  queryParams: { 
                    mustChangePassword: true 
                  } 
                });
                errorMessage = "Vous devez modifier votre mot de passe";
                break;
            default:
                errorMessage = "Nom d'utilisateur ou mot de passe incorrect !";
        }
      } else {
          errorMessage = "Nom d'utilisateur ou mot de passe incorrect !";
      }
    } else {
        errorMessage = error.message || "Une erreur s'est produite";
    }

    return throwError(() => errorMessage);
  }


  /**
   * Change user password
   * @param changePasswordData 
   * @returns 
   */
  changePassword(changePasswordData: any): Observable<any> {
    return this.http.post(`${this.passwordUrl}/password-change`, changePasswordData)
    .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Reset the pasword to default
   * @param username 
   * @returns 
   */
  resetPassword(username: string): Observable<any> {
    return this.http.post(`${this.passwordUrl}/password-reset`, null, {
      params: new HttpParams().set('username', username)
    });
  }

  /**
   * Regenerate the user OPT code for authentication
   * @param username 
   */
  regenerateOPTCode(username: string){
    return this.http.put(`${this.passwordUrl}/${username}/update_code`, null);
  }

  isAdmin(){
    if(this.roles.includes('ADMIN')){
      return true;
    }else{
      return false;
    }
  }

  isSuperAdmin(){
    if(this.roles.includes('SUPERADMIN')){
      return true;
    }else{
      return false;
    }
  }

  isSecretary(){
    if(this.roles.includes('SECRETARY')){
      return true;
    }else{
      return false;
    }
  }

  isDoctor(){
    if(this.roles.includes('DOCTOR')){
      return true;
    }else{
      return false;
    }
  }

  isPatient(){
    if(this.roles.includes('PATIENT')){
      return true;
    }else{
      return false;
    }
  }
}
