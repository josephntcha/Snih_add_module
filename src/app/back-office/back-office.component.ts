import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.css'
})
export class BackOfficeComponent implements OnInit{

  constructor(public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute){}

  title: string =  '';

  isCollapsed = false;
  selectedLanguage = 'en';

  activeMenu: string | null = 'null';

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while(route.firstChild) route = route.firstChild;
        return route.snapshot.data['title'] || '';
      })
    ).subscribe((title: string) => {
      this.title = title;
    });
  }

  toggleMenu(menu: string){
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }


  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    this.authService.logout();
  }

}
