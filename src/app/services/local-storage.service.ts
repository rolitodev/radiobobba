import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
  private storageSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Cargar los datos iniciales del localStorage si existen
    const data = localStorage.getItem('user');
    if (data) {
      this.storageSubject.next(JSON.parse(data));
    }
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.storageSubject.next(value); // Emitir el nuevo valor
  }

  getItem(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSubject.next(null); // Emitir null cuando se elimina el dato
  }

  get storageChanges$() {
    return this.storageSubject.asObservable();
  }
}
