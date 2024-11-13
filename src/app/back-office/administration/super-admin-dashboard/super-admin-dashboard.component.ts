import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent implements OnInit{
  users:any;
  hospitals: any;
  constructor(private apiService: ApiServiceService, private router: Router){}


  ngOnInit(): void {
    this.apiService.getDataHospitals().subscribe(response=>{
      this.hospitals=response.length;
    });

    this.apiService.getUsers().subscribe(response=>{
      this.users=response.length;
    });
  }

}
