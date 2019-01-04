import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthService } from '../../../shared/Services/auth.service';
import { environment } from 'src/environments/environment';

export class AddTokenInterceptor implements HttpInterceptor {

    constructor(private authService: IAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith(environment.apihost)) {
            const token = this.authService.getToken();
            if (token) {
                const newHeaders = req.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
                // Requests MUST be inmutable
                req = req.clone({
                    headers: newHeaders
                });
            }
        }
        // Continue
        return next.handle(req);
    }
}
