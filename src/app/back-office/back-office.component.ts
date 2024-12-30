import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
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
  selectedLanguage = 'fr';
  isMobile = false;

  activeMenu: string | null = 'null';

  @HostListener('window:resize', ['$event'])

  onResize(event: any) {
    this.checkScreenSize();
  }
  

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
    }
  }


  ngOnInit(): void {
    // Récupérer le titre initial au chargement
    this.getInitialTitle();

    // Souscrire aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getRouteTitle())
    ).subscribe((title: string) => {
      this.title = title;
    });

    this.checkScreenSize();
  }

  // Méthode pour récupérer le titre initial
  private getInitialTitle(): void {
      let route = this.activatedRoute;
      while (route.firstChild) {
          route = route.firstChild;
      }
      this.title = route.snapshot.data['title'] || '';
  }

  // Méthode pour récupérer le titre lors des changements de route
  private getRouteTitle(): string {
      let route = this.activatedRoute;
      while (route.firstChild) {
          route = route.firstChild;
      }
      return route.snapshot.data['title'] || '';
  }

  toggleMenu(menu: string){
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }


  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isMobile) {
      const sider = document.querySelector('nz-sider');
      if (sider) {
        sider.classList.toggle('sidebar-mobile-open');
      }
    }
  }

  home(){
    if(this.authService.isSuperAdmin()){
      this.router.navigateByUrl("/back-office/Administration/super-admin-dashboard");
    }else if(this.authService.isAdmin()){
      this.router.navigateByUrl("/back-office/Administration/admin-dashboard");
    }else if(this.authService.isDoctor()){
      this.router.navigateByUrl("/back-office/medecin/calendar");
    }
  }

  logout(){
    this.authService.logout();
  }

}
