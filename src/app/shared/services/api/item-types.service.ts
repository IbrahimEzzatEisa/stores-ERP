import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { ItemType } from 'src/app/shared/models';

const API_URL = END_POINTS.itemTypes;

@Injectable({
  providedIn: 'root'
})
export class ItemTypesService {
    
    constructor(private http: HttpClient) { }
    
    get(id: number): Observable<ItemType> {
      return this.http.get<ItemType>(API_URL+`/${id}`);
    }
    getAll(): Observable<ItemType[]> {
      return this.http.get<ItemType[]>(API_URL);
    }
    create(model: ItemType): Observable<ItemType> {
      return this.http.post<ItemType>(API_URL, model);
    }
    update(id: number, model: ItemType): Observable<ItemType> {
      return this.http.put<ItemType>(API_URL+`/${id}`, model);
    }
    delete(id: number): Observable<ItemType> {
      return this.http.delete<ItemType>(API_URL+`/${id}`);
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