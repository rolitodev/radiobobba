import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, forkJoin, interval, switchMap } from 'rxjs';
import { RadioService } from '../../services/radio.service';
import { FirestoreService } from '../../services/firestore.service';

import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dj',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './dj.component.html',
  styleUrl: './dj.component.scss',
})

export class DjComponent implements OnInit {

  private subscription!: Subscription;

  public items$!: Observable<any[]>;
  public itemsStatus$!: Observable<any[]>;
  public itemsRadioInfo$!: Observable<any[]>;

  public radioInfo: any = {};

  public petitionsStatus: boolean = false;
  public imActive: boolean = false;

  constructor(private _radio: RadioService, private firestoreService: FirestoreService) { }

  ngOnInit(): void {

    this._radio.changeStatusShowRadio(false);

    // Crea un intervalo que emite cada 40,000 milisegundos (40 segundos)
    this.subscription = interval(20000).pipe(
      // Usamos switchMap para cancelar la solicitud anterior si una nueva emisión ocurre
      switchMap(() => this._radio.getDataRadio())
    ).subscribe({
      next: (response: any) => {
        this.radioInfo = response;
      },
      error: (err) => {
        throw err;
      }
    });

    // Realiza la primera llamada inmediatamente
    this._radio.getDataRadio().subscribe({
      next: async (response: any) => {
        this.radioInfo = response;
      },
      error: (err) => {
        throw err;
      }
    });

    // Realiza la suscripción a la colección de firebase
    this.items$ = this.firestoreService.getCollection('peticiones');
    this.itemsStatus$ = this.firestoreService.getCollection('peticiones_status');
    this.itemsRadioInfo$ = this.firestoreService.getCollection('radio_info');

    this.items$ = this.firestoreService.getCollection('peticiones').pipe(
      switchMap(items => this.fetchImagesForItems(items))
    );

    this.itemsStatus$.subscribe((items: any) => {
      this.petitionsStatus = items[0].status;
    });

    this.itemsRadioInfo$.subscribe((items: any) => {
      this.imActive = items[0].dj == JSON.parse(localStorage.getItem('user')!).name ? true : false;
    });

  }

  fetchImagesForItems(items: any[]): Observable<any[]> {
    const observables = items.map(item => {
      return this._radio.getHabboInfo(item.habbo).pipe(
        switchMap((items: any) => {
          item.habboImage = `https://www.habbo.com/habbo-imaging/avatarimage?figure=${items.figureString}&gender=M&direction=2&head_direction=2&action=&gesture=nrm&headonly=1`
          return [item]; // Retorna el item actualizado como un array observable
        })
      );
    });
    return forkJoin(observables); // Combina todos los observables en uno solo
  }

  ngOnDestroy() {
    // Asegúrate de desuscribirte cuando el componente se destruya para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeStatusImActive(): void {
    this.imActive = !this.imActive;
    this.firestoreService.updateDocument('radio_info', 'xQ8Gd0je4P4DdkCObWoV', { dj: this.imActive ? JSON.parse(localStorage.getItem('user')!).name : 'AutoDJ' })
  }

  changeValuePetitions(): void {
    this.petitionsStatus = !this.petitionsStatus;
    this.firestoreService.updateDocument('peticiones_status', 'vTtNi5FOOXVCRru7krDe', { status: this.petitionsStatus })
  }

}
