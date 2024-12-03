import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UrlStorageService } from './url-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = `${environment.backendUrl}/auth/login`;

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  userId: any;
  permissions:any;
  accessToken: any;
  tokenExpirationTimer: any

  constructor(private http: HttpClient, private router: Router, public urlStorage: UrlStorageService) { }

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
    this.permissions=jwtDecoded.permissions;
    console.log(this.permissions);
    this.username = jwtDecoded.sub.split(" ")[0];
    this.userId = jwtDecoded.sub.split(" ")[1];
    this.roles = jwtDecoded.scope;

    
    window.localStorage.setItem("jwt-token", this.accessToken);

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
  editUser(){
    if(this.permissions.includes('MODIFIER UN UTILISATEUR')){
      return true;
    }else{
   return false;
    }
  }
  createUser(){
    if(this.permissions.includes('CREER UN UTILISATEUR')){
      return true;
    }else{
   return false;
    }
  }

  desactiverUser(){
    if(this.permissions.includes('DESACTIVER UN UTILISATEUR')){
      return true;
    }else{
   return false;
    }
  }

  createRole(){
    if(this.permissions.includes('CREER UN ROLE')){
      return true;
    }else{
   return false;
    }
  }

  editRole(){
    if(this.permissions.includes('MODIFIER UN ROLE')){
      return true;
    }else{
   return false;
    }
  }
  deleteRole(){
    if(this.permissions.includes('SUPPRIMER UN ROLE')){
      return true;
    }else{
   return false;
    }
  }

  createHospital(){
    if(this.permissions.includes('CREER UN HOPITAL')){
      console.log(true);
      return true;
    }else{
   return false;
    }
  }

  editHospital(){
    if(this.permissions.includes('MODIFIER UN HOPITAL')){
      return true;
    }else{
   return false;
    }
  }

  deleteHospital(){
    if(this.permissions.includes('SUPPRIMER UN HOPITAL')){
      return true;
    }else{
   return false;
    }
  }

  createSpeciality(){
    if(this.permissions.includes('CREER UNE SPECIALITY')){
      return true;
    }else{
   return false;
    }
  }

  editSpeciality(){
    if(this.permissions.includes('MODIFIER UNE SPECIALITE')){
      return true;
    }else{
   return false;
    }
  }

  deleteSpeciality(){
    if(this.permissions.includes('SUPPRIMER UNE SPECIALITE')){
      return true;
    }else{
   return false;
    }
  }

  createBuilding(){
    if(this.permissions.includes('CREER UN BATIMENT')){
      return true;
    }else{
   return false;
    }
  }

  editBuilding(){
    if(this.permissions.includes('MODIFIER UN BATIMENT')){
      return true;
    }else{
   return false;
    }
  }

  deleteBuilding(){
    if(this.permissions.includes('SUPPRIMER UN BATIMENT')){
      return true;
    }else{
   return false;
    }
  }

  showBuilding(){
    if(this.permissions.includes('CONSULTER LES SALLES DU BATIMENT')){
      return true;
    }else{
   return false;
    }
  }
  showCalendar(){
    if(this.permissions.includes('ACCES AU CALENDRIER')){
      return true;
    }else{
   return false;
    }
  }

  showAvaibility(){
    if(this.permissions.includes('ACCES AU DISPONIBILITES')){
      return true;
    }else{
   return false;
    }
  }
  createMedicalRecord(){
    if(this.permissions.includes('CREER UN DOSSIER MEDICAL')){
      return true;
    }else{
   return false;
    }
  }

  showMedicalRecord(){
    if(this.permissions.includes('CONSULTER UN DOSSIER MEDICAL')){
      return true;
    }else{
   return false;
    }
  }



}
