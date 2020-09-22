import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { ApiHelper } from './api-helper.service';
import { SharedSettingsService } from '../shared-settings.service';
import { FilterParams, ResultWithPagination } from '../../models';
import { MngrOrdersItem, MngrOrdersItemWithNames } from '../../models/mngrOrdersItem.model';

const API_URL = END_POINTS.MngrOrdersItems;

@Injectable({
  providedIn: 'root'
})
export class MngrOrdersItemService {

  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelper,
    private sharedSettingsService: SharedSettingsService
  ) { }


  getAll(serial: number,filterParams?: FilterParams): Observable<ResultWithPagination<MngrOrdersItemWithNames[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<MngrOrdersItemWithNames[]>(API_URL+`/${serial}`, { 
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
  create(model: MngrOrdersItem): Observable<MngrOrdersItem> {
    model.itemYear = this.sharedSettingsService.getSessionYearNumber();
    return this.http.post<MngrOrdersItem>(API_URL, model);
  }
  update(model: MngrOrdersItem): Observable<MngrOrdersItem> {
    return this.http.put<MngrOrdersItem>(API_URL+`/${model.serial}/${model.lineNo}`, model);
  }
  delete(serial: number, lineNo: number) {
    return this.http.delete(API_URL+`/${serial}/${lineNo}`);
  }
  getNewId(serial: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${serial}`)
  }
}
