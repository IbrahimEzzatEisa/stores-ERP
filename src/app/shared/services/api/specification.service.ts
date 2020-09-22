import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import {Specification } from '../../models';
const API_URL = END_POINTS.Specifications;

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {


  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<Specification> {
    return this.http.get<Specification>(API_URL+`/${id}`);
  }
  getAll(): Observable<Specification[]> {
    return this.http.get<Specification[]>(API_URL);
  }
  create(model: Specification): Observable<Specification> {
    return this.http.post<Specification>(API_URL, model);
  }
  update(id: number, model: Specification): Observable<Specification> {
    return this.http.put<Specification>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<Specification> {
    return this.http.delete<Specification>(API_URL+`/${id}`);
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
