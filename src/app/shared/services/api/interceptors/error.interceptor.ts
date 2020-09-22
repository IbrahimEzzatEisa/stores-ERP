import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotifierService } from "angular-notifier";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(
       private notifier: NotifierService
        ) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    

        return next.handle(req).pipe(catchError(err => {
            if(err.status === 0) { // ConnectionError
               this.notifier.notify('error', 'خطأ فى الاتصال بالخادم. ');
            } else if (err.status === 401) { // NotAuthorized errior
               
            }
            const error = {
                status: err.status,
                statusText: err.statusText,
                message: err.error ? err.error.message: ''
            }
            // const error = err.error ? err.error.message || err.statusText: err.status;
            return throwError(error);
        }))
    }
   
    

}