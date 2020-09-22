import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS } from './globals';
import { Menu } from '../../models';

const API_URL = END_POINTS.menuDropDown+"/FillMenuDropDownList/";

@Injectable({
  providedIn: 'root'
})
export class MenusDropDownService {

  constructor(
    private http: HttpClient
  ) { }
  getMenusById(): Observable<Menu[]> {
    return this.http.get<Menu[]>(API_URL);
  }
}
