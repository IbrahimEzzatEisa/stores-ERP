import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { Employee } from '../../models';
const API_URL = END_POINTS.employees;

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  
  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<Employee> {
    return this.http.get<Employee>(API_URL+`/${id}`);
  }
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API_URL);
  }
  create(model: Employee): Observable<Employee> {
    return this.http.post<Employee>(API_URL, model);
  }
  update(id: number, model: Employee): Observable<Employee> {
    return this.http.put<Employee>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<Employee> {
    return this.http.delete<Employee>(API_URL+`/${id}`);
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
