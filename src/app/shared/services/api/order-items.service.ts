import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS } from './globals';
import { FilterParams, ResultWithPagination, ResultWithRanking, Order } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiHelper } from './api-helper.service';
import { orderItems } from '../../models/order-items';
import { SharedSettingsService } from '../shared-settings.service';

const API_URL = END_POINTS.ordersItems;
@Injectable({
  providedIn: 'root'
})
export class OrderItemsService {

  constructor(private http:HttpClient,
              private apiHelper: ApiHelper,
              private sharedSettingsService: SharedSettingsService) { }

  getAll(trxTypeId, orderSerial, filterParams?: FilterParams) {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<orderItems[]>(API_URL+`/${trxTypeId}/${orderSerial}`, { 
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
  create(model: orderItems): Observable<orderItems> {
    model.itemYear = this.sharedSettingsService.getSessionYearNumber();
    return this.http.post<orderItems>(API_URL, model);
  }
  update(model: orderItems): Observable<orderItems> {
    return this.http.put<orderItems>(API_URL+`/${model.trxTypeId}/${model.orderSerial}/${model.lineNo}`, model);
  }
  delete(trxTypeId: number, trxSerial: number, lineNo: number) {
    return this.http.delete(API_URL+`/${trxTypeId}/${trxSerial}/${lineNo}`);
  }
  getNewId(trxTypeId: number, orderSerial: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${trxTypeId}/${orderSerial}`)
  }
  
}