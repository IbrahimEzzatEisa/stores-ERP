import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { Supplier, PaginationParams, FilterParams, ResultWithRanking } from 'src/app/shared/models';

const API_URL = END_POINTS.suppliers;

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
    
    constructor(private http: HttpClient) { }
    
    get(id: number): Observable<ResultWithRanking<Supplier>> {
      return this.http.get<ResultWithRanking<Supplier>>(API_URL+`/${id}`);
    }
    getAll(filterParams?: FilterParams): Observable<{pagination: PaginationParams | null, result: Supplier[]}> {
      if(!filterParams) filterParams = new FilterParams();
      return this.http.get<Supplier[]>(API_URL, { 
        observe: 'response',
        params: {
          pageNumber: filterParams.pageNumber.toString(),
          pageSize: filterParams.pageSize.toString(),
          searchValue: filterParams.searchValue,
          sortField: filterParams.sortField,
          sortDirection: filterParams.sortDirection
        }
      }).pipe(
        map(
          res => {
            let paginationString = res.headers.get('pagination');
            try {
              var pagination = JSON.parse(paginationString)
            } catch {
              var pagination = null;
            }
            return {
              pagination: pagination,
              result: res.body
            }
          }
        )
      );
    }
    create(model: Supplier): Observable<ResultWithRanking<Supplier>> {
      return this.http.post<ResultWithRanking<Supplier>>(API_URL, model);
    }
    update(id: number, model: Supplier): Observable<ResultWithRanking<Supplier>> {
      return this.http.put<ResultWithRanking<Supplier>>(API_URL+`/${id}`, model);
    }
    delete(id: number): Observable<Supplier> {
      return this.http.delete<Supplier>(API_URL+`/${id}`);
    }
    getNewId(): Observable<number> {
      const action = "/GetNewId";
      return this.http.get<number>(API_URL+action)
    }
    getFirst():Observable<ResultWithRanking<Supplier>>{
      const action="/GetFirstRow"
      return this.http.get<ResultWithRanking<Supplier>>(API_URL+action)
    }
    getLast():Observable<ResultWithRanking<Supplier>>{
      const action="/GetLastRow"
      return this.http.get<ResultWithRanking<Supplier>>(API_URL+action)
    }

    getNext(id:number):Observable<ResultWithRanking<Supplier>>{
      const action="/GetNextRow"
      return this.http.get<ResultWithRanking<Supplier>>(API_URL+action+`/${id}`)

    }
    getPrevious(id:number):Observable<ResultWithRanking<Supplier>>{
      const action="/GetPreviousRow"
      return this.http.get<ResultWithRanking<Supplier>>(API_URL+action+`/${id}`)

    }
    printReport(id?:number): Observable<any> {
      const action = "/ShowReport";
      if(id || id == 0) return this.http.get<any>(API_URL+action+`/${id}`);
      return this.http.get<any>(API_URL+action);
    }

}