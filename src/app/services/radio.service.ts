import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RadioService {

  constructor(private http: HttpClient) { }

  // Método para obtener los datos de la radio.
  getDataRadio(): Observable<any> {
    return this.http.get<any[]>(`https://radiobobba.alwaysdata.net/api/external/streaming`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error en la solicitud de datos de la radio'));
      })
    );
  }

  // Método para obtener la información de un usuario de Habbo.
  getHabboInfo(name: string): Observable<any> {
    return this.http.get<any[]>(`https://www.habbo.es/api/public/users?name=${name.toString().trim()}`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error en la solicitud de información de Habbo'));
      })
    );
  }

  getIp(): Observable<any> {
    return this.http.get<any>(`/user-data`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error en la solicitud de la IP'));
      })
    );
  }

}