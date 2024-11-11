import { Component, OnInit } from '@angular/core';
import { Building, Room } from '../../core/models/model';
import { ApiServiceService } from '../services/api-service.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  hospitalId!: number;
  userId!: number;
  buildings!: Building[];
  rooms: Room[] = [];
  doctors: any;

  constructor(private apiService: ApiServiceService, private authService: AuthService){}

  ngOnInit(): void {
    this.userId = this.authService.userId;
    if(this.userId){
      this.getData();
      
    }
  }

  getBuildingsOfHospital(hospitalId: number){
    this.apiService.getBuildings(hospitalId).subscribe({
      next: (data) => {
        this.buildings = data;
        if(this.buildings){
          for(let building of this.buildings){
            for(let room of building.roomDTO){
              this.rooms.push(room);              
            }
          }
        }
      },error: (err) => {
        console.log(err.message);        
      }
    });
  }

  // getRoomsOfHospital(hospitalId: number){
  //   this.apiService.getRooms(hospitalId).subscribe({
  //     next: (data) => {
  //       this.rooms = data;
  //     },error: (err) => {
  //       console.log(err.message);        
  //     }
  //   });
  // }

  getData(){
    this.apiService.getUserById(this.userId).subscribe(response => {
      if(response.success){
        this.hospitalId = response.data.hospital.id;        
        if(this.hospitalId){
          this.getBuildingsOfHospital(this.hospitalId);
          // this.getRoomsOfHospital(this.hospitalId)
          this.getDoctorsOfAdminHospital(this.hospitalId);
        }
        
      }
    });
  }

  getDoctorsOfAdminHospital(hospitalId: number){
    this.apiService.getDoctorsByHospital(hospitalId).subscribe({
      next: (data) => {
        this.doctors = data;
      },error: (err) => {
        console.log(err.message);        
      }
    });
  }

}
