import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request.utils';
import {IPaging} from '../model/base-respone.model';
import {Product} from '../model/product.model';

type EntityResponseType = HttpResponse<any>;
type EntityArrayResponseType = HttpResponse<any[]>;

interface PagingResponse {
    data: any[];
    paging: IPaging;
}

@Injectable({providedIn: 'root'})
export class DisplayStaticService {
    public resourceUrl = SERVER_API_URL + '/display-static';

    constructor(private http: HttpClient) {
    }

    query(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<any>(`${this.resourceUrl}`, {params: options, observe: 'response'});
    }


    find(type: string): Observable<EntityResponseType> {
        return this.http
            .get<any>(`${this.resourceUrl}/${type}`, {observe: 'response'});
    }


    update(displayStatic: any): Observable<HttpResponse<any>> {
        return this.http
            .put<any>(`${this.resourceUrl}/${displayStatic.id}`, displayStatic, {observe: 'response'});
    }


}
