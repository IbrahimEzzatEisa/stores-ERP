import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { FilterParams, WorkPlace, ResultWithRanking, ResultWithPagination } from '../../models';
import { ApiHelper } from './api-helper.service';

const API_URL = END_POINTS.workPlaces;

interface LoginResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class WorkPlacesService { 

  constructor(
    private http:HttpClient,
    private apiHelper: ApiHelper
  ) { }

  get(id: number): Observable<ResultWithRanking<WorkPlace>> {
    return this.http.get<ResultWithRanking<WorkPlace>>(API_URL+`/${id}`);
  }
  getAll(filterParams?: FilterParams): Observable<ResultWithPagination<WorkPlace[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<WorkPlace[]>(API_URL, { 
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
  create(model: WorkPlace): Observable<WorkPlace> {
    return this.http.post<WorkPlace>(API_URL, model);
  }
  update(id: number, model: WorkPlace): Observable<WorkPlace> {
    return this.http.put<WorkPlace>(API_URL+`/${id}`, model);
  }
  delete(id: number): Observable<WorkPlace> {
    return this.http.delete<WorkPlace>(API_URL+`/${id}`);
  }
  getNewId(): Observable<number> {
    const action = "/GetNewId";
    return this.http.get<number>(API_URL+action)
  }
  getFirst():Observable<ResultWithRanking<WorkPlace>>{
    const action="/GetFirstRow"
    return this.http.get<ResultWithRanking<WorkPlace>>(API_URL+action)
  }
  getLast():Observable<ResultWithRanking<WorkPlace>>{
    const action="/GetLastRow"
    return this.http.get<ResultWithRanking<WorkPlace>>(API_URL+action)
  }

  getNext(id):Observable<ResultWithRanking<WorkPlace>>{
    const action="/GetNextRow/"
    return this.http.get<ResultWithRanking<WorkPlace>>(API_URL+action+id)

  }
  getPrevious(id):Observable<ResultWithRanking<WorkPlace>>{
    console.log("prev id=",id);
    const action="/GetPreviousRow/"
    return this.http.get<ResultWithRanking<WorkPlace>>(API_URL+action+id)

  }
  printReport(): Observable<any> {
    const action = "/ShowReport";
    return this.http.get<any>(API_URL+action)
  }
}


