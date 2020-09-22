import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Setting } from '../../models/Setting.model';
import { END_POINTS } from './globals';

const API_URL=END_POINTS.settings;
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http:HttpClient) { }

  get(): Observable<Setting> {
    return this.http.get<Setting>(API_URL+`/1`);
  }
  update(model: Setting): Observable<Setting> {
    return this.http.put<Setting>(API_URL+`/1`, model);
  }

}
