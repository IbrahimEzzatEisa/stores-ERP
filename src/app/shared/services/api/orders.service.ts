import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS } from './globals';
import { FilterParams, ResultWithPagination, ResultWithRanking, Order } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiHelper } from './api-helper.service';

const API_URL = END_POINTS.orders;
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http:HttpClient,
    private apiHelper: ApiHelper

  ) { }
  get(id: number,trxTypeId: number): Observable<ResultWithRanking<Order>> {
    return this.http.get<ResultWithRanking<Order>>(API_URL+`/${trxTypeId}/${id}`);
  }
  getAll(trxTypeId, filterParams?: FilterParams): Observable<ResultWithPagination<Order[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<Order[]>(API_URL+`/${trxTypeId}`, { 
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
  create(model: Order): Observable<ResultWithRanking<Order>> {
    return this.http.post<ResultWithRanking<Order>>(API_URL, model);
  }
  update(id: number, model:Order, trxTypeId: number ): Observable<ResultWithRanking<Order>> {
    return this.http.put<ResultWithRanking<Order>>(API_URL+`/${trxTypeId}/${id}`, model);
  }
  delete(id: number, trxTypeId: number): Observable<Order> {
    return this.http.delete<Order>(API_URL+`/${trxTypeId}/${id}`);
  }
  getFirstRow(trxTypeId: number): Observable<ResultWithRanking<Order>> {
    const action = "/GetFirstRow";
    return this.http.get<ResultWithRanking<Order>>(API_URL+action+`/${trxTypeId}`);
  }
  getLastRow(trxTypeId: number): Observable<ResultWithRanking<Order>> {
    const action = "/GetLastRow";
    return this.http.get<ResultWithRanking<Order>>(API_URL+action+`/${trxTypeId}`);
  }
  getPreviousRow(rank: number, trxTypeId: number): Observable<ResultWithRanking<Order>> {
    const action = "/GetPreviousRow";
    return this.http.get<ResultWithRanking<Order>>(API_URL+action+`/${rank}/${trxTypeId}`);
  }
  getNextRow(rank: number, trxTypeId: number): Observable<ResultWithRanking<Order>> {
    const action = "/GetNextRow";
    return this.http.get<ResultWithRanking<Order>>(API_URL+action+`/${rank}/${trxTypeId}`);
  }
  getNewId(trxTypeId: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${trxTypeId}`)
  }

}

