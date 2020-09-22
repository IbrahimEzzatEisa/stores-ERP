import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { Recommendations } from '../../models';
const API_URL = END_POINTS.Recommendation;

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {


  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<Recommendations> {
    return this.http.get<Recommendations>(API_URL+`/${id}`);
  }
  getAll(): Observable<Recommendations[]> {
    return this.http.get<Recommendations[]>(API_URL);
  }
  create(model: Recommendations): Observable<Recommendations> {
    return this.http.post<Recommendations>(API_URL, model);
  }
  update(id: number, model: Recommendations): Observable<Recommendations> {
    return this.http.put<Recommendations>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<Recommendations> {
    return this.http.delete<Recommendations>(API_URL+`/${id}`);
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
