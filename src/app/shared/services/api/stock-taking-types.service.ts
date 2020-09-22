import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from 'src/app/shared/services/api/globals';
import { StockTakingType } from 'src/app/shared/models';
const API_URL = END_POINTS.stockTakingTypes;

@Injectable({
  providedIn: 'root'
})
export class StockTakingTypesService {

  
  constructor(private http: HttpClient) { }
    
  get(id: number): Observable<StockTakingType> {
    return this.http.get<StockTakingType>(API_URL+`/${id}`);
  }
  getAll(): Observable<StockTakingType[]> {
    return this.http.get<StockTakingType[]>(API_URL);
  }
  create(model: StockTakingType): Observable<StockTakingType> {
    return this.http.post<StockTakingType>(API_URL, model);
  }
  update(id: number, model: StockTakingType): Observable<StockTakingType> {
    return this.http.put<StockTakingType>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<StockTakingType> {
    return this.http.delete<StockTakingType>(API_URL+`/${id}`);
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