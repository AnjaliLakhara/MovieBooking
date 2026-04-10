import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
   provideFirestore(() => initializeFirestore(getApp(), {
      experimentalForceLongPolling: true 
    })),
    provideAuth(() => getAuth())
  ]
};