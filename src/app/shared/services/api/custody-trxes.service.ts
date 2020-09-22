import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { END_POINTS } from './globals';
import { CustodyTrx, ResultWithRanking, FilterParams, PaginationParams, CustodyTrxWithNames } from 'src/app/shared/models';
import { map } from 'rxjs/operators';
import { ApiHelper } from './api-helper.service';

const API_URL = END_POINTS.CustodyTrxes;

@Injectable({
  providedIn: 'root'
})
export class CustodyTrxesService {

  constructor(private http: HttpClient,
              private apiHelper: ApiHelper) { }
    
  get(type: number, serial: number): Observable<ResultWithRanking<CustodyTrx>> {
    return this.http.get<ResultWithRanking<CustodyTrx>>(API_URL+`/${type}/${serial}`);
  }
  getAll(type: number,filterParams?: FilterParams): Observable<{pagination: PaginationParams | null, result: CustodyTrxWithNames[]}> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<CustodyTrxWithNames[]>(API_URL+`/${type}`, { 
      observe: 'response',
      params: {
        pageNumber: filterParams.pageNumber.toString(),
        pageSize: filterParams.pageSize.toString(),
        searchValue: filterParams.searchValue,
        sortField: filterParams.sortField,
        sortDirection: filterParams.sortDirection
      }
    }).pipe(map(this.apiHelper.toResultWithPagination));
  }
  
  create(model: CustodyTrx): Observable<ResultWithRanking<CustodyTrx>> {
    return this.http.post<ResultWithRanking<CustodyTrx>>(API_URL, model);
  }
  update(type: number, serial: number, model: CustodyTrx): Observable<ResultWithRanking<CustodyTrx>> {
    return this.http.put<ResultWithRanking<CustodyTrx>>(API_URL+`/${type}/${serial}`, model);
  }
  delete(type: number, serial: number): Observable<CustodyTrx> {
    return this.http.delete<CustodyTrx>(API_URL+`/${type}/${serial}`);
  }
  getNewId(type: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${type}`)
  }
  getFirstRow(type: number): Observable<ResultWithRanking<CustodyTrx>> {
    const action = "/GetFirstRow";
    return this.http.get<ResultWithRanking<CustodyTrx>>(API_URL+action+`/${type}`);
  }
  getLastRow(type: number): Observable<ResultWithRanking<CustodyTrx>> {
    const action = "/GetLastRow";
    return this.http.get<ResultWithRanking<CustodyTrx>>(API_URL+action+`/${type}`);
  }
  getPreviousRow(type: number, id: number): Observable<ResultWithRanking<CustodyTrx>> {
    const action = "/GetPreviousRow";
    return this.http.get<ResultWithRanking<CustodyTrx>>(API_URL+action+`/${type}/${id}`);
  }
  getNextRow(type: number, id: number): Observable<ResultWithRanking<CustodyTrx>> {
    const action = "/GetNextRow";
    return this.http.get<ResultWithRanking<CustodyTrx>>(API_URL+action+`/${type}/${id}`);
  }

}
