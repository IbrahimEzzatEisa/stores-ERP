import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { ItemState } from '../../models';
const API_URL = END_POINTS.itemStates;

@Injectable({
  providedIn: 'root'
})


export class ItemStatesService {

  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<ItemState> {
    return this.http.get<ItemState>(API_URL+`/${id}`);
  }
  getAll(): Observable<ItemState[]> {
    return this.http.get<ItemState[]>(API_URL);
  }
  create(model: ItemState): Observable<ItemState> {
    return this.http.post<ItemState>(API_URL, model);
  }
  update(id: number, model: ItemState): Observable<ItemState> {
    return this.http.put<ItemState>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<ItemState> {
    return this.http.delete<ItemState>(API_URL+`/${id}`);
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
