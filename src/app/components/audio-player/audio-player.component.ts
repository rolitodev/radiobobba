import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RadioService } from '../../services/radio.service';
import { ModalFormPetitionComponent } from '../modals/modal-form-petition/modal-form-petition.component';
import { Observable, Subscription, interval, switchMap } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSliderModule, MatTooltipModule, MatBottomSheetModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})

export class AudioPlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('audioPlayer') public audioPlayer!: ElementRef<HTMLAudioElement>;

  public isPlaying: boolean = false; // Estado de reproducción del audio

  public volume: number = 0.5; // Valor inicial del volumen (50%)

  public habboData: any = {
    image: 'https://www.habbo.com/habbo-imaging/avatarimage?figure=hr-3791-1398-61.hd-4383-7-61.ch-215-1408-61.lg-3787-110-61.sh-4159-110-61.he-1604-95-61.ea-3169-110-61.ca-4173-61-61.cc-4952-110-61&gender=M&direction=2&head_direction=2&action=,crr=0&gesture=nrm&size=l',
    name: 'AutoDJ'
  };

  public radioInfo: any = {};

  public items$!: Observable<any[]>;
  private subscription!: Subscription;

  constructor(
    private _cdr: ChangeDetectorRef, private _bottomSheet: MatBottomSheet, private _radio: RadioService,
    private firestoreService: FirestoreService
  ) { }

  // Obtener los datos de la radio
  ngOnInit(): void {

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

    this.items$ = this.firestoreService.getCollection('radio_info');

    this.items$.subscribe((items: any) => {
      
      if (items[0].dj.toString().toLowerCase() === 'autodj') {
        this.habboData.image = 'https://www.habbo.com/habbo-imaging/avatarimage?figure=hr-3791-1398-61.hd-4383-7-61.ch-215-1408-61.lg-3787-110-61.sh-4159-110-61.he-1604-95-61.ea-3169-110-61.ca-4173-61-61.cc-4952-110-61&gender=M&direction=2&head_direction=2&action=,crr=0&gesture=nrm&size=l';
        return;
      }

      this.habboData.name = items[0].dj;

      this._radio.getHabboInfo(items[0].dj).subscribe({
        next: async (response: any) => {
          if (typeof response === 'object' && response !== null) {
            this.habboData.image = `https://www.habbo.com/habbo-imaging/avatarimage?figure=${response.figureString}&gender=M&direction=2&head_direction=2&action=wav,crr=667&gesture=sml&size=l`;
          }
        }
      });

    });

  }

  ngAfterViewInit() {

    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      // Recuperar el volumen almacenado en localStorage
      const storedVolume = localStorage.getItem('audioVolume');

      if (storedVolume !== null) {
        this.volume = parseFloat(storedVolume);
      }

      // Establecer el volumen inicial
      audio.volume = this.volume;
      this._cdr.detectChanges();

      // Intentar reproducir automáticamente al cargar
      audio.play().then(() => {
        this.isPlaying = true;
      }).catch(() => {
        this.isPlaying = false;
      });

      // Configurar el tiempo inicial cuando comienza a reproducir
      audio.onplay = () => {
        this.isPlaying = true;
      };

      // Manejar la pausa
      audio.onpause = () => {
        this.isPlaying = false;
      };
    }

  }

  // Función para reproducir o pausar el audio
  togglePlayPause() {
    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    }
  }

  // Función para cambiar el volumen del audio
  onVolumeChange(event: any) {
    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      const volume = event.target.value;
      audio.volume = volume; // Ajustar el volumen del audio
      this.volume = volume; // Actualizar el valor del volumen en el componente

      // Guardar el volumen en localStorage
      localStorage.setItem('audioVolume', volume);
    }
  }

  reloadPage(): void {
    location.reload();
  }

  convertPercentage(number: number) {
    return parseFloat(number.toFixed(2));
  }

  convertString(songString: string) {
    let cleanedString = songString.replace(/^\d+\.\)\s*|<br>/g, '');
    return cleanedString;
  }

  // Funcion para abrir el formulario de radio
  openFormRadio(): void {
    this._bottomSheet.open(ModalFormPetitionComponent);
  }

  ngOnDestroy() {
    // Asegúrate de desuscribirte cuando el componente se destruya para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}