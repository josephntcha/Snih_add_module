import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceService } from '../../../services/api-service.service';
import { Permission } from '../../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  availabilities: any;
  selectedAppointments: any;   
  hospitals: any;
  hospitalId: any;
  Hospitalform!:FormGroup;
  DoctorId:any;
  specialityId:any;
  Doctor_name: any;
  canViewListAppointment=false;
  constructor(private apiService: ApiServiceService, public authService: AuthService,private formBuilder:FormBuilder,private route:Router){}

  currentDate = moment(); 
  currentMonth: Date = this.currentDate.toDate(); 
  weeks: Date[][] = [];

  ngOnInit(): void {
    this.getConnectedUserPermissionsOnComponent();
      
    this.Hospitalform=this.formBuilder.group({
     hospital:['']
    })  

  

    this.Hospitalform.get('hospital')?.valueChanges.subscribe(selectedHospital=>{
     this.hospitalId=selectedHospital;
     this.apiService.getAvailabilitiesByDoctorAndHospital(this.DoctorId,selectedHospital).subscribe(response=>{
         this.availabilities=response;
     })

    })
    
     this.generateCalendar();
     this.loadAppointments();
}


loadAppointments() {
  this.DoctorId=this.authService.userId;
  this.Doctor_name=this.authService.username;
   this.apiService.getUserById(this.DoctorId).subscribe(response=>{
    this.specialityId=response.data.speciality.id;
   })
  this.apiService.getDataHospitalsByDoctor(this.DoctorId).subscribe(response=>{
    this.hospitals=response;

    if (this.hospitals && this.hospitals.length > 0) {
      this.Hospitalform.controls['hospital'].setValue(this.hospitals[0].id);
    }

    this.apiService.getAvailabilitiesByDoctorAndHospital(this.DoctorId,this.hospitals[0].id).subscribe(response=>{
      this.availabilities=response;
    });
    
   });
  
}


generateCalendar() {
const startOfMonth = moment(this.currentDate).startOf('month');
const endOfMonth = moment(this.currentDate).endOf('month');

let startDate = moment(startOfMonth).startOf('week');
let endDate = moment(endOfMonth).endOf('week');

const weeks = [];
let days = [];

while (startDate.isBefore(endDate)) {
  for (let i = 0; i < 7; i++) {
    days.push(startDate.clone().toDate());
    startDate.add(1, 'day');
  }
  weeks.push(days);
  days = [];
}
this.weeks = weeks;
}


  isOtherMonth(day: Date): boolean {
  if (!day) {
    return false;
  }
  return day.getMonth() !== this.currentDate.month();
 }
 
hasAvailability(day: Date): boolean {
  if (!this.availabilities || !Array.isArray(this.availabilities)) {
    return false;
  }

  return this.availabilities.some((availability: any) => {
    const frequency = availability['frequency']['name'];

    if (frequency === 'HEBDOMADAIRE') {
      
      if (availability['day']['id'] == 7) {
        availability['day']['id'] = 0; 
      }

      const jourIndex = availability['day']['id'];
      const dayIndex = moment(day).day();

      if (jourIndex !== dayIndex) {
        return false;
      }

      const periode = availability['period'];
      const currentDate = moment();
      const dayDate = moment(day);

      const startMonth = currentDate.clone().startOf('month');
      const endMonth = currentDate.clone().add(periode - 1, 'months').endOf('month');

      const isInValidPeriod = dayDate.isBetween(startMonth, endMonth, null, '[]');
      return isInValidPeriod;
    }

    if (frequency === 'MENSUELLE') { 
      const dayOfWeek = availability['day']['id']; 
      const orderOfDay = availability['orderOfDay']; 

      const dayDate = moment(day);
      const currentMonth = dayDate.month();
      const currentYear = dayDate.year();

      let currentOccurrence = 0;
      let targetDate = moment().year(currentYear).month(currentMonth).startOf('month').day(dayOfWeek);

      if (targetDate.month() !== currentMonth) {
        targetDate.add(1, 'week');
      }

      while (currentOccurrence < orderOfDay - 1) {
        targetDate.add(1, 'week');
        currentOccurrence++;
      }

      if (targetDate.isSame(dayDate, 'day')) {
        const periode = availability['period'];
        const currentDate = moment();
        const startMonth = currentDate.clone().startOf('month');
        const endMonth = currentDate.clone().add(periode - 1, 'months').endOf('month');

        const isInValidPeriod = dayDate.isBetween(startMonth, endMonth, null, '[]');
        return isInValidPeriod;
      }
    }

    return false;
  });
}


getAppointmentCount(day: Date): { follow: number; notFollow: number } {

  if (!this.availabilities || !Array.isArray(this.availabilities)) {
    return { follow: 0, notFollow: 0 };
  }

  const availability = this.availabilities.find((availability: any) => {
    if(availability['day']['id'] === 7){
      availability['day']['id'] = 0;
    }
    const jourIndex = availability['day']['id'];
    const dayIndex = moment(day).day();

    return jourIndex === dayIndex;
  });

  if (!availability || !availability.appointments || !Array.isArray(availability.appointments)) {
    return { follow: 0, notFollow: 0 };
  }
  const appointmentsForDate = availability.appointments.filter((appointment: any) => {
    return moment(appointment.newDate).isSame(day, 'day');
  });
  
  
  const followCount = appointmentsForDate.filter((appointment:any) => appointment.followed).length;
  const notFollowCount = appointmentsForDate.filter((appointment:any) => !appointment.followed).length;
 
  
 
   
  return { follow: followCount, notFollow: notFollowCount };
}



getAvailabilityTime(day: Date): string | null {

if (!this.availabilities || !Array.isArray(this.availabilities)) {
  return null; 
}
const availability = this.availabilities.find((availability: any) => {
const frequency = availability['frequency']['name'];

  if(availability['day']['id']==7){
      availability['day']['id']==0;
      }
    const jourIndex = availability['day']['id']; 
    const dayIndex = moment(day).day(); 
    
  if (frequency=="HEBDOMADAIRE") {

    return jourIndex === dayIndex; 
  }
  if (frequency=="MENSUELLE") {
    return true
  }
    return false;
 });

return availability ? `${availability.startTime} - ${availability.endTime}` : null;
}

onAppointmentClick(day: Date) {
  const availability = this.availabilities.find((availability: any) => {

    if(availability['day']['id']==7){
        availability['day']['id']==0;
        }
      const jourIndex = availability['day']['id']; 
      const dayIndex = moment(day).day(); 
   
      if (jourIndex !== dayIndex) {
        return false;
      }
  
      const periode = availability['period'];
      const currentDate = moment();
      const dayDate = moment(day);
  
      const startMonth = currentDate.clone().startOf('month');
      const endMonth = currentDate.clone().add(periode - 1, 'months').endOf('month');
  
      return dayDate.isBetween(startMonth, endMonth, null, '[]');
    
  });

   if (availability) {
    if (this.canViewListAppointment) {
      if (this.getAppointmentCount(day).follow>0 || this.getAppointmentCount(day).notFollow>0) {

       this.route.navigate(['/back-office/medecin/list-appointment'],{state: { availability: availability, date: day, hospitalId:this.hospitalId,specialityId:this.specialityId}})   
      }else{
        this.route.navigate(['/back-office/medecin/calendar']); 
      }
    }else{

      this.route.navigate(['/back-office/medecin/calendar']); 
    }
  }

}

  previousMonth() {
  this.currentDate = moment(this.currentDate).subtract(1, 'month');
  this.currentMonth = this.currentDate.toDate();
  this.generateCalendar();
}

nextMonth() {
  this.currentDate = moment(this.currentDate).add(1, 'month');
  this.currentMonth = this.currentDate.toDate();
  this.generateCalendar();
}

getConnectedUserPermissionsOnComponent(){
  this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Calendrier").subscribe({
    next: (response) => {
      if(response.success){
        const currentUserPermissions: Permission[] = response.data;
        const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
        
        if(permissionsCodeNames.includes("VIEW_LIST_APPOINTMENTS")){
          this.canViewListAppointment = true;
        }else{
          this.canViewListAppointment = false;
        }
      }
    },error: (err) => {
      console.log(err.message);        
    }
  })
}



}
