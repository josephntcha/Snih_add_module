import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Analysis, Building, InfoMedicalRecord, Module, Permission, TypeConstant } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = 'http://127.0.0.1:8080';

  private modulesSubject = new BehaviorSubject<Module[]>([]);
  public modules$ = this.modulesSubject.asObservable();

  constructor(private http: HttpClient) {}
 

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

  getConstantes():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/typeconstants`);
  }

  getAnalysis():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/analysis`);
  }

  postAnalysis(data:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/analysis`,data);
  }

  updateAnalysis(id:number,data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/api/update/${id}/analysis`,data);
  }

 postConstantes(data:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/typeconstants`,data);
  }

  updateConstantes(id:number,data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/api/update/${id}/typeconstants`,data);
  }

  getDataSpecialities():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/specialities`);
  }

  getRights():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/roles`);
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
    return this.http.get<any>(`${this.apiUrl}/api/rights`);
  }

  getSecretary(hospitalId:number,specialityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/hospitals/${hospitalId}/specialities/${specialityId}/secretaries`);
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

  postRoom(buildingId:any,room:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/rooms/${buildingId}`,room);
  }

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

  /**
   * Get all users
   * @returns 
   */
  getUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users`); 
  }

  /**
   * Get all staff of a hospital
   * @param userId The id of the connected user whose hospital will be considered
   * @returns 
   */
  getStaff(userId: number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/${userId}/staff`); 
  }
  
  getUserById(id:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/${id}`);
  }

  getDoctorGiveRight(rightId:number,userId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/doctors/${rightId}/${userId}`);
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
    return this.http.post<any>(`${this.apiUrl}/api/users/save-doctor`,data);
  }

  postAdmin(hospitalId:number,data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users/save-staff/${hospitalId}`,data);
  }

  
  postAddSpecialityHospital(hospitalId:number,specialityId:number,data:any): Observable<any> {
    let params = new HttpParams().set("price", data);
    return this.http.post<any>(`${this.apiUrl}/api/hospitals/${hospitalId}/${specialityId}`,params);
  }

    
  postAddDoctorHospital(doctorId:any,hospitalId:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users/${doctorId}/hospitals/${hospitalId}`, null);
  }

  confirmAppointment(appointmentId:number){
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/confirm`,{});
  }


  followAppointment(appointmentId:number,newDate:any){
    let params = new HttpParams().set("newDate", newDate);
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/follow?newDate=${newDate}`,{});
  }

   postponeAppointment(appointmentId:number,nouvelleDate:any){
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/postpone?newDate=${nouvelleDate}`,null);

  }

  
  postSpeciality(data:any){
    return this.http.post<any>(`${this.apiUrl}/api/specialities`,data);
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
    return this.http.post<any>(`${this.apiUrl}/api/availabilities/${dayId}/${doctorId}/${hospitalId}`, data);
  }
  
  
  postHospital(data:any){
    return this.http.post<any>(`${this.apiUrl}/api/hospitals`,data); 
  }

  postAutority(secretaryId:number,rightId:number,doctorId:number){
    return this.http.post<any>(`${this.apiUrl}/api/users/${secretaryId}/grantrights/${rightId}/${doctorId}`,null);  
  }
  
  deleteAppointment(appointmentId:number){
    return this.http.patch<any>(`${this.apiUrl}/api/appointments/${appointmentId}/cancel`,{});
  }

  getDataPatient():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/patients`);
  }

  
  getPatientMedicalRecord(patientId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${patientId}`);
  }

  /**
   * Get all the appointments of a patient by his username (code)
   * @param patientUsername 
   * @returns 
   */
  getPatientAppointmentsByUsername(patientUsername: string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/users/patients/appointments?username=${patientUsername}`);
  }

/**
  * Create patient medical record
  * @param patientId this id of the patient
  * @param userId the connected user who is creating
  * @returns 
*/
  postMedicalRecord(patientId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/medical-records/${patientId}/${userId}/new`, null);        
  }


  /**
   * Save new data in medical record
   * @param infoMedRecord 
   * @param medicalRecId 
   * @returns 
   */
  createInforMedicalRecord(infoMedRecord: InfoMedicalRecord, medicalRecId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${medicalRecId}`, infoMedRecord);        
  }

  /**
   * Get a medical record by its id
   * @param medicalRecorid 
   * @returns 
   */
  getMedicalRecord(medicalRecorid: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${medicalRecorid}/find`);  
  }

  /**
   * Find a medical record by the patient firstName and lastName
   * @param firstName 
   * @param lastName 
   * @returns 
   */
  searchMedicalRecord(userId: number, firstName: string, lastName: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${userId}/search?firstName=${firstName}&lastName=${lastName}`)
  }

  /**
     * Find a medical record by the patient firstName and lastName
     * @param firstName 
     * @param lastName 
     * @returns 
     */
  searchMedicalRecordByCode(userId: number, code: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/medical-records/${userId}/code?code=${code}`)
  }

  /**
   * Transfer a medical record to another speciality
   * @param recordId the id of the medical record
   * @param specialityId target speciality id
   * @returns 
   */
  transferRecordToSpeciality(recordId: number, specialityId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/medical-records/${recordId}/${specialityId}`, null)
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
    return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${recordId}/save-constants`, infoMedRecord)
  }

  /**
   * Add analysis and results to medical record
   * @param infoMedRecord 
   * @param recordId 
   * @returns 
   */
  addAnalysisResult(infoMedRecord: InfoMedicalRecord, recordId: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/info_medical_records/${recordId}/save-analysis-result`, infoMedRecord)
  }

  /**
   * Add analysis and result from a pdf file to medical record
   * @param forkJoin the source file
   * @param recordId the id of the medical record
   * @returns 
   */
  addAnalysisResultFromFile(formData: FormData, recordId: number): Observable<any>{
    const url = `${this.apiUrl}/api/analysis/upload-pdf/${recordId}`;
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
    return this.http.get<InfoMedicalRecord>(`${this.apiUrl}/api/info_medical_records/${medicalRecordId}`);
  }


  /**
   * Remove a speciality
   * @param specialityId 
   * @returns 
   */
  deleteSpeciality(specialityId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/specialities/${specialityId}`);
  }


  /**
   * Remove a hospital
   * @param hospitalId 
   * @returns 
   */
  deleteHospital(hospitalId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`);
  }


  /**
   * Delete a user
   * @param userId 
   * @returns 
   */
  manageUser(userId: number, action: string){
    return this.http.patch<any>(`${this.apiUrl}/api/users/${userId}/action?action=${action}`, null);
  }

  /**
   * Delete a role
   * @param roleId 
   * @returns 
   */
  deleteRole(roleId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/roles/${roleId}`);
  }
  
  // Delete a building
  deleteBuilding(buildingId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/buildings/${buildingId}`);
  }

  // Delete a room
  deleteRoom(roomId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/rooms/${roomId}`);
  }

  /**
   * Update a user
   * @param userId 
   * @param user 
   * @returns 
   */
  updateUser(userId: number, user: any){
    return this.http.put<any>(`${this.apiUrl}/api/users/${userId}`, user);
  }

  /**
   * Update a hospital
   * @param hospitalId 
   * @param hospital 
   * @returns 
   */
  updateHospital(hospitalId: number, hospital: any){
    return this.http.put<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`, hospital);
  }
  
  /**
   * Update a speciality
   * @param specialityId 
   * @param speciality 
   * @returns 
   */
  updateSpeciality(specialityId: number, speciality: any){
    return this.http.put<any>(`${this.apiUrl}/api/specialities/${specialityId}`, speciality);
  }

  updateBuilding(buildingId: any, building: any){
    return this.http.put<any>(`${this.apiUrl}/api/buildings/update_building/${buildingId}`, building);
  }

  updateRoom(roomId: number, room: any){
    return this.http.put<any>(`${this.apiUrl}/api/rooms/update_room/${roomId}`, room);
  }

  updateRole(roleId: number, role: any){
    return this.http.put<any>(`${this.apiUrl}/api/roles/${roleId}/update`, role);
  }

  saveRole(role: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/roles`, role);
  }

  /**
   * Get a speciality by its id
   * @param specialityId 
   * @returns 
   */
  getSpecialityById(specialityId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/specialities/${specialityId}`);
  }

  /**
   * Get a hospital by its id
   * @param hospitalId 
   * @returns 
   */
  getHospitalById(hospitalId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/hospitals/${hospitalId}`);
  }

  /**
   * Get all accessible module for the connected user
   * @returns 
   */
  loadAccessibleModules(username: string): Observable<any> {    
      return this.http.get<any>(`${this.apiUrl}/api/modules/hierarchy?username=${username}`)
      .pipe(
        tap(modules => this.modulesSubject.next(modules))
      );
  }

  /**
   * Get all permissions
   * @returns 
   */
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<any>(`${this.apiUrl}/api/permissions`);
  }

  /**
   * Get permissions a user has on a component
   * @param userId 
   * @param componentName 
   * @returns 
   */
  getUserPermissionsOnComponent(userId: number, componentName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/permissions/users/${userId}?componentName=${componentName}`);
  }

  /**
   * Grant a permission to a user
   * @param userId 
   * @param permissionId 
   * @returns 
   */
  grantPermissionToUser(userId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/api/permissions/users/${userId}/grant`, permissionIds);
  }

  /**
   * Remove a permission from a user
   * @param userId 
   * @param permissionId 
   * @returns 
   */
  removeUserPermission(userId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/api/permissions/users/${userId}/remove`, permissionIds);
  }

  /**
   * Grant a permission to a role
   * @param roleId 
   * @param permissionId 
   * @returns 
   */
  setPermissionToRole(roleId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/api/permissions/roles/${roleId}/grant`, permissionIds);
  }

  /**
   * remove a permission from a role
   * @param roleId 
   * @param permissionId 
   * @returns 
   */
  removePermissionFromRole(roleId: number, permissionIds: number[]){
    return this.http.post<any>(`${this.apiUrl}/api/permissions/roles/${roleId}/remove`, permissionIds);
  }

  /**
   * Assign a role to a user
   * @param roleId 
   * @param userId 
   * @returns 
   */
  assignRoleToUser(roleId: number, userId: number){
    return this.http.post<any>(`${this.apiUrl}/api/roles/${roleId}/users/${userId}/assign`, null);
  }

  /**
   * Substract a role from a user
   * @param roleId 
   * @param userId 
   * @returns 
   */
  substractUserFromRole(roleId: number, userId: number){
    return this.http.post<any>(`${this.apiUrl}/api/roles/${roleId}/users/${userId}/substract`, null);
  }


  getAppointmentsByAvailability(availabilityId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/availabilities/${availabilityId}/appointments`);
  }
}
