import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { FilterParams, ResultWithPagination, StockTakingTrxItem, StockTakingTrxItemWithNames } from 'src/app/shared/models';
import { ApiHelper } from './api-helper.service';
import { SharedSettingsService } from '../shared-settings.service';

const API_URL = END_POINTS.stockTakingTrxItems;

@Injectable({
    providedIn: 'root'
})
export class StockTakingTrxItemsService {

    constructor(
        private http: HttpClient,
        private apiHelper: ApiHelper,
        private sharedSettingsService: SharedSettingsService
      ) { }
      
      getAll(serial: number, filterParams?: FilterParams): Observable<ResultWithPagination<StockTakingTrxItemWithNames[]>> {
        if(!filterParams) filterParams = new FilterParams();
        return this.http.get<StockTakingTrxItemWithNames[]>(API_URL+`/${serial}`, { 
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
      create(model: StockTakingTrxItem): Observable<StockTakingTrxItem> {
        model.itemYear = this.sharedSettingsService.getSessionYearNumber();
        return this.http.post<StockTakingTrxItem>(API_URL, model);
      }
      update(model: StockTakingTrxItem): Observable<StockTakingTrxItem> {
        return this.http.put<StockTakingTrxItem>(API_URL+`/${model.serial}/${model.lineNo}`, model);
      }
      delete(serial: number, lineNo: number) {
        return this.http.delete(API_URL+`/${serial}/${lineNo}`);
      }
      getNewId(serial: number): Observable<number> {
        const action = "/GetNewId";
        return this.http.get<number>(API_URL+action+`/${serial}`)
      }
}
