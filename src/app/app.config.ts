import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { provideStore } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { provideRouterStore } from '@ngrx/router-store';
import { RecipeEffects } from './recipes/store/recipe.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    provideStore(fromApp.appReducer),
    provideEffects([AuthEffects, RecipeEffects]),
    provideStoreDevtools({
      logOnly: environment.production,
    }),
    provideRouterStore()
  ]
};