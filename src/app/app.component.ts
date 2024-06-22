import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RadioService } from './services/radio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AudioPlayerComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  public showRadio: boolean = false;

  constructor(private _radio: RadioService, public _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._radio.showRadio.subscribe((status: boolean) => {
      this.showRadio = status;
      this._cdr.detectChanges();
    });
  }

}


/**
 * rango 0 -> usuario
rango 1 -> dj
rango 8 -> dueño
rango 9 -> programador
 * 
 */