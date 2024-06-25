import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, catchError, forkJoin, interval, switchMap } from 'rxjs';
import { RadioService } from '../../services/radio.service';
import { FirestoreService } from '../../services/firestore.service';

import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateRoomsComponent } from '../../components/modals/modal-create-rooms/modal-create-rooms.component';
import { ModalRegisterUserComponent } from '../../components/modals/modal-register-user/modal-register-user.component';

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

  constructor(
    private _radio: RadioService, public dialog: MatDialog,
    private firestoreService: FirestoreService) { }

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

    this.items$ = this.firestoreService.getCollectionv2('peticiones').pipe(
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
        switchMap((habboInfo: any) => {
          // Construir la URL de la imagen usando la información de Habbo
          item.habboImage = `https://www.habbo.com/habbo-imaging/avatarimage?figure=${habboInfo.figureString}&gender=M&direction=2&head_direction=2&action=&gesture=nrm&headonly=1`;
          return [item]; // Retorna el item actualizado como un array observable
        }),
        catchError(() => {
          // Manejo de errores: asignar una imagen por defecto
          item.habboImage = 'https://www.habbo.com/habbo-imaging/avatarimage?figure=hr-3163-61-.hd-190-10-.ch-3030-110-.lg-5594-110-.sh-3524-110-1408-.ha-5004-61-61.he-3660-64-76-.fa-3993-110-.cc-886-110-&gender=M&direction=2&head_direction=2&action=&gesture=nrm&headonly=1'; // URL de la imagen por defecto
          return [item]; // Retorna el item con la imagen por defecto
        })
      );
    });

    return forkJoin(observables); // Combina todos los observables en uno solo
  }

  openModalCreateRoom(): void {
    this.dialog.open(ModalCreateRoomsComponent);
  }

  openModalRegisterUser(): void {
    this.dialog.open(ModalRegisterUserComponent);
  }

  changeStatusImActive(): void {
    this.imActive = !this.imActive;
    this.firestoreService.updateDocument('radio_info', 'xQ8Gd0je4P4DdkCObWoV', { dj: this.imActive ? JSON.parse(localStorage.getItem('user')!).name : 'AutoDJ' })
  }

  changeValuePetitions(): void {
    this.petitionsStatus = !this.petitionsStatus;
    this.firestoreService.updateDocument('peticiones_status', 'vTtNi5FOOXVCRru7krDe', { status: this.petitionsStatus })
  }

  deletePetition(id: string): void {
    this.firestoreService.deleteDocument('peticiones', id);
  }

  ngOnDestroy() {
    // Asegúrate de desuscribirte cuando el componente se destruya para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
