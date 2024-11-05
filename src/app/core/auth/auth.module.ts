import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';


@NgModule({
  declarations: [
    LoginComponent,
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzCheckboxModule,
    NzCardModule,
    NzCarouselModule,
  ]
})
export class AuthModule { }
