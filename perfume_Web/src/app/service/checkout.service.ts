import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CART_ITEM, SERVER_API_URL, USER_LOGIN} from '../app.constants';
import {BehaviorSubject, Observable} from 'rxjs';
import {Checkout} from '../model/checkout.model';
import {Category} from '../model/category.model';
import {map} from 'rxjs/operators';
import {ProductService} from './product.service';
import {ResponData} from "../comom/constant/base.constant";
import {IPaging, Paging} from "../model/base-respone.model";
import {Fragrant} from "../model/fragrant.model";
import {createRequestOption} from "../utils/request.utils";
import {AddressService} from "./address.service";

type EntityResponseType = HttpResponse<Checkout>;
type EntityArrayResponseType = HttpResponse<Checkout[]>;

interface PagingResponse {
    data: Checkout[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class CheckoutService {

    public resourceUrl = SERVER_API_URL + '/checkout';

    constructor(private http: HttpClient, private productService: ProductService) {
    }


    create(checkout: any): Observable<HttpResponse<ResponData>> {
        return this.http.post<ResponData>(this.resourceUrl, checkout, {observe: 'response'});
    }

    // delete(id: number, node: string): Observable<HttpResponse<any>> {
    //     const tmp: any = {
    //         node: node
    //     };
    //     const options = createRequestOption(tmp);
    //     return this.http.put<any>(`${this.resourceUrl}/deleted/${id}`, {
    //         observe: 'response', params: options
    //     });
    // }

    // deleteCheckout(id: number, node: string): Observable<HttpResponse<any>> {
    //     const tmp = {
    //         node: node
    //     }
    //     return this.http
    //         .put<any>(`${this.resourceUrl}/${id}`, tmp, {observe: 'response'});
    // }


    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<Checkout[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    update(checkoout: Checkout): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${checkoout.id}`, checkoout, {observe: 'response'});
    }

    findByUserLogin(id): Observable<EntityArrayResponseType> {
        //
        // return this.filterAll({
        //     userId: id
        // }).pipe(map(checkouts => {
        //     this.setCheckoutItem(checkouts.body);
        //     return checkouts;
        // }));
        return null;
    }

    getChart(param: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(param);
        return this.http.get<ResponData>(`${this.resourceUrl}/chart`, {params: options, observe: 'response'});
    }

}
