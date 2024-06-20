import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        apiKey: "AIzaSyAPFkYPTSnStWw1FkPKi6jb3vQjkbrVH_8",
        authDomain: "radiobobba-c2a3b.firebaseapp.com",
        projectId: "radiobobba-c2a3b",
        storageBucket: "radiobobba-c2a3b.appspot.com",
        messagingSenderId: "698800977982",
        appId: "1:698800977982:web:9a5d2d219876d5e9c7396f",
        measurementId: "G-S5EDEDLY3D"
      }),
      AngularFirestoreModule,
      HttpClientModule
    ),
    provideHotToastConfig({
      dismissible: true,
      position: 'bottom-center',
      duration: 5000
    })
  ]
};
