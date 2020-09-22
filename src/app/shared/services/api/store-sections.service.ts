import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StoreSection } from '../../models';
import { END_POINTS } from './globals';

const API_URL = END_POINTS.storeSections;

@Injectable({
  providedIn: 'root'
})
export class StoreSectionsService {

  constructor(private http: HttpClient) { }
  get(id: number): Observable<StoreSection> {
    return this.http.get<StoreSection>(API_URL+`/${id}`);
  }
  getAll(): Observable<StoreSection[]> {
    return this.http.get<StoreSection[]>(API_URL);
  }
  create(model: StoreSection): Observable<StoreSection> {
    return this.http.post<StoreSection>(API_URL, model);
  }
  update(id: number, model: StoreSection): Observable<StoreSection> {
    return this.http.put<StoreSection>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<StoreSection> {
    return this.http.delete<StoreSection>(API_URL+`/${id}`);
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
