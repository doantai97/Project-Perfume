import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Category} from "../model/category.model";
import {Observable} from "rxjs";
import {createRequestOption} from "../utils/request.utils";
import {IPaging} from "../model/base-respone.model";
import {Address, District, Province, Ward} from "../model/address.model";

type EntityResponseType = HttpResponse<Category>;
type EntityArrayResponseType = HttpResponse<Category[]>;


@Injectable({providedIn: 'root'})
export class AddressService {
    public resourceUrl = SERVER_API_URL + '/address';

    constructor(private http: HttpClient) {
    }

    // findAll(): Observable<EntityArrayResponseType> {
    //     return this.http.get<Category[]>(`${SERVER_API_URL}/categories`, {observe: 'response'});
    // }

    findProvince(): Observable<HttpResponse<Province[]>> {
        return this.http
            .get<Province[]>(`${this.resourceUrl}/province`, {observe: 'response'});
    }

    findDistrict(provinceId): Observable<HttpResponse<District[]>> {
        return this.http
            .get<District[]>(`${this.resourceUrl}/district/${provinceId}`, {observe: 'response'});
    }

    findWard(districtId): Observable<HttpResponse<Ward[]>> {
        return this.http
            .get<Ward[]>(`${this.resourceUrl}/ward/${districtId}`, {observe: 'response'});
    }

    findAllByWard(wardId): Observable<HttpResponse<Address>> {
        return this.http
            .get<Address>(`${this.resourceUrl}/${wardId}`, {observe: 'response'});
    }

}
