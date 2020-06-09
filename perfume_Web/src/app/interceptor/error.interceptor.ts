import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../service/authentication.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AlertService} from "../service/alert.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, protected router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log({
            msg: 'ErrorInterceptor'
        });
        // this.alertService.success("hDz");
        // console.log(request.body !== null &&);
        // // if (request.body.status) {
        // //     console.log(request.body);
        // //     this.alertService.success(request.body.msg);
        // // }
        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            } else if (err.status === 403) {
                this.router.navigate(['/403']);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
