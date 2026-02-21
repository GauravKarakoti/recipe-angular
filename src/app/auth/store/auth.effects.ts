import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.action';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate,
    redirect: true
  });
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'INVALID_LOGIN_CREDENTIALS':
      errorMessage = 'Invalid login credentials.';
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) =>
        this.http.post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData =>
            handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          ),
          catchError(handleError)
        )
      )
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) =>
        this.http.post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData =>
            handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          ),
          catchError(handleError)
        )
      )
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/'])
          }
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const stored = localStorage.getItem('userData');
        if (!stored) {
          return { type: '[Auth] No Auto Login' };
        }

        const userData = JSON.parse(stored);

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (!loadedUser.token) {
          return { type: '[Auth] Token Expired' };
        }

        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );
}