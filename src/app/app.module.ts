import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotifierModule } from 'angular-notifier';

import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorInterceptor, JwtInterceptor } from './shared/services/api/interceptors';
import { LoginComponent } from './login';
import { FormsModule } from '@angular/forms';
import { permissionsAppInitService } from './shared/services';

export function app_init(permissionsService: permissionsAppInitService) {
  return () => permissionsService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    NotifierModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule,
    FormsModule,
    SharedModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbTypeaheadModule.forRoot(),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: app_init, deps: [permissionsAppInitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
