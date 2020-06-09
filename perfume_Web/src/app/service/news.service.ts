import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Observable} from 'rxjs';
import {IPaging, Paging, ResponseMsg} from '../model/base-respone.model';
import {createRequestOption} from '../utils/request.utils';
import {News} from '../model/news.model';

type EntityResponseType = HttpResponse<News>;
type EntityArrayResponseType = HttpResponse<News[]>;

interface PagingResponse {
    data: News[];
    paging: Paging;
}

type PagingResponseType = HttpResponse<PagingResponse>;

@Injectable({providedIn: 'root'})
export class NewsService {
    public resourceUrl: string = SERVER_API_URL + '/news';

    constructor(private http: HttpClient) {
    }

    // findAll(): Observable<EntityArrayResponseType> {
    //     return this.http.get<News[]>(`${SERVER_API_URL}/`, {observe: 'response'});
    // }

    query(req?: any): Observable<HttpResponse<PagingResponse>> {
        const options = createRequestOption(req);
        return this.http.get<PagingResponse>(`${this.resourceUrl}`, {
            params: options,
            observe: 'response'
        });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<News>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }

    filter(
        paging: IPaging,
        filter: any
    ): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http.post<PagingResponse>(
            `${this.resourceUrl}/filter/${paging.page}/${paging.limit}`,
            filter,
            {observe: 'response'}
        );
    }

    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http.post<News[]>(`${this.resourceUrl}/filter`, filter, {
            observe: 'response'
        });
    }

    create(news: News): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.resourceUrl, news, {
            observe: 'response'
        });
    }

    findByCode(code: string): Observable<HttpResponse<ResponseMsg>> {
        return this.http.get<ResponseMsg>(`${this.resourceUrl}/${code}`, {
            observe: 'response'
        });
    }

    update(news: News): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.resourceUrl}/${news.id}`, news, {
            observe: 'response'
        });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }
}
