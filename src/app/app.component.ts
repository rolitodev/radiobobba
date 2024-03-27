import { Component, HostBinding, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public darkMode = signal<boolean>(JSON.parse(window.localStorage.getItem('darkMode') ?? 'false'));

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  constructor() {

    effect(() => {
      window.localStorage.setItem('darkMode', JSON.stringify(this.darkMode()));
    });

    let mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
    let isDarkMode = mediaQueryObj.matches;
    // Ya está lista la función que detecta el tema del navegador: claro | oscuro
    // pero hay que continuar desarrollandola
    console.log('isDarkMode', isDarkMode);

  }

  ngOnInit(): void {
    // Se inicializa la librería de los componentes UI.
    initFlowbite();
  }

}
