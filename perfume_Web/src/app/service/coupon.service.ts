import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Coupon} from '../model/coupon.model';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request.utils';
import {IPaging} from '../model/base-respone.model';
import {Product} from '../model/product.model';

type EntityResponseType = HttpResponse<Coupon>;
type EntityArrayResponseType = HttpResponse<Coupon[]>;

interface PagingResponse {
    data: Coupon[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class CouponService {
    public resourceUrl = SERVER_API_URL + '/coupon';

    constructor(private http: HttpClient) {
    }

    query(req?: any): Observable<HttpResponse<PagingResponse>> {
        const options = createRequestOption(req);
        return this.http
            .get<PagingResponse>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }

    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<Coupon[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Coupon>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    create(coupon: Coupon): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, coupon, {observe: 'response'});
    }

    validateCode(code): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(`${this.resourceUrl}/validate/${code}`, {observe: 'response'});
    }

    update(coupon: Coupon): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${coupon.id}`, coupon, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
