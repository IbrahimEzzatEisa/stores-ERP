import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiHelper } from 'src/app/shared/services/api';
import { SharedSettingsService } from 'src/app/shared/services/shared-settings.service';
import { END_POINTS } from './globals';
import { Item, FilterParams, ResultWithRanking } from 'src/app/shared/models';
import { ResultWithPagination } from '../../models/result-with-pagination.model';
import { DateService } from '../date.service';
import { Console } from '@angular/core/src/console';

const API_URL = END_POINTS.items;

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  

    constructor(
      private http: HttpClient,
      private apiHelper: ApiHelper,
      private dateService:DateService,
      private sharedSettingsService: SharedSettingsService
    ) {}
    
    get(groupId: string, id: string, year: string): Observable<ResultWithRanking<Item>> {
      return this.http.get<ResultWithRanking<Item>>(API_URL+`/${groupId}/${id}/${year}`);
    }
    getFirstRow(): Observable<ResultWithRanking<Item>> {
      const action = "/GetFirstRow";
      const sessionYear = this.sharedSettingsService.getSessionYear();
      return this.http.get<ResultWithRanking<Item>>(API_URL+action+`/${sessionYear}`);
    }
    getLastRow(): Observable<ResultWithRanking<Item>> {
      const action = "/GetLastRow";
      const sessionYear = this.sharedSettingsService.getSessionYear();
      return this.http.get<ResultWithRanking<Item>>(API_URL+action+`/${sessionYear}`);
    }
    getPreviousRow(rank: number, year: string): Observable<ResultWithRanking<Item>> {
      const action = "/GetPreviousRow";
      return this.http.get<ResultWithRanking<Item>>(API_URL+action+`/${rank}/${year}`);
    }
    getNextRow(rank: number, year: string): Observable<ResultWithRanking<Item>> {
      const action = "/GetNextRow";
      return this.http.get<ResultWithRanking<Item>>(API_URL+action+`/${rank}/${year}`);
    }
    getAll(filterParams?: FilterParams): Observable<ResultWithPagination<Item[]>> {
      if(!filterParams) filterParams = new FilterParams();
      const sessionYear = this.sharedSettingsService.getSessionYear();
      return this.http.get<Item[]>(API_URL+`/${sessionYear}`, { 
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
    getByItemsGroupId(itemsGroupId: string, groupYear?: number | string): Observable<Item[]> {
      const action='/GetByItemGroupId';    
      const sessionYear = this.sharedSettingsService.getSessionYear();
      groupYear = groupYear || sessionYear;
      return this.http.get<Item[]>(API_URL+action+`/${itemsGroupId}/${groupYear}`);
    }
    create(model: Item): Observable<Item> {
      return this.http.post<Item>(API_URL, model);
    }
    update(groupId: string, id: string, year: string, model: Item): Observable<ResultWithRanking<Item>> {
      return this.http.put<ResultWithRanking<Item>>(API_URL+`/${groupId}/${id}/${year}`, model);
    }
    delete(groupId: string, id: string, year: string): Observable<Item> {
      return this.http.delete<Item>(API_URL+`/${groupId}/${id}/${year}`);
    }
    getNewId(itemGroupId: string): Observable<{newItemId: string}> {
      const action='/GetNewId';    
      const sessionYear = this.sharedSettingsService.getSessionYear();
      return this.http.get<{newItemId: string}>(API_URL + action + `/${sessionYear}/${itemGroupId}`);
    }
    printReport(groupId: string, id: string, year: string): Observable<number> {
      const action = "/ShowReport";
      console.log("url print",API_URL+action +`/${groupId}/${id}/${year}`)
      return this.http.get<any>(API_URL+action +`/${groupId}/${id}/${year}`)
    }
    
}