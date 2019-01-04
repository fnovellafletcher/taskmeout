import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(private authService: IAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(error => {

            if (error.status === 401 && error.url.startsWith(environment.apihost)) { // in case the error comes from third parties

                // Inform the authService that the current token is invalid, it may refresh the token, ask for credentials, whatever
                return of(this.authService.logout());
            }

            // Default action
            return throwError(error);
        }));
    }
}
