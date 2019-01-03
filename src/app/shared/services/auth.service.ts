import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { shareReplay, delay, switchMap, catchError, flatMap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LoginResult } from '../model/login-result';

// Our services will always extend an abstract contract.
// We will implement two versions, API (consuming real API's)
// and Fake (no third parties, all fake data directly from TS)

@Injectable({
  providedIn: 'root'
})
export abstract class IAuthService {
  public static USER_DOES_NOT_EXIST = 'UserDoesNotExist';
  public static INCORRECT_PASSWORD = 'IncorrectPassword';
  public static LOGIN_ERROR = 'UserDoesNotExist';

  abstract login(username: string, password: string): Observable<LoginResult>;
  abstract logout();
  abstract isLogged(): Observable<boolean>;
  abstract getToken(): string;
  abstract getUsername(): string;
}

class RealAuthService extends IAuthService {

  private readonly loginURL = environment.apihost + '/users/login';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';

  private _isLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient) {
    super();
  }

  login(username, password): Observable<LoginResult> {
    const data = {
      username: username,
      password: password
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', 'true');

    const login$ = this.http.post(this.loginURL, data, { headers: headers, observe: 'response', responseType: 'text' })
      .pipe(catchError(error => {
        return of(error);
      }))
      .pipe(flatMap(response => {
        switch (response.status) {
          case 200: {
            const authToken = response.body;
            localStorage.setItem(this.TOKEN_KEY, authToken);
            localStorage.setItem(this.USERNAME_KEY, username);
            this._isLoggedIn.next(true);
            return of(new LoginResult(true));
          }
          case 204:
            this.logout();
            return of(new LoginResult(false, IAuthService.USER_DOES_NOT_EXIST));
          case 401:
            this.logout();
            return of(new LoginResult(false, IAuthService.INCORRECT_PASSWORD));
          // 500 will be handled by an interceptor
          default:
            this.logout();
            return of(new LoginResult(false, IAuthService.LOGIN_ERROR));
        }
      }));

    return login$;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this._isLoggedIn.next(false);
  }

  isLogged(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY);
  }
}

class FakeAuthService extends IAuthService {

  private _isLoggedIn = new BehaviorSubject(false);

  private loggedIn$ = this._isLoggedIn.asObservable();

  constructor() {
    super();
  }

  login(username: string, password: string): Observable<LoginResult> {
    console.log('Fake auth service called: login');
    const randomSuccess = Math.random() > 0.5;
    this._isLoggedIn.next(randomSuccess);
    return of(new LoginResult(randomSuccess, Math.random() > 0.5 ? IAuthService.INCORRECT_PASSWORD : IAuthService.USER_DOES_NOT_EXIST))
      .pipe(delay(600));
  }

  logout() {
    console.log('Fake auth service called: logout');
    this._isLoggedIn.next(false);
  }

  isLogged(): Observable<boolean> {
    console.log('Fake auth service called: isLogged');
    return this.loggedIn$;
  }

  getToken() {
    console.log('Fake auth service called: getToken');
    return 'FakeAuthToken';
  }

  getUsername(): string {
    console.log('Fake auth service called: getUsername');
    return 'Fake User';
  }
}

// Factory is in charge of choosing the implementation for the service regarding our environment state
export const authFactory = (http: HttpClient) =>
  environment.fakeApi ? new FakeAuthService() : new RealAuthService(http);
