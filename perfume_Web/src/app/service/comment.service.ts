import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Comment} from '../model/comment.model';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request.utils';
import {IPaging} from '../model/base-respone.model';
import {Product} from '../model/product.model';

type EntityResponseType = HttpResponse<Comment>;
type EntityArrayResponseType = HttpResponse<Comment[]>;

interface PagingResponse {
    data: Comment[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class CommentService {
    public resourceUrl = SERVER_API_URL + '/comment';

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
            .post<Comment[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Comment>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    findByPostId(type: string, postId: number, paging: IPaging): Observable<HttpResponse<PagingResponse>> {
        return this.http
            .get<PagingResponse>(`${this.resourceUrl}/${type}/${postId}/${paging.page}/${paging.limit}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    create(comment: Comment): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, comment, {observe: 'response'});
    }

    update(comment: Comment): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${comment.id}`, comment, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
