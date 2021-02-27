import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // return this.oidcSecurityService.isAuthenticated$.pipe(
        //     switchMap(isAuthorized => {
        //         console.log('intercept isAuthorized', isAuthorized);
        //         if (isAuthorized) {
        //             const token = this.oidcSecurityService.getToken();
        //             console.log('token', token);
        //             const cloneRequest = request.clone({
        //                 setHeaders: {
        //                     Authorization: 'Bearer ' + token
        //                 }
        //             });
        //
        //             return next.handle(cloneRequest);
        //         }
        //         return next.handle(request);
        //     })
        // );
        return next.handle(request);
    }
}
