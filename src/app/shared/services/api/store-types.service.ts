import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StoreType } from '../../models';
import { END_POINTS } from './globals';

const API_URL = END_POINTS.storeTypes;

@Injectable({
  providedIn: 'root'
})
export class StoreTypesService {

  constructor(private http: HttpClient) { }
  get(id: number): Observable<StoreType> {
    return this.http.get<StoreType>(API_URL+`/${id}`);
  }
  getAll(): Observable<StoreType[]> {
    return this.http.get<StoreType[]>(API_URL);
  }
  create(model: StoreType): Observable<StoreType> {
    return this.http.post<StoreType>(API_URL, model);
  }
  update(id: number, model: StoreType): Observable<StoreType> {
    return this.http.put<StoreType>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<StoreType> {
    return this.http.delete<StoreType>(API_URL+`/${id}`);
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
