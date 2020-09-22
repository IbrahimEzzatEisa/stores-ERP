import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { Unit } from 'src/app/shared/models';
import { SharedSettingsService } from '../shared-settings.service';

const API_URL = END_POINTS.units;

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(
      private http: HttpClient,
      private sharedSettingsService: SharedSettingsService
    ) {}
    
    get(id: number): Observable<Unit> {
      return this.http.get<Unit>(API_URL+`/${id}`);
    }
    getAll(): Observable<Unit[]> {
      return this.http.get<Unit[]>(API_URL);
    }
    getByItemGroupIdAndItemId(itemGroupId: string, itemId: string, itemYear? :number | string):Observable<Unit[]>{
      const action='/GetByItemId';
      const sessionYear = this.sharedSettingsService.getSessionYear();
      itemYear = itemYear || sessionYear;
      return this.http.get<Unit[]>(API_URL+action+`/${itemGroupId}/${itemId}/${itemYear}`);
    }
    create(model: Unit): Observable<Unit> {
      return this.http.post<Unit>(API_URL, model);
    }
    update(id: number, model: Unit): Observable<Unit> {
      return this.http.put<Unit>(API_URL+`/${id}`, model);
    }
    delete(id: number): Observable<Unit> {
      return this.http.delete<Unit>(API_URL+`/${id}`);
    }
    getNewId(): Observable<number> {
      const action = "/GetNewId";
      return this.http.get<number>(API_URL+action)
    }
    printReport(): Observable<any> {
      const action = "/ShowReport";
      return this.http.get<any>(API_URL+action)
    }

}