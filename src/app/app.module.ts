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
import { provideHttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from './core/auth/auth.module';
import { BackOfficeModule } from './back-office/back-office.module';
import { MedicalRecordModule } from './back-office/medical-record/medical-record.module';
import { MedecinModule } from './back-office/medecin/medecin.module';
import { FrontOfficeModule } from './front-office/front-office.module';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,
    BackOfficeModule,
    MedecinModule,
    FrontOfficeModule,
    MedicalRecordModule,
    
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterOutlet
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
