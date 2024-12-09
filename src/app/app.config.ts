import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';

registerLocaleData(localeDe);

const config = {
  projectId: 'bubble-86d4d',
  appId: '1:1040544770849:web:1df07c76989e5816c56c60',
  storageBucket: 'bubble-86d4d.firebasestorage.app',
  apiKey: 'AIzaSyA92YnttoSKvwWAHB97wrv-qJS4FiWlh74',
  authDomain: 'bubble-86d4d.firebaseapp.com',
  messagingSenderId: '3761237724',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(config)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
