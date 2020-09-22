import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS, SYSTEM_ID } from './globals';
import { Permission } from 'src/app/shared/models';

const API_URL = END_POINTS.usersPerms;

@Injectable({
  providedIn: 'root'
})
export class UsersPermsService {
    
    constructor(
        private http: HttpClient
    ) { }

    getUserPermissions(id: number | string) {
        const action = '/GetUserPermisions';
        return this.http.get<Permission[]>(API_URL+ action +`/${id}/${SYSTEM_ID}`);
    }
    getMenu(id: number | string) {
      const action = '/GetMenu';
      return this.http.get<Permission[]>(API_URL+ action +`/${id}/${SYSTEM_ID}`);
  }
    update(id: number | string, model: Permission[]): Observable<Permission[]> {
      return this.http.put<Permission[]>(API_URL+`/${id}`, model);
    }

}