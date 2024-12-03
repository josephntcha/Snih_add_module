import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UrlStorageService } from './url-storage.service';
import { environment } from '../../environments/environment';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = `${environment.backendUrl}/auth/login`;

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  userId: any;
  userModules: any[] = [];
  accessToken: any;
  tokenExpirationTimer: any

  constructor(private http: HttpClient, private router: Router, public urlStorage: UrlStorageService, private apiService: ApiServiceService) { }

  login(username: string, password: string){
    const params = new HttpParams().set("username", username).set("password", password);
    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    };
    return this.http.post(this.baseUrl, params, options).pipe(
      catchError(this.handleError)
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
      this.router.navigateByUrl("/Administration");
    }
    this.urlStorage.clearLastVisitUrl();
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = ""
    if(error.status === 401){
      const serverMessage = error.error || '';
      if(serverMessage.errorCode === "ACCOUNT_BLOCKED"){
        errorMessage = "Votre compte est bloqué, prière contacter l'adminitrateur";
      }else{
        errorMessage = "Nom d'utilisateur ou mot de passe incorrect !";
      }
    }
    return throwError(() => errorMessage);
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
