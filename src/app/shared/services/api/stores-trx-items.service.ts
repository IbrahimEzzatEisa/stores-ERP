import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS } from './globals';
import { map } from 'rxjs/operators';

import { FilterParams, ResultWithPagination, ResultWithTotal, StoresTrxItem } from 'src/app/shared/models';
import { ApiHelper } from './api-helper.service';
import { SharedSettingsService } from '../shared-settings.service';

const API_URL = END_POINTS.StoresTrxItems;

@Injectable({
  providedIn: 'root'
})
export class StoresTrxItemsService {

  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelper,
    private sharedSettingsService: SharedSettingsService
  ) { }
  
  getAll(trxTypeId: number,trxSerial: number,filterParams?: FilterParams): Observable<ResultWithPagination<ResultWithTotal<StoresTrxItem[]>>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<ResultWithTotal<StoresTrxItem[]>>(API_URL+`/${trxTypeId}/${trxSerial}`, { 
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
  create(model: StoresTrxItem): Observable<StoresTrxItem> {
    model.itemYear = this.sharedSettingsService.getSessionYearNumber();
    return this.http.post<StoresTrxItem>(API_URL, model);
  }
  update(model: StoresTrxItem): Observable<StoresTrxItem> {
    return this.http.put<StoresTrxItem>(API_URL+`/${model.trxTypeId}/${model.trxSerial}/${model.lineNo}`, model);
  }
  delete(trxTypeId: number, trxSerial: number, lineNo: number) {
    return this.http.delete(API_URL+`/${trxTypeId}/${trxSerial}/${lineNo}`);
  }
  getNewId(trxTypeId: number, trxSerial: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${trxTypeId}/${trxSerial}`)
  }
  addAllItemsForOpenBalance(trxTypeId: number, trxSerial: number) {
    const action = "/AddAllItemsForOpenBalance";
    const itemYear = this.sharedSettingsService.getSessionYearNumber();
    return this.http.post(API_URL+action+`/${trxTypeId}/${trxSerial}/${itemYear}`, {});
  }
  AddAllItemsForOpenBalanceByItemGroupId(itemGroupId: string| number, trxTypeId: number, trxSerial: number) {
    const action = "/AddAllItemsForOpenBalanceByItemGroupId";
    const itemYear = this.sharedSettingsService.getSessionYearNumber();
    return this.http.post(API_URL+action+`/${itemGroupId}/${trxTypeId}/${trxSerial}/${itemYear}`, {});
  }
}


