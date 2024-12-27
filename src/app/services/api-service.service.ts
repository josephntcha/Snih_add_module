import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Analysis, Building, InfoMedicalRecord, Module, Permission, TypeConstant } from '../models/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = environment.backendUrl;

  private modulesSubject = new BehaviorSubject<Module[]>([]);
  public modules$ = this.modulesSubject.asObservable();

  constructor(private http: HttpClient) {}
 

  postLogin(username: string, password: string): Observable<any> {
    let params = new HttpParams().set("username", username).set("password", password);
    const options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(`${this.apiUrl}/auth/login`,params,options);
  }

  postVerifyIdentity(numero:any,code:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/verify-identity?phone=${numero}&code=${code}`,{ responseType: 'text' as 'json' });
  }
 
  getPatinetAppointments(patientId:any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/patients/${patientId}/appointments`);
  }

  getDataHospitals():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/hospitals`);
  }

  getConstantes():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/typeconstants`);
  }

  getAnalysis():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/analysis`);
  }

  postAnalysis(data:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/analysis`,data);
  }

  updateAnalysis(id:number,data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/analysis/${id}`,data);
  }

 postConstantes(data:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/typeconstants`,data);
  }

  updateConstantes(id:number,data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/typeconstants/${id}`,data);
  }

  getDataSpecialities():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/specialities`);
  }

  getRights():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }

   getDataFrequencies():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/frequencies`);
  }

   getDataHospitalsByDoctor(id:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/doctors/${id}/hospitals`);
  }

  getDataMedicalRecordPatient(patientId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/medical-records/${patientId}`);
  }

 getAvailabilitiesByDoctorAndHospital(doctorId:number,hospitalid:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/hospitals/${doctorId}/${hospitalid}/availabilities`);
  }
  
  getAutorities():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/rights`);
  }

  getSecretary(hospitalId:number,specialityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/hospitals/${hospitalId}/specialities/${specialityId}/secretaries`);
  }

   getDaysForAvailability(dayId:any,numOfMonth:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/days/${dayId}/month/${numOfMonth}`);
  }

  getDaysForAvailability2(dayId:any,orderOfDay:any,numOfMonth:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/days/${dayId}/${orderOfDay}/period/${numOfMonth}`);
  }

  getDataDoctors():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/doctors`);
  }
 
  getSpecialitiesByHospital(id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hospitals/${id}/specialities`);
  }

  getRooms(hospitalId:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rooms/${hospitalId}`);
  }

  getBuildings(hospitalId:number): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.apiUrl}/buildings/${hospitalId}`);
  }

  postBuilding(hospitalId:number,building:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buildings/${hospitalId}`,building);
  }

  postRoom(buildingId:any,room:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rooms/${buildingId}`,room);
  }

  putAvailability(availabilityId:number,dayId:any,doctorId:any,hospitalId:any,data:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/availability/${availabilityId}/${dayId}/${doctorId}/${hospitalId}`,data);
  }

  getAvailabilitiesByHospitalAndSpeciality(hospitalId:number, specialityId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specialities/${specialityId}/${hospitalId}/availabilities`);
  }

  getPriceByHospitalAndSpeciality(hospitalId:number, specialityId:number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/specialities/${specialityId}/${hospitalId}/price`);
  }

  getDoctorAvailabilities(doctorId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/availabilities/${doctorId}`);
  }

  getAvailabilitiesById(availabilityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/availabilities/${availabilityId}`);
  }

  getDoctorHospitalSpeciality(hospitalId:number,specialityId:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/hospitals/${hospitalId}/specialities/${specialityId}/doctors`);
  }

  getAppointmentsDoctor(hospitalId:number,specialityId:number):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/hospitals/${hospitalId}/speciality/${specialityId}/doctors`);
  }
  
  

  getDays():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/days`);
  }

  /**
   * Get all users
   * @returns 
   */
  getUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users`); 
  }

  /**
   * Get all staff of a hospital
   * @param userId The id of the connected user whose hospital will be considered
   * @returns 
   */
  getStaff(userId: number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/staff`); 
  }
  
  getUserById(id:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  getDoctorGiveRight(rightId:number,userId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/doctors/${rightId}/${userId}`);
  }

  
  getMaxNumberForAvaillability(availabilityId:number,hospitalId:number,specialityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/availabilities/${availabilityId}/hospitals/${hospitalId}/specialities/${specialityId}`);
  }
  getDataRoles():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }
  

  getDoctorsByHospital(hospitalId:any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/hospitals/${hospitalId}/doctors`);
  }

  postAppointment(availabilityId:number,hospitalId:number,data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments/${availabilityId}/${hospitalId}`,data);
  }

  postDoctor(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/save-doctor`,data);
  }

  postAdmin(hospitalId:number,data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/save-staff/${hospitalId}`,data);
  }

  
  postAddSpecialityHospital(hospitalId:number,specialityId:number,data:any): Observable<any> {
    let params = new HttpParams().set("price", data);
    return this.http.post<any>(`${this.apiUrl}/hospitals/${hospitalId}/${specialityId}`,params);
  }

    
  postAddDoctorHospital(doctorId:any,hospitalId:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${doctorId}/hospitals/${hospitalId}`, null);
  }

  confirmAppointment(appointmentId:number){
    return this.http.patch<any>(`${this.apiUrl}/appointments/${appointmentId}/confirm`,{});
  }


  followAppointment(appointmentId:number,newDate:any,availabilityId:any,doctorId:number){
    let params = new HttpParams().set("newDate", newDate);
    return this.http.patch<any>(`${this.apiUrl}/appointments/${appointmentId}/follow/availability/${availabilityId}/doctor/${doctorId}?newDate=${newDate}`,null);
  }

   postponeAppointment(appointmentId:number,nouvelleDate:any,availabilityId:any,doctorId:any){
    return this.http.patch<any>(`${this.apiUrl}/appointments/${appointmentId}/availability/${availabilityId}/doctor/${doctorId}/postpone?newDate=${nouvelleDate}`,null);

  }

  
  postSpeciality(data:any){
    return this.http.post<any>(`${this.apiUrl}/specialities`,data);
  }


  /**
   * Test the if the creation of appointment is possible
   * @param availabilityId 
   * @param hospitalId 
   * @param appointment 
   * @returns 
   */
  testAppointmentSaving(availabilityId: number, hospitalId: number, appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments/${availabilityId}/${hospitalId}/verify`, appointment)
  }


  postAvailability(dayId:number,doctorId:number,hospitalId:number,data:any){
    return this.http.post<any>(`${this.apiUrl}/availabilities/${dayId}/${doctorId}/${hospitalId}`, data);
  }
  
  
  postHospital(data:any){
    return this.http.post<any>(`${this.apiUrl}/hospitals`,data); 
  }

  postAutority(secretaryId:number,rightId:number,doctorId:number){
    return this.http.post<any>(`${this.apiUrl}/users/${secretaryId}/grantrights/${rightId}/${doctorId}`,null);  
  }
  
  deleteAppointment(appointmentId:number){
    return this.http.patch<any>(`${this.apiUrl}/appointments/${appointmentId}/cancel`,{});
  }

  getDataPatient():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/patients`);
  }

  
  getPatientMedicalRecord(patientId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/medical-records/${patientId}`);
  }

  /**
   * Get all the appointments of a patient by his username (code)
   * @param patientUsername 
   * @returns 
   */
  getPatientAppointmentsByUsername(patientUsername: string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/users/patients/appointments?username=${patientUsername}`);
  }

/**
  * Create patient medical record
  * @param patientId this id of the patient
  * @param userId the connected user who is creating
  * @returns 
*/
  postMedicalRecord(patientId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/medical-records/${patientId}/${userId}/new`, null);        
  }


  /**
   * Save new data in medical record
   * @param infoMedRecord 
   * @param medicalRecId 
   * @returns 
   */
  createInforMedicalRecord(infoMedRecord: InfoMedicalRecord, medicalRecId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/info_medical_records/${medicalRecId}`, infoMedRecord);        
  }

  /**
   * Get a medical record by its id
   * @param medicalRecorid 
   * @returns 
   */
  getMedicalRecord(medicalRecorid: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/medical-records/${medicalRecorid}/find`);  
  }

  /**
   * Find a medical record by the patient firstName and lastName
   * @param firstName 
   * @param lastName 
   * @returns 
   */
  searchMedicalRecord(userId: number, firstName: string, lastName: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/medical-records/${userId}/search?firstName=${firstName}&lastName=${lastName}`)
  }

  /**
     * Find a medical record by the patient firstName and lastName
     * @param firstName 
     * @param lastName 
     * @returns 
     */
  searchMedicalRecordByCode(userId: number, code: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/medical-records/${userId}/code?code=${code}`)
  }

  /**
   * Transfer a medical record to another speciality
   * @param recordId the id of the medical record
   * @param specialityId target speciality id
   * @returns 
   */
  transferRecordToSpeciality(recordId: number, specialityId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/medical-records/${recordId}/${specialityId}`, null)
  }

  /**
   * Get all type of constants
   * @returns 
   */
  getTypeConstants(): Observable<TypeConstant[]> {
    return this.http.get<TypeConstant[]>(`${this.apiUrl}/typeconstants`);
  }

  /**
   * Get all analysis
   * @returns 
   */
  getAnalyses(): Observable<Analysis[]> {
    return this.http.get<Analysis[]>(`${this.apiUrl}/analysis`);
  }


  addConstant(infoMedRecord: InfoMedicalRecord, recordId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/info_medical_records/${recordId}/save-constants`, infoMedRecord)
  }

  /**
   * Add analysis and results to medical record
   * @param infoMedRecord 
   * @param recordId 
   * @returns 
   */
  addAnalysisResult(infoMedRecord: InfoMedicalRecord, recordId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/info_medical_records/${recordId}/save-analysis-result`, infoMedRecord)
  }

  /**
   * Add analysis and result from a pdf file to medical record
   * @param forkJoin the source file
   * @param recordId the id of the medical record
   * @returns 
   */
  addAnalysisResultFromFile(formData: FormData, recordId: number): Observable<any>{
    const url = `${this.apiUrl}/analysis/upload-pdf/${recordId}`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Get the info medical record of the current day
   * @param medicalRecordId 
   * @returns 
   */
  getCurrentDayInfoMedRecord(medicalRecordId: number): Observable<InfoMedicalRecord> {
    return this.http.get<InfoMedicalRecord>(`${this.apiUrl}/info_medical_records/${medicalRecordId}`);
  }


  /**
   * Remove a speciality
   * @param specialityId 
   * @returns 
   */
  deleteSpeciality(specialityId: number){
    return this.http.delete<any>(`${this.apiUrl}/specialities/${specialityId}`);
  }


  /**
   * Remove a hospital
   * @param hospitalId 
   * @returns 
   */
  deleteHospital(hospitalId: number){
    return this.http.delete<any>(`${this.apiUrl}/hospitals/${hospitalId}`);
  }


  /**
   * Delete a user
   * @param userId 
   * @returns 
   */
  manageUser(userId: number, action: string){
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}/action?action=${action}`, null);
  }

  /**
   * Delete a role
   * @param roleId 
   * @returns 
   */
  deleteRole(roleId: number){
    return this.http.delete<any>(`${this.apiUrl}/roles/${roleId}`);
  }
  
  // Delete a building
  deleteBuilding(buildingId: number){
    return this.http.delete<any>(`${this.apiUrl}/buildings/${buildingId}`);
  }

  // Delete a room
  deleteRoom(roomId: number){
    return this.http.delete<any>(`${this.apiUrl}/rooms/${roomId}`);
  }

  /**
   * Update a user
   * @param userId 
   * @param user 
   * @returns 
   */
  updateUser(userId: number, user: any){
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, user);
  }

  /**
   * Update a hospital
   * @param hospitalId 
   * @param hospital 
   * @returns 
   */
  updateHospital(hospitalId: number, hospital: any){
    return this.http.put<any>(`${this.apiUrl}/hospitals/${hospitalId}`, hospital);
  }
  
  /**
   * Update a speciality
   * @param specialityId 
   * @param speciality 
   * @returns 
   */
  updateSpeciality(specialityId: number, speciality: any){
    return this.http.put<any>(`${this.apiUrl}/specialities/${specialityId}`, speciality);
  }

  updateBuilding(buildingId: any, building: any){
    return this.http.put<any>(`${this.apiUrl}/buildings/update_building/${buildingId}`, building);
  }

  updateRoom(roomId: number, room: any){
    return this.http.put<any>(`${this.apiUrl}/rooms/update_room/${roomId}`, room);
  }

  updateRole(roleId: number, role: any){
    return this.http.put<any>(`${this.apiUrl}/roles/${roleId}/update`, role);
  }

  saveRole(role: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/roles`, role);
  }

  /**
   * Get a speciality by its id
   * @param specialityId 
   * @returns 
   */
  getSpecialityById(specialityId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specialities/${specialityId}`);
  }

  /**
   * Get a hospital by its id
   * @param hospitalId 
   * @returns 
   */
  getHospitalById(hospitalId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hospitals/${hospitalId}`);
  }

  /**
   * Get all accessible module for the connected user
   * @returns 
   */
  loadAccessibleModules(username: string): Observable<any> {    
      return this.http.get<any>(`${this.apiUrl}/modules/hierarchy?username=${username}`)
      .pipe(
        tap(modules => this.modulesSubject.next(modules))
      );
  }

  /**
   * Get all permissions
   * @returns 
   */
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<any>(`${this.apiUrl}/permissions`);
  }

  /**
   * Get permissions a user has on a component
   * @param userId 
   * @param componentName 
   * @returns 
   */
  getUserPermissionsOnComponent(userId: number, componentName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permissions/users/${userId}?componentName=${componentName}`);
  }

  /**
   * Grant a permission to a user
   * @param userId 
   * @param permissionId 
   * @returns 
   */
  grantPermissionToUser(userId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/permissions/users/${userId}/grant`, permissionIds);
  }

  /**
   * Remove a permission from a user
   * @param userId 
   * @param permissionId 
   * @returns 
   */
  removeUserPermission(userId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/permissions/users/${userId}/remove`, permissionIds);
  }

  /**
   * Grant a permission to a role
   * @param roleId 
   * @param permissionId 
   * @returns 
   */
  setPermissionToRole(roleId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/permissions/roles/${roleId}/grant`, permissionIds);
  }

  /**
   * remove a permission from a role
   * @param roleId 
   * @param permissionId 
   * @returns 
   */
  removePermissionFromRole(roleId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/permissions/roles/${roleId}/remove`, permissionIds);
  }

  /**
   * Assign a role to a user
   * @param roleId 
   * @param userId 
   * @returns 
   */
  assignRoleToUser(roleId: number, userId: number){
    return this.http.post<any>(`${this.apiUrl}/roles/${roleId}/users/${userId}/assign`, null);
  }

  /**
   * Substract a role from a user
   * @param roleId 
   * @param userId 
   * @returns 
   */
  substractUserFromRole(roleId: number, userId: number){
    return this.http.post<any>(`${this.apiUrl}/roles/${roleId}/users/${userId}/substract`, null);
  }


  getAppointmentsByAvailability(availabilityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/availabilities/${availabilityId}/appointments`);
  }
}
