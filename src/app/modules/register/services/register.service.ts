import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class IRegisterService {

  abstract register(username: string, password: string): Observable<any>;
}

class RealRegisterService extends IRegisterService {

  private readonly registerUrl = environment.apihost + '/users';

  constructor(private http: HttpClient) {
    super();
  }

  register(username: string, password: string): Observable<any> {
    const data = {
      username: username,
      password: password
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const register$ = this.http.post(this.registerUrl, data, { headers: headers, observe: 'response' })
      .pipe(catchError(error => {
        return of(error);
      }))
      .pipe(flatMap(response => {
        switch (response.status) {
          case 201: {
            return of(true);
          }
          default:
            return of(false);
        }
      }));

    return register$;
  }
}

class FakeRegisterService extends IRegisterService {
  register(username: string, password: string): Observable<any> {
    // no "username in use" check, so we always return true
    return of(true);
  }
}

export const registerFactory = (httpClient: HttpClient) =>
  environment.fakeApi ? new FakeRegisterService() : new RealRegisterService(httpClient);
