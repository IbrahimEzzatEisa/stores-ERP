import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PermissionsService } from 'src/app/shared/services/permissions-service';
import { AuthenticationService } from 'src/app/shared/services/Auth/authentication.services';
 

@Injectable()
export class PermissionsResolver implements Resolve<Boolean> {

  constructor(
    private permissionsService: PermissionsService,
    private authenticationService: AuthenticationService
  ) {}
 
  resolve(): Observable<boolean> {
    let userId = this.authenticationService.getStoredUserId();
    return this.permissionsService.loadPermissions(userId).pipe(
      map( permissions=> {
        this.permissionsService.setPermissions(permissions);
        if(permissions) {
          return true;
        } else {
          return false;
        }
      } )
    );
  }
}