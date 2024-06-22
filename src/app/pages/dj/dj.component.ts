import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, interval, switchMap } from 'rxjs';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-dj',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dj.component.html',
  styleUrl: './dj.component.scss',
})

export class DjComponent implements OnInit {

  private subscription!: Subscription;
  public radioInfo: any = {};

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {
    this._radio.changeStatusShowRadio(false);

    // Crea un intervalo que emite cada 40,000 milisegundos (40 segundos)
    this.subscription = interval(20000).pipe(
      // Usamos switchMap para cancelar la solicitud anterior si una nueva emisión ocurre
      switchMap(() => this._radio.getDataRadio())
    ).subscribe({
      next: (response: any) => {
        this.radioInfo = response;
        console.log(this.radioInfo)
      },
      error: (err) => {
        throw err;
      }
    });

    // Realiza la primera llamada inmediatamente
    this._radio.getDataRadio().subscribe({
      next: async (response: any) => {
        this.radioInfo = response;
        console.log(this.radioInfo)
      },
      error: (err) => {
        throw err;
      }
    });

  }


  ngOnDestroy() {
    // Asegúrate de desuscribirte cuando el componente se destruya para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
