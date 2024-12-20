import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US, fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { BackOfficeModule } from './back-office/back-office.module';
import { MedecinModule } from './back-office/medecin/medecin.module';
import { FrontOfficeModule } from './front-office/front-office.module';
import { authInterceptor } from './auth/auth.interceptor';
import { MedicalConstantsComponent } from './back-office/medecin/medical-constants/medical-constants.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MedicalConstantsComponent
  ],
  exports: [
    MedicalConstantsComponent
  ],
  imports: [
    AuthModule,
    BackOfficeModule,
    MedecinModule,
    FrontOfficeModule,
    
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterOutlet
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
