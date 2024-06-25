import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public isAuth: boolean = localStorage.getItem('user') ? true : false;

  constructor(public http: HttpClient) { }

  getLogin(data: any): Observable<any> {
    return this.http.post<any[]>(`https://radiobobbaapi.alwaysdata.net/api/login.php`, { ...data }).pipe();
  }

  register(data: any): Observable<any> {
    return this.http.post<any[]>(`https://backend-radiobobba.onrender.com/auth/register`, { ...data }).pipe();
  }

  changeStatusAuth(status: boolean): void {
    this.isAuth = status;
  }

}
