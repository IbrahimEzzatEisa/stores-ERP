import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { StoreKeeper } from '../../models';
const API_URL = END_POINTS.storeKeepers;
@Injectable({
  providedIn: 'root'
})
export class StoreKeepersService {
  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<StoreKeeper> {
    return this.http.get<StoreKeeper>(API_URL+`/${id}`);
  }
  getAll(): Observable<StoreKeeper[]> {
    return this.http.get<StoreKeeper[]>(API_URL);
  }
  create(model: StoreKeeper): Observable<StoreKeeper> {
    return this.http.post<StoreKeeper>(API_URL, model);
  }
  update(id: number, model: StoreKeeper): Observable<StoreKeeper> {
    return this.http.put<StoreKeeper>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<StoreKeeper> {
    return this.http.delete<StoreKeeper>(API_URL+`/${id}`);
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
