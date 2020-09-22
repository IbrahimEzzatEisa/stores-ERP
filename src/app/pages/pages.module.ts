import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule
  ],
  declarations: [
    PagesComponent,
    ChangePasswordComponent,
    ErrorPageComponent,
    HomeComponent
  ]
})
export class PagesModule { }
