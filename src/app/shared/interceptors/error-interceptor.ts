import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Send request to next handler, we are only interested in listening to the output for errors
        return next.handle(req).pipe(catchError(error => {

            switch (error.status) {
                case 0:
                    this.snackBar.open('Missing response', 'Ok', {
                        duration: 2000
                    });
                    break;
                case 500:
                    this.snackBar.open('Missing response', 'Ok', {
                        duration: 2000
                    });
                    break;
                default:
                    break;
            }

            // Propagate the error, the subscriber may want to handle it too
            return throwError(error);
        }));
    }
}
