import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {CART_ITEM, SERVER_API_URL, USER_LOGIN} from "../app.constants";
import {BehaviorSubject, Observable} from "rxjs";
import {createRequestOption} from "../utils/request.utils";
import {IPaging} from "../model/base-respone.model";
import {Cart} from "../model/cart.model";
import {AuthModel} from "../model/auth.model";
import {Category} from "../model/category.model";
import {AuthenticationService} from "./authentication.service";
import {map} from 'rxjs/operators';
import {ProductService} from "./product.service";

type EntityResponseType = HttpResponse<Cart>;
type EntityArrayResponseType = HttpResponse<Cart[]>;

@Injectable({providedIn: "root"})
export class CartService {
    private currentCartSubject: BehaviorSubject<Cart[]>;
    public currentCart: Observable<Cart[]>;

    public resourceUrl = SERVER_API_URL + "/cart";

    constructor(private http: HttpClient, private productService: ProductService) {
        this.currentCartSubject = new BehaviorSubject<Cart[]>(JSON.parse(localStorage.getItem(CART_ITEM)));
        this.currentCart = this.currentCartSubject.asObservable();
    }

    public get currentUserValue(): Cart[] {
        return this.currentCartSubject.value;
    }

    // findAll(): Observable<EntityArrayResponseType> {
    //     return this.http.get<Cart[]>(`${SERVER_API_URL}/categories`, {observe: 'response'});
    // }

    uploadQuantity(cart: Cart): Observable<HttpResponse<any>> {
        return this.http.post<any>(
            `${this.resourceUrl}/${cart.id}/${cart.quantity}`,
            {
                observe: "response"
            }
        );
    }

    create(cart: Cart): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.resourceUrl, cart, {observe: "response"});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: "response"
        });
    }

    removeCartItem() {
        // remove user from local storage and set current user to null
        localStorage.removeItem(CART_ITEM);
        this.currentCartSubject.next(null);
    }

    // findAndProduct(id): Observable<EntityArrayResponseType> {
    //     return this.filterAll({
    //         userId: id
    //     }).pipe(map(value => {
    //         value.body.forEach(cartItem => {
    //             this.productService.filterAll({versionId: cartItem.version.id}).subscribe(res => {
    //                 cartItem.version.product = res.body[0];
    //             });
    //         });
    //         return value;
    //     }));
    // }

    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<Category[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }

    findByUserLogin(id): Observable<EntityArrayResponseType> {

        return this.filterAll({
            userId: id
        }).pipe(map(carts => {
            this.setCartItem(carts.body);
            return carts;
        }));
    }

    setCartItem(carts) {
        localStorage.setItem(CART_ITEM, JSON.stringify(carts));
        this.currentCartSubject.next(carts);
    }

}
