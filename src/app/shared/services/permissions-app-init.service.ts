import { Injectable } from '@angular/core';

declare var require;
var jwtDecode = require("jwt-decode");

import { PermissionsService } from 'src/app/shared/services';
import { UsersPermsService } from 'src/app/shared/services/api';

@Injectable({
  providedIn: 'root'
})
export class permissionsAppInitService {

    constructor(
        private permissionsService: PermissionsService,
        private UserPermissionsService: UsersPermsService
    ) {}

    public getStoredUserId() {
        if(!localStorage.getItem('token'))
            return null;
        try {
            let token = localStorage.getItem('token');
            let decodedToken = jwtDecode(token);
            return decodedToken.nameid;
        } catch (err) {
            return null;
        }
    }

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            let userId = this.getStoredUserId();
            if(!userId && userId != 0) {
                localStorage.removeItem('token');
                return resolve();
            }
            this.UserPermissionsService.getUserPermissions(userId).toPromise().then(
                permissions => {
                    this.permissionsService.setPermissions(permissions);
                    return resolve();
                }
            ).catch(
                err => {
                    resolve();
                    console.log("App initialize err", err);
                }
            );
        })
    }
}
