import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CART_ITEM, SERVER_API_URL, USER_LOGIN} from '../app.constants';
import {AuthModel} from '../model/auth.model';
import {CartService} from './cart.service';
import {ResponseMsg} from '../model/base-respone.model';
import {createRequestOption} from '../utils/request.utils';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<AuthModel>;
    public currentUser: Observable<AuthModel>;

    constructor(private http: HttpClient, private cartService: CartService) {
        this.currentUserSubject = new BehaviorSubject<AuthModel>(JSON.parse(localStorage.getItem(USER_LOGIN)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): AuthModel {
        return this.currentUserSubject.value;
    }

    public nextValue(value) {
        this.currentUserSubject.next(value);
    }

    login(username, password) {
        return this.http.post<any>(`${SERVER_API_URL}/login`, {username, password})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log(user);
                localStorage.setItem(USER_LOGIN, JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem(USER_LOGIN);
        this.currentUserSubject.next(null);
        this.cartService.removeCartItem();
    }

    register(user): Observable<HttpResponse<ResponseMsg>> {
        return this.http.post<ResponseMsg>(`${SERVER_API_URL}/register`, user, {observe: 'response'});
    }

    resetPassword(user): Observable<HttpResponse<ResponseMsg>> {
        return this.http.post<ResponseMsg>(`${SERVER_API_URL}/forgot-password`, user, {observe: 'response'});
    }

    confirmAccount(token): Observable<HttpResponse<ResponseMsg>> {
        const req = {
            token: token
        };
        const options = createRequestOption(req);
        return this.http
            .get<ResponseMsg>(`${SERVER_API_URL}/confirm-account`, {params: options, observe: 'response'});
    }

    public get isAdmin() {
        if (this.currentUserValue) {
            return this.currentUserValue.user.roles.some(role => {
                if (role.name === 'ROLE_ADMIN') {
                    return true;
                }
            });
        }
        return false;
    }

    public get isEmploy() {
        if (this.currentUserValue) {
            return this.currentUserValue.user.roles.some(role => {
                if (role.name === 'ROLE_EMPLOYEE') {
                    return true;
                }
            });
        }
        return false;
    }

    getAllRole(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<any>(`${SERVER_API_URL}/roles`, {params: options, observe: 'response'});
    }


}
