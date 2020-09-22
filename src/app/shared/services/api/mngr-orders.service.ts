import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from 'src/app/shared/services/api/globals';
import { 
  FilterParams, 
  ResultWithPagination, 
  ResultWithRanking,
  MngrOrder,
  MngrOrderWithNames
} from 'src/app/shared/models';
import { ApiHelper } from './api-helper.service';

const API_URL = END_POINTS.MngrOrders;

@Injectable({
  providedIn: 'root'
})
export class MngrOrdersService {

  constructor(
    private http:HttpClient,
    private apiHelper: ApiHelper,

  ) { }
  
  get(id: number): Observable<ResultWithRanking<MngrOrder>> {
    return this.http.get<ResultWithRanking<MngrOrder>>(API_URL+`/${id}`);
  }
  getAll(filterParams?: FilterParams): Observable<ResultWithPagination<MngrOrderWithNames[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<MngrOrderWithNames[]>(API_URL, { 
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
  create(model: MngrOrder): Observable<ResultWithRanking<MngrOrder>> {
    return this.http.post<ResultWithRanking<MngrOrder>>(API_URL, model);
  }
  update(id: number, model:MngrOrder ): Observable<ResultWithRanking<MngrOrder>> {
    return this.http.put<ResultWithRanking<MngrOrder>>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<MngrOrder> {
    return this.http.delete<MngrOrder>(API_URL+`/${id}`);
  }
  getNewId(): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action)
  }
  getFirstRow(): Observable<ResultWithRanking<MngrOrder>> {
    const action = "/GetFirstRow";
    return this.http.get<ResultWithRanking<MngrOrder>>(API_URL+action);
  }
  getLastRow(): Observable<ResultWithRanking<MngrOrder>> {
    const action = "/GetLastRow";
    return this.http.get<ResultWithRanking<MngrOrder>>(API_URL+action);
  }
  getPreviousRow(id: number): Observable<ResultWithRanking<MngrOrder>> {
    const action = "/GetPreviousRow";
    return this.http.get<ResultWithRanking<MngrOrder>>(API_URL+action+`/${id}`);
  }
  getNextRow(id: number): Observable<ResultWithRanking<MngrOrder>> {
    const action = "/GetNextRow";
    return this.http.get<ResultWithRanking<MngrOrder>>(API_URL+action+`/${id}`);
  }

}
