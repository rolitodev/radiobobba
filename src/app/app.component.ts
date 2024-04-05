import { Component, PLATFORM_ID, Inject, HostBinding } from '@angular/core';
import { initFlowbite } from "flowbite";
import { isPlatformBrowser } from "@angular/common";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  @HostBinding('class.dark') get mode() {
    return this.isDarkMode;
  }

  public isDarkMode: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    if (typeof window !== "undefined") {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('USER IN DARK MODE');
        this.isDarkMode = true;
      } else {
        console.log('USER IN LIGHT MODE');
        this.isDarkMode = false;
      }
   }
  }

  changeThemeMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

}
