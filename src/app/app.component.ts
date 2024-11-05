import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'snih';


  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.authService.urlStorage.saveCurrentUrl();
    })
    this.authService.loadJwtTokenFromLocalStorage();
  }
}
