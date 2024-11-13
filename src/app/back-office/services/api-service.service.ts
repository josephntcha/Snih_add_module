import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Analysis, Building, InfoMedicalRecord, TypeConstant } from '../../core/models/model';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = 'http://127.0.0.1:8080';
  constructor(private http: HttpClient) {}


  private  createAuthorization(): HttpHeaders | null {
    const jwtToken = localStorage.getItem("jwt-token");
      
    if (jwtToken) {

      return new HttpHeaders({'Authorization': `Bearer ${jwtToken}`});
    } else {
      console.log("Token not found");
      return null;
    }
  }

  postLogin(username: string, password: string): Observable<any> {
    let params = new HttpParams().set("username", username).set("password", password);
     const options = {
     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
     };
  
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`,params,options);
  }

  postVerifyIdentity(numero:any,code:any): Observable<any> {
   
    return this.http.post<any>(`${this.apiUrl}/api/users/verify-identity?phone=${numero}&code=${code}`,{ responseType: 'text' as 'json' });
  }
 
  getPatinetAppointments(patientId:any):Observable<any>{
    
    return this.http.get<any>(`${this.apiUrl}/api/users/patients/${patientId}/appointments`);
  }


  getDataHospitals():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/hospitals`);
  }

  getDataSpecialities():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/specialities`);
  }

  getRights():Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {

    return this.http.get<any>(`${this.apiUrl}/api/roles`,{headers});
    }else{
    return throwError(()=>new Error("Authorization not allow."));
    }
  }

   getDataFrequencies():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/frequencies`);
  }

   getDataHospitalsByDoctor(id:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/doctors/${id}/hospitals`);
  }

  getDataMedicalRecordPatient(patientId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${patientId}`);
  }

 getAvailabilitiesByDoctorAndHospital(doctorId:number,hospitalid:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${doctorId}/${hospitalid}/availabilities`);
  }
  
  getAutorities():Observable<any>{
   const headers=this.createAuthorization();
   
   if (headers) {
    
    return this.http.get<any>(`${this.apiUrl}/api/rights`,{headers});
   }else{

    return throwError(()=>new Error("Authorization not allow."));
   }
  }
  getSecretary(hospitalId:number,specialityId:number):Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {

    return this.http.get<any>(`${this.apiUrl}/api/users/hospitals/${hospitalId}/specialities/${specialityId}/secretaries`,{headers});
    }else{

      return throwError(()=>new Error("Authorization not allow."));
    }
  }

   getDaysForAvailability(dayId:any,numOfMonth:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/api/days/${dayId}/month/${numOfMonth}`);
  }

  getDaysForAvailability2(dayId:any,orderOfDay:any,numOfMonth:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/api/days/${dayId}/${orderOfDay}/period/${numOfMonth}`);
  }

  getDataDoctors():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/doctors`);
  }
 

  getSpecialitiesByHospital(id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${id}/specialities`);
  }

  getRooms(hospitalId:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/rooms/${hospitalId}`);
  }

  getBuildings(hospitalId:number): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.apiUrl}/api/buildings/${hospitalId}`);
  }

  postBuilding(hospitalId:number,building:any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/api/buildings/${hospitalId}`,building);
  }

  // putBuilding(hospitalId:number,buildingId:any,data:any): Observable<any> {

  //   return this.http.put<any>(`${this.apiUrl}/api/buildings/update_building/${hospitalId}/${buildingId}`,data);
  //   return this.http.put<any>(`${this.apiUrl}/api/rooms/update_room/${hospitalId}/${roomId}`,data);
  // }

  postRoom(buildingId:any,room:any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/api/rooms/${buildingId}`,room);
  }

  // putRoom(hospitalId:number,roomId:any,data:any): Observable<any> {
  //  console.log(data);
   
  //   return this.http.put<any>(`${this.apiUrl}/api/rooms/update_room/${hospitalId}/${roomId}`,data);
  // }

  putAvailability(availabilityId:number,dayId:any,doctorId:any,hospitalId:any,data:any): Observable<any> {

    return this.http.put<any>(`${this.apiUrl}/api/update/availability/${availabilityId}/${dayId}/${doctorId}/${hospitalId}`,data);
  }

  getAvailabilitiesByHospitalAndSpeciality(hospitalId:number, specialityId:number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/api/specialities/${specialityId}/${hospitalId}/availabilities`);
  }

  getPriceByHospitalAndSpeciality(hospitalId:number, specialityId:number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/api/specialities/${specialityId}/${hospitalId}/price`);
  }

  getDoctorAvailabilities(doctorId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/availabilities/${doctorId}`);
  }

  getAvailabilitiesById(availabilityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/availabilities/${availabilityId}`);
  }

  getDoctorHospitalSpeciality(hospitalId:number,specialityId:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${hospitalId}/specialities/${specialityId}/doctors`);
  }

  getAppointmentsDoctor(hospitalId:number,specialityId:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${hospitalId}/speciality/${specialityId}/doctors`);
  }
  
  

  getDays():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/days`);
  }

  getUsers():Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/users`,{headers}); 
    }else{
      return throwError(()=>new Error("Authorization not allow."));
    }
  }
  
  getUserById(id:number):Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/users/${id}`,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow."));
    }
  }

  getDoctorGiveRight(rightId:number,userId:number):Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/users/doctors/${rightId}/${userId}`,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow."));
    }
  }

  
  getMaxNumberForAvaillability(availabilityId:number,hospitalId:number,specialityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/availabilities/${availabilityId}/hospitals/${hospitalId}/specialities/${specialityId}`);
  }
  getDataRoles():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/roles`);
  }
  

  getDoctorsByHospital(hospitalId:any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${hospitalId}/doctors`);
  }

  postAppointment(availabilityId:number,hospitalId:number,data:any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/api/appointments/${availabilityId}/${hospitalId}`,data);
  }

  postDoctor(data:any): Observable<any> {
    const headers=this.createAuthorization();
      if (headers) {
        return this.http.post<any>(`${this.apiUrl}/api/users/save-doctor`,data,{headers});
      }else{
        return throwError(()=>new Error("Authorization not allow."));
      }
    }

  postAdmin(hospitalId:number,data:any): Observable<any> {
    const headers=this.createAuthorization();
      if (headers) {
        
        return this.http.post<any>(`${this.apiUrl}/api/users/save-staff/${hospitalId}`,data,{headers});
      }else{
        return throwError(()=>new Error("Authorization not allow."));
      }
  }

  
  postAddSpecialityHospital(hospitalId:number,specialityId:number,data:any): Observable<any> {
    let params = new HttpParams().set("price", data);
    const headers=this.createAuthorization();
    if (headers) {

    return this.http.post<any>(`${this.apiUrl}/api/hospitals/${hospitalId}/${specialityId}`,params,{headers});
    }else{
      
      return throwError(()=>new Error("Authorization not allow."));
    }

  }

    
  postAddDoctorHospital(doctorId:any,hospitalId:any): Observable<any> {
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/users/${doctorId}/hospitals/${hospitalId}`,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow."));
    }

  }

  confirmAppointment(appointmentId:number){
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/confirm`,{},{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
    }
  }


  followAppointment(appointmentId:number,newDate:any){
    
    let params = new HttpParams().set("newDate", newDate);
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/follow?newDate=${newDate}`,{},{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
    }
  }

   postponeAppointment(appointmentId:number,nouvelleDate:any){
    const headers=this.createAuthorization();
    if (headers) {
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/postpone?newDate=${nouvelleDate}`,null,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));

    }
  }

  
  postSpeciality(data:any){
    const headers=this.createAuthorization();
    if (headers) {

    return this.http.post<any>(`${this.apiUrl}/api/specialities`,data,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
    }
  }


  /**
   * Test the if the creation of appointment is possible
   * @param availabilityId 
   * @param hospitalId 
   * @param appointment 
   * @returns 
   */
  testAppointmentSaving(availabilityId: number, hospitalId: number, appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/appointments/${availabilityId}/${hospitalId}/verify`, appointment)
  }


  postAvailability(dayId:number,doctorId:number,hospitalId:number,data:any){
    const headers=this.createAuthorization();
    if (headers) {

      return this.http.post<any>(`${this.apiUrl}/api/availabilities/${dayId}/${doctorId}/${hospitalId}`,data,{headers});
    }else{
    return throwError(()=>new Error("Authorization not allow"));

    }
  }
  
  
  postHospital(data:any){
    const headers=this.createAuthorization();
    if (headers) {
    return this.http.post<any>(`${this.apiUrl}/api/hospitals`,data,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
    } 
  }

  postAutority(secretaryId:number,rightId:number,doctorId:number){
    const headers=this.createAuthorization();
    if (headers) {

    return this.http.post<any>(`${this.apiUrl}/api/users/${secretaryId}/grantrights/${rightId}/${doctorId}`,null,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
      
    }
  }
  
  deleteAppointment(appointmentId:number){
    const headers=this.createAuthorization();
    if (headers) {
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/cancel`,{},{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));
    }
  }

  getDataPatient():Observable<any>{
    const headers=this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/users/patients`,{headers});
    }else{
      return throwError(()=>new Error("Authorization not allow"));

    }
  }

  
  getPatientMedicalRecord(patientId:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${patientId}`);
  }

/**
  * Create patient medical record
  * @param patientId this id of the patient
  * @returns 
*/
  postMedicalRecord(patientId:number): Observable<any> {
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/medical-records/${patientId}/new`, null, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }        
  }


  /**
   * Save new data in medical record
   * @param infoMedRecord 
   * @param medicalRecId 
   * @returns 
   */
  createInforMedicalRecord(infoMedRecord: InfoMedicalRecord, medicalRecId: number): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${medicalRecId}`, infoMedRecord, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }        
  }

  /**
   * Get a medical record by its id
   * @param medicalRecorid 
   * @returns 
   */
  getMedicalRecord(medicalRecorid: number): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/medical-records/${medicalRecorid}/find`);
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }  
  }

  /**
   * Find a medical record by the patient firstName and lastName
   * @param firstName 
   * @param lastName 
   * @returns 
   */
  searchMedicalRecord(firstName: string, lastName: string): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/medical-records/search?firstName=${firstName}&lastName=${lastName}`, {headers})
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
     * Find a medical record by the patient firstName and lastName
     * @param firstName 
     * @param lastName 
     * @returns 
     */
  searchMedicalRecordByCode(code: string): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/medical-records?code=${code}`, {headers})
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Get all type of constants
   * @returns 
   */
  getTypeConstants(): Observable<TypeConstant[]> {
    return this.http.get<TypeConstant[]>(`${this.apiUrl}/api/typeconstants`);
  }

  /**
   * Get all analysis
   * @returns 
   */
  getAnalyses(): Observable<Analysis[]> {
    return this.http.get<Analysis[]>(`${this.apiUrl}/api/analysis`);
  }


  addConstant(infoMedRecord: InfoMedicalRecord, recordId: number): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${recordId}/save-constants`, infoMedRecord, {headers})
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Add analysis and results to medical record
   * @param infoMedRecord 
   * @param recordId 
   * @returns 
   */
  addAnalysisResult(infoMedRecord: InfoMedicalRecord, recordId: number): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${recordId}/save-analysis-result`, infoMedRecord, {headers})
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Add analysis and result from a pdf file to medical record
   * @param forkJoin the source file
   * @param recordId the id of the medical record
   * @returns 
   */
  addAnalysisResultFromFile(formData: FormData, recordId: number): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      const url = `${this.apiUrl}/api/analysis/upload-pdf/${recordId}`;
      return this.http.post(url, formData, {
        reportProgress: true,
        observe: 'events'
      });
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Get the info medical record of the current day
   * @param medicalRecordId 
   * @returns 
   */
  getCurrentDayInfoMedRecord(medicalRecordId: number): Observable<InfoMedicalRecord> {
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<InfoMedicalRecord>(`${this.apiUrl}/api/info_medical_records/${medicalRecordId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }


  /**
   * Remove a speciality
   * @param specialityId 
   * @returns 
   */
  deleteSpeciality(specialityId: number){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.delete<any>(`${this.apiUrl}/api/specialities/${specialityId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }


  /**
   * Remove a hospital
   * @param hospitalId 
   * @returns 
   */
  deleteHospital(hospitalId: number){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.delete<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }


  /**
   * Delete a user
   * @param userId 
   * @returns 
   */
  manageUser(userId: number, action: string){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.patch<any>(`${this.apiUrl}/api/users/${userId}/action?action=${action}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Delete a role
   * @param roleId 
   * @returns 
   */
  deleteRole(roleId: number){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.delete<any>(`${this.apiUrl}/api/roles/${roleId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }
  
  // Delete a building
  deleteBuilding(buildingId: number){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.delete<any>(`${this.apiUrl}/api/buildings/${buildingId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  // Delete a room
  deleteRoom(roomId: number){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.delete<any>(`${this.apiUrl}/api/rooms/${roomId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Update a user
   * @param userId 
   * @param user 
   * @returns 
   */
  updateUser(userId: number, user: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/users/${userId}`, user, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Update a hospital
   * @param hospitalId 
   * @param hospital 
   * @returns 
   */
  updateHospital(hospitalId: number, hospital: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`, hospital, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }
  
  /**
   * Update a speciality
   * @param specialityId 
   * @param speciality 
   * @returns 
   */
  updateSpeciality(specialityId: number, speciality: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/specialities/${specialityId}`, speciality, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  updateBuilding(buildingId: any, building: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/buildings/update_building/${buildingId}`, building, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  updateRoom(roomId: number, room: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/rooms/update_room/${roomId}`, room, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  updateRole(roleId: number, role: any){
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.put<any>(`${this.apiUrl}/api/roles/${roleId}/update`, role, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  saveRole(role: any): Observable<any>{
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.post<any>(`${this.apiUrl}/api/roles`, role, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Get a speciality by its id
   * @param specialityId 
   * @returns 
   */
  getSpecialityById(specialityId: number): Observable<any> {
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/specialities/${specialityId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }

  /**
   * Get a hospital by its id
   * @param hospitalId 
   * @returns 
   */
  getHospitalById(hospitalId: number): Observable<any> {
    const headers = this.createAuthorization();
    if (headers) {
      return this.http.get<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`, {headers});
    }else{
      return throwError(()=>new Error("Autorization non accordée"));
    }
  }


  getAppointmentsByAvailability(availabilityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/availabilities/${availabilityId}/appointments`);
  }
}
