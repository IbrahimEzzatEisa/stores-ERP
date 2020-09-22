import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { END_POINTS } from './globals';
import { User, FilterParams, PaginationParams, ResultWithPagination, ResultWithRanking } from 'src/app/shared/models';
import { ApiHelper } from './api-helper.service';
const API_URL = END_POINTS.users;

interface LoginResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService { // UsersService not userService

  constructor(private http:HttpClient,
              private apiHelper: ApiHelper) { }

  login(user: {}) { // 
    const action="/login";
    return this.http.post(API_URL+action, user).pipe(
      map(
        (res: LoginResponse) => {
          localStorage.setItem('token', res.token);
          return res;
        }
      )
    );
  }
  getName(id: string | number): Observable<User> { // this return Name   // get/user > returns user
    return this.http.get<User>(API_URL+`/${id}`);
  }
  get(id: string | number): Observable<ResultWithRanking<User>> {
    const action = "/GetUser";
    return this.http.get<ResultWithRanking<User>>(API_URL+action+`/${id}`);
  }
  getAll(filterParams?: FilterParams): Observable<ResultWithPagination<User[]>> {
    if(!filterParams) filterParams = new FilterParams();
    return this.http.get<User[]>(API_URL, { 
      observe: 'response',
      params: {
        pageNumber: filterParams.pageNumber.toString(),
        pageSize: filterParams.pageSize.toString(),
        searchValue: filterParams.searchValue,
        sortField: filterParams.sortField,
        sortDirection: filterParams.sortDirection
      }
    }).pipe(
      map(this.apiHelper.toResultWithPagination)
    );
  }
  create(model: User): Observable<User> {
    return this.http.post<User>(API_URL, model);
  }
  update(id, model: User): Observable<ResultWithRanking<User>> {
    return this.http.put<ResultWithRanking<User>>(API_URL+`/${id}`, model);
  }
  delete(id): Observable<User> {
    return this.http.delete<User>(API_URL+`/${id}`);
  }
 
  getFirstRow():Observable<ResultWithRanking<User>>{
    const action="/GetFirstRow"
    return this.http.get<ResultWithRanking<User>>(API_URL+action)
  }
  getLastRow():Observable<ResultWithRanking<User>>{
    const action="/GetLastRow"
    return this.http.get<ResultWithRanking<User>>(API_URL+action)
  }

  getNextRow(id):Observable<ResultWithRanking<User>>{
    const action="/GetNextRow/"
    return this.http.get<ResultWithRanking<User>>(API_URL+action+id)

  }
  getPreviousRow(id):Observable<ResultWithRanking<User>>{
    console.log("prev id=",id);
    const action="/GetPreviousRow/"
    return this.http.get<ResultWithRanking<User>>(API_URL+action+id)

  }
  changePassword(pass: {oldPassword: string, newPassword: string}) {
    return this.http.put(API_URL + `/ChangePassword`, pass);
  }
  updatePassword(userId, password) {
    const action="/UpdatePassword";
    return this.http.put(API_URL + action + `/${userId}/${password}`, {});
  }
}


