import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS } from './globals';

const SERVICE_NAME = "users/ResetPassword";
const API_URL = END_POINTS.users+"/ResetPassword";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  url;
  constructor(
    private http: HttpClient
  ) { }
  resetPasswordService(user)
  {
    this.url = `${API_URL}/${user.userId}`;
    return this.http.put(this.url,user);
  }
}
