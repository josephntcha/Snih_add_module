import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlStorageService {
  private readonly URL_KEY = 'lastVisiteUrl';

  constructor(private roter: Router){}

  saveCurrentUrl(): void {
    const currentUrl = this.roter.url;
    if(currentUrl !== '/'){
      localStorage.setItem(this.URL_KEY, currentUrl);
    }
  }

  getLastVisiteUrl(): string | null {
    return localStorage.getItem(this.URL_KEY);
  }

  clearLastVisitUrl(): void {
    localStorage.removeItem(this.URL_KEY);
  }
}
