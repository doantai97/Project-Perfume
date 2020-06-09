import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Target} from "../model/target.model";
import {Observable} from "rxjs";
import {createRequestOption} from "../utils/request.utils";
import {IPaging} from "../model/base-respone.model";
import {Producer} from "../model/producer.model";

type EntityResponseType = HttpResponse<Target>;
type EntityArrayResponseType = HttpResponse<Target[]>;

interface PagingResponse {
    data: Target[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class TargetService {
    public resourceUrl = SERVER_API_URL + '/target';

    constructor(private http: HttpClient) {
    }

    query(req?: any): Observable<HttpResponse<PagingResponse>> {
        const options = createRequestOption(req);
        return this.http
            .get<PagingResponse>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Target>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<Target[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }

    create(target: Target): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, target, {observe: 'response'});
    }

    update(target: Target): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${target.id}`, target, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
