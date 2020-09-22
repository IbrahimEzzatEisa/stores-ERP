import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { Branch } from '../../models';
const API_URL = END_POINTS.branches;

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  
  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<Branch> {
    return this.http.get<Branch>(API_URL+`/${id}`);
  }
  getAll(): Observable<Branch[]> {
    return this.http.get<Branch[]>(API_URL);
  }
  create(model: Branch): Observable<Branch> {
    return this.http.post<Branch>(API_URL, model);
  }
  update(id: number, model: Branch): Observable<Branch> {
    return this.http.put<Branch>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<Branch> {
    return this.http.delete<Branch>(API_URL+`/${id}`);
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