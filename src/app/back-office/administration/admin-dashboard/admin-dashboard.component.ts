import { Component, OnInit } from '@angular/core';
import { Building, Permission, Room } from '../../../models/model';
import { ApiServiceService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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


  canViewListUsers = false;
  canViewListBuildings = false;
  canViewListRoomss = false;

  constructor(private apiService: ApiServiceService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.userId = this.authService.userId;
    if(this.userId){
      this.getConnectedUserPermissionsOnComponent();
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


  getConnectedUserPermissionsOnComponent(){
    this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Tableau de bord").subscribe({
      next: (response) => {
        if(response.success){
          const currentUserPermissions: Permission[] = response.data;
          const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
          if(permissionsCodeNames.includes("ACCESS_ADMIN_DASHBOARD")){
            this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Bâtiments").subscribe(response => {
              if(response.success){
                const currentUserPermissions: Permission[] = response.data;
                const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
                                
                if(permissionsCodeNames.includes("VIEW_LIST_BUILDINGS")){
                  this.canViewListBuildings = true;
                }else{
                  this.canViewListBuildings = false;
                }
                if(permissionsCodeNames.includes("VIEW_LIST_ROOMS")){
                  this.canViewListRoomss = true;
                }else{
                  this.canViewListRoomss = false;
                }
              }
            });
            this.apiService.getUserPermissionsOnComponent(this.authService.userId, "Utilisateurs").subscribe(response => {
            
              if(response.success){
                const currentUserPermissions: Permission[] = response.data;
                const permissionsCodeNames = currentUserPermissions.map(permission => permission.codeName);
                                
                if(permissionsCodeNames.includes("VIEW_LIST_USERS")){
                  this.canViewListUsers = true;
                }else{
                  this.canViewListUsers = false;
                }
              }
            });
           
          }
          
        }
      },error: (err) => {
        console.log(err.message);        
      }
    });
  }

}
