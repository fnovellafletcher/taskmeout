import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export class CorsHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.startsWith(environment.apihost)) {

            const newHeaders = req.headers.append('Access-Control-Allow-Origin', 'true');
            // Requests MUST be inmutable
            req = req.clone({
                headers: newHeaders
            });
        }

        // Continue
        return next.handle(req);
    }
}
