import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { ApiHelper } from './api-helper.service';
import { FilterParams, ResultWithPagination, ResultWithRanking, StockTakingTrxe } from 'src/app/shared/models';
const API_URL = END_POINTS.stockTakingTrxes;

@Injectable({
  providedIn: 'root'
})
export class StockTakingTrxesService {


  constructor(
      private http: HttpClient,
      private apiHelper: ApiHelper
    ) { }
    
  get(id: number): Observable<ResultWithRanking<StockTakingTrxe>> {
    return this.http.get<ResultWithRanking<StockTakingTrxe>>(API_URL+`/${id}`);
  }
  getAll(filterParams?: FilterParams): Observable<ResultWithPagination<StockTakingTrxe[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<StockTakingTrxe[]>(API_URL, { 
      observe: 'response',
      params: {
        pageNumber: filterParams.pageNumber.toString(),
        pageSize: filterParams.pageSize.toString(),
        searchValue: filterParams.searchValue,
        sortField: filterParams.sortField,
        sortDirection: filterParams.sortDirection
      }
    }).pipe(map(this.apiHelper.toResultWithPagination) );
  }
  create(model: StockTakingTrxe): Observable<ResultWithRanking<StockTakingTrxe>> {
    return this.http.post<ResultWithRanking<StockTakingTrxe>>(API_URL, model);
  }
  update(id: number, model: StockTakingTrxe): Observable<ResultWithRanking<StockTakingTrxe>> {
    return this.http.put<ResultWithRanking<StockTakingTrxe>>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<StockTakingTrxe> {
    return this.http.delete<StockTakingTrxe>(API_URL+`/${id}`);
  }
  getNewId(): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action)
  }
  getFirstRow(): Observable<ResultWithRanking<StockTakingTrxe>> {
    const action = "/GetFirstRow";
    return this.http.get<ResultWithRanking<StockTakingTrxe>>(API_URL+action);
  }
  getLastRow(): Observable<ResultWithRanking<StockTakingTrxe>> {
    const action = "/GetLastRow";
    return this.http.get<ResultWithRanking<StockTakingTrxe>>(API_URL+action);
  }
  getPreviousRow(id: number): Observable<ResultWithRanking<StockTakingTrxe>> {
    const action = "/GetPreviousRow";
    return this.http.get<ResultWithRanking<StockTakingTrxe>>(API_URL+action+`/${id}`);
  }
  getNextRow(id: number): Observable<ResultWithRanking<StockTakingTrxe>> {
    const action = "/GetNextRow";
    return this.http.get<ResultWithRanking<StockTakingTrxe>>(API_URL+action+`/${id}`);
  }

}
