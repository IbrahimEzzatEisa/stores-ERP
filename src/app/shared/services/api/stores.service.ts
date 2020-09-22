import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { Store, FilterParams, ResultWithPagination, ResultWithRanking } from 'src/app/shared/models';
import { ApiHelper } from 'src/app/shared/services/api';

const API_URL = END_POINTS.stores;

@Injectable({
  providedIn: 'root'
})
export class StoresService {
    
    constructor(
      private http: HttpClient,
      private apiHelper: ApiHelper
    ) { }
    
    get(id: number): Observable<ResultWithRanking<Store>> {
      return this.http.get<ResultWithRanking<Store>>(API_URL+`/${id}`);
    }
    getAll(filterParams?: FilterParams): Observable<ResultWithPagination<Store[]>> {
      if(!filterParams) filterParams = new FilterParams();
      return this.http.get<Store[]>(API_URL, { 
        observe: 'response',
        params: {
          pageNumber: filterParams.pageNumber.toString(),
          pageSize: filterParams.pageSize.toString(),
          searchValue: filterParams.searchValue,
          sortField: filterParams.sortField,
          sortDirection: filterParams.sortDirection
        }
      }).pipe( map(this.apiHelper.toResultWithPagination) );
    }
    create(model: Store): Observable<Store> {
      return this.http.post<Store>(API_URL, model);
    }
    update(id: number, model: Store, rank: number, totalCount: number): Observable<ResultWithRanking<Store>> {
      return this.http.put<Store>(API_URL+`/${id}`, model).pipe(
        map(
          res => {
            return {
              result: res,
              rank: rank,
              totalCount: totalCount
            }
          }
        )
      );
    }
    delete(id: number): Observable<Store> {
      return this.http.delete<Store>(API_URL+`/${id}`);
    }
    getNewId(): Observable<number> {
      const action = "/GetNewId";
      return this.http.get<number>(API_URL+action);
    }
    getFirst():Observable<ResultWithRanking<Store>>{
      const action="/GetFirstRow"
      return this.http.get<ResultWithRanking<Store>>(API_URL+action)
    }
    getLast():Observable<ResultWithRanking<Store>>{
      const action="/GetLastRow"
      return this.http.get<ResultWithRanking<Store>>(API_URL+action)
    }

    getNext(id:number):Observable<ResultWithRanking<Store>>{
      const action="/GetNextRow/"
      return this.http.get<ResultWithRanking<Store>>(API_URL+action+id)

    }
    getPrevious(id:number):Observable<ResultWithRanking<Store>>{
      const action="/GetPreviousRow/"
      return this.http.get<ResultWithRanking<Store>>(API_URL+action+id)

    }
    printReport(): Observable<any> {
      const action = "/ShowReport";
      return this.http.get<any>(API_URL+action)
    }


}