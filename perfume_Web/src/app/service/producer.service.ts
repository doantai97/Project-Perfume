import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Producer} from "../model/producer.model";
import {Observable} from "rxjs";
import {createRequestOption} from "../utils/request.utils";
import {IPaging} from "../model/base-respone.model";
import {Product} from "../model/product.model";

type EntityResponseType = HttpResponse<Producer>;
type EntityArrayResponseType = HttpResponse<Producer[]>;

interface PagingResponse {
    data: Producer[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class ProducerService {
    public resourceUrl = SERVER_API_URL + '/producer';

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
            .post<Producer[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Producer>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    create(producer: Producer): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, producer, {observe: 'response'});
    }

    update(producer: Producer): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${producer.id}`, producer, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
