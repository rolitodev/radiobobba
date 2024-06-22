import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RadioService {

  @Output() public showRadio: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  // Método para obtener los datos de la radio.
  getDataRadio(): Observable<any> {
    return this.http.get<any[]>(`https://sonic.streamingchilenos.com/cp/get_info.php?p=8074`).pipe(
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

  getTeamActive(): Observable<any> {
    return this.http.get<any>(`https://backend-radiobobba.onrender.com/users/equipo`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error en la solicitud de información del equipo activo'));
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

  changeStatusShowRadio(status: boolean): void {
    this.showRadio.emit(status);
  }

}