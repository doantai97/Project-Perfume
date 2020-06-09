import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';


@Injectable({providedIn: 'root'})
export class AuthEmployeeGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // authorised so return true
            const tmp = currentUser.user.roles.some(role => {
                if (role.name === 'ROLE_ADMIN') {
                    return true;
                }

            });
            if (tmp) {
                return true;
            }
            this.router.navigate(['/403'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
