import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { ItemGroup } from '../../models';
const API_URL = END_POINTS.itemGroups;

@Injectable({
  providedIn: 'root'
})
export class ItemGroupsService {

  
  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<ItemGroup> {
    return this.http.get<ItemGroup>(API_URL+`/${id}`);
  }
  getAll(): Observable<ItemGroup[]> {
    return this.http.get<ItemGroup[]>(API_URL);
  }
  create(model: ItemGroup): Observable<ItemGroup> {
    return this.http.post<ItemGroup>(API_URL, model);
  }
  update(id: number, model: ItemGroup): Observable<ItemGroup> {
    return this.http.put<ItemGroup>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<ItemGroup> {
    return this.http.delete<ItemGroup>(API_URL+`/${id}`);
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
