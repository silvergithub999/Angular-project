import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AuthResponseData, AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user.model';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (error: any) => {
  let errorMessage = 'Unknown error.';
  if (!error.error || !error.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  } else {
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is taken.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email is not found.';
        break;
      default:
        errorMessage = 'Error: ' + error.error.error.message;
    }
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};


@Injectable()
export class AuthEffects {

  constructor(private http: HttpClient,
              private actions: Actions,
              private router: Router,
              private authService: AuthService) {
  }

  @Effect()
  authSignUp = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signUpAction: AuthActions.SignUpStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBIZYzzasuhiYjU9F6i6wjJlymXTlLPF9k',
        {
          email: signUpAction.payload.email,
          password: signUpAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData =>
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        ),
        map(resData =>
          handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          ),
          catchError(error => handleError(error))
      ));
    })
  );

  @Effect()
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBIZYzzasuhiYjU9F6i6wjJlymXTlLPF9k',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
          tap(resData =>
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          ),
          map(resData =>
            handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          ),
        catchError(error => handleError(error))
      );
    })
  );

  @Effect({dispatch: false})      // Won't yield dispatchable action in the end (observable)
  authRedirect = this.actions.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'DUMMY'};
      }

      const tokenExpDate = new Date(userData._tokenExpirationDate);

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        tokenExpDate
      );

      if (loadedUser.token) {
        const expirationDuration = new Date(tokenExpDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: tokenExpDate,
          redirect: false
        });
      }
      return {type: 'DUMMY'};
    })
  );
}
