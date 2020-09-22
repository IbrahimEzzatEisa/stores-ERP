import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS } from './globals';
import { FilterParams, ResultWithPagination, StoreTrxe, StoreTrxeWithNames, ResultWithRanking } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiHelper } from './api-helper.service';

const API_URL = END_POINTS.StoresTrxes;
@Injectable({
  providedIn: 'root'
})
export class StoresTrxesService {

  constructor(
    private http:HttpClient,
    private apiHelper: ApiHelper

  ) { }

  get(id: number,trxTypeId: number): Observable<ResultWithRanking<StoreTrxe>> {
    return this.http.get<ResultWithRanking<StoreTrxe>>(API_URL+`/${trxTypeId}/${id}`);
  }
  getAll(trxTypeId, filterParams?: FilterParams): Observable<ResultWithPagination<StoreTrxeWithNames[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<StoreTrxeWithNames[]>(API_URL+`/${trxTypeId}`, { 
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
  create(model: StoreTrxe): Observable<ResultWithRanking<StoreTrxe>> {
    return this.http.post<ResultWithRanking<StoreTrxe>>(API_URL, model);
  }
  update(id: number, model:StoreTrxe, trxTypeId: number ): Observable<ResultWithRanking<StoreTrxe>> {
    return this.http.put<ResultWithRanking<StoreTrxe>>(API_URL+`/${trxTypeId}/${id}`, model);
  }
  delete(id: number, trxTypeId: number): Observable<StoreTrxe> {
    return this.http.delete<StoreTrxe>(API_URL+`/${trxTypeId}/${id}`);
  }
  getFirstRow(trxTypeId: number): Observable<ResultWithRanking<StoreTrxe>> {
    const action = "/GetFirstRow";
    return this.http.get<ResultWithRanking<StoreTrxe>>(API_URL+action+`/${trxTypeId}`);
  }
  getLastRow(trxTypeId: number): Observable<ResultWithRanking<StoreTrxe>> {
    const action = "/GetLastRow";
    return this.http.get<ResultWithRanking<StoreTrxe>>(API_URL+action+`/${trxTypeId}`);
  }
  getPreviousRow(rank: number, trxTypeId: number): Observable<ResultWithRanking<StoreTrxe>> {
    const action = "/GetPreviousRow";
    return this.http.get<ResultWithRanking<StoreTrxe>>(API_URL+action+`/${rank}/${trxTypeId}`);
  }
  getNextRow(rank: number, trxTypeId: number): Observable<ResultWithRanking<StoreTrxe>> {
    const action = "/GetNextRow";
    return this.http.get<ResultWithRanking<StoreTrxe>>(API_URL+action+`/${rank}/${trxTypeId}`);
  }
  getNewId(trxTypeId: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${trxTypeId}`)
  }
}
