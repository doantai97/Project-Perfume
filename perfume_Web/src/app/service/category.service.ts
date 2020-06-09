import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Category} from "../model/category.model";
import {Observable} from "rxjs";
import {createRequestOption} from "../utils/request.utils";
import {IPaging} from "../model/base-respone.model";

type EntityResponseType = HttpResponse<Category>;
type EntityArrayResponseType = HttpResponse<Category[]>;

interface PagingResponse {
    data: Category[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class CategoryService {
    public resourceUrl = SERVER_API_URL + '/category';

    constructor(private http: HttpClient) {
    }

    // findAll(): Observable<EntityArrayResponseType> {
    //     return this.http.get<Category[]>(`${SERVER_API_URL}/categories`, {observe: 'response'});
    // }


    query(req?: any): Observable<HttpResponse<PagingResponse>> {
        const options = createRequestOption(req);
        return this.http
            .get<PagingResponse>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Category>(`${this.resourceUrl}/${id}`, {observe: 'response'});
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
            .post<Category[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }

    create(category: Category): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, category, {observe: 'response'});
    }

    update(category: Category): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${category.id}`, category, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }


    // create(account: IAccount): Observable<EntityResponseType> {
    //     const copy = this.convertDateFromClient(account);
    //     return this.http
    //         .post<IAccount>(this.resourceUrl, copy, { observe: 'response' });
    // }
    //
    // update(account: IAccount): Observable<EntityResponseType> {
    //     const copy = this.convertDateFromClient(account);
    //     return this.http
    //         .put<IAccount>(`${this.resourceUrl}/${account.id}`, copy, { observe: 'response' });
    // }
    //
    // find(id: number): Observable<EntityResponseType> {
    //     return this.http
    //         .get<IAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    // }

}
