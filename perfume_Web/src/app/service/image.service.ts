import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
// import {Image} from '../model/image.model';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request.utils';
import {IPaging} from '../model/base-respone.model';
import {Product} from '../model/product.model';

type EntityResponseType = HttpResponse<any>;
type EntityArrayResponseType = HttpResponse<any[]>;


@Injectable({providedIn: 'root'})
export class ImageService {
    public resourceUrl = SERVER_API_URL + '/image';

    constructor(private http: HttpClient) {
    }

    query(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<any>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }

    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<any[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<any>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<any>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    create(image: any): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, image, {observe: 'response'});
    }

    update(image: any): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${image.id}`, image, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
