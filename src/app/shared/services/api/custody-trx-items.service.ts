import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS } from './globals';
import { map } from 'rxjs/operators';

import { FilterParams, ResultWithPagination, ResultWithTotal } from 'src/app/shared/models';
import { ApiHelper } from './api-helper.service';
import { CustodyTrxItems } from '../../models/custodyTrxItems.model';

const API_URL = END_POINTS.CustodyTrxesItems;

@Injectable({
  providedIn: 'root'
})
export class CustodyTrxItemsService {

  constructor(private http: HttpClient,
              private apiHelper: ApiHelper) { }

  getAll(typeId: number, serial: number, filterParams?: FilterParams): 
  Observable<ResultWithPagination<ResultWithTotal<CustodyTrxItems[]>>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<ResultWithTotal<CustodyTrxItems[]>>(API_URL+`/${typeId}/${serial}`, { 
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
  create(model: CustodyTrxItems): Observable<CustodyTrxItems> {
    return this.http.post<CustodyTrxItems>(API_URL, model);
  }
  update(model: CustodyTrxItems): Observable<CustodyTrxItems> {
    return this.http.put<CustodyTrxItems>(API_URL+`/${model.type}/${model.serial}/${model.lineNo}`, model);
  }
  delete(typeId: number, serial: number, lineNo: number) {
    return this.http.delete(API_URL+`/${typeId}/${serial}/${lineNo}`);
  }
  getNewId(typeId: number, serial: number): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action+`/${typeId}/${serial}`)
  }
  getEmployeeItems(type: number, serial: number, empId: number) {
    const action = '/AddAllItemsByEmp';
    return this.http.post<CustodyTrxItems[]>(API_URL+action+`/${type}/${serial}/${empId}`, {});
  }
}
