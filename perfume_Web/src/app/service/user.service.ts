import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {User} from '../model/user';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request.utils';
import {IPaging, ResponseMsg} from '../model/base-respone.model';

type EntityResponseType = HttpResponse<User>;
type EntityArrayResponseType = HttpResponse<User[]>;

interface PagingResponse {
    data: User[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class UserService {
    public resourceUrl = SERVER_API_URL + '/user';

    constructor(private http: HttpClient) {
    }

    query(req?: any): Observable<HttpResponse<PagingResponse>> {
        const options = createRequestOption(req);
        return this.http
            .get<PagingResponse>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }

    
    findByUserName(username: string): Observable<EntityResponseType> {
        return this.http
            .get<User>(`${this.resourceUrl}/find/${username}`, {observe: 'response'});
    }

    filterAll(filter?: any): Observable<EntityArrayResponseType> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<User[]>(`${this.resourceUrl}/filter`, filter, {observe: 'response'});
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<User>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    filter(paging: IPaging, filter: any): Observable<HttpResponse<PagingResponse>> {
        if (filter == null) {
            filter = {};
        }
        return this.http
            .post<PagingResponse>(`${this.resourceUrl}/filter/${paging.page}/${paging.limit}`, filter, {observe: 'response'});
    }


    create(user: User): Observable<HttpResponse<any>> {
        return this.http
            .post<any>(this.resourceUrl, user, {observe: 'response'});
    }

    update(user: User): Observable<HttpResponse<ResponseMsg>> {
        return this.http
            .put<ResponseMsg>(`${this.resourceUrl}/${user.id}`, user, {observe: 'response'});
    }

    changeUserLogin(user: User): Observable<HttpResponse<ResponseMsg>> {
        return this.http
            .put<ResponseMsg>(`${SERVER_API_URL}/change-user-login`, user, {observe: 'response'});
    }

    changePassword(user: User): Observable<HttpResponse<ResponseMsg>> {
        return this.http
            .put<ResponseMsg>(`${SERVER_API_URL}/change-password`, user, {observe: 'response'});
    }
    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

}
