import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { SERVER_API_URL } from "../app.constants";
import { Amount } from "../model/amount.model";
import { Observable } from "rxjs";
import { createRequestOption } from "../utils/request.utils";
import { IPaging } from "../model/base-respone.model";

type EntityResponseType = HttpResponse<Amount>;
type EntityArrayResponseType = HttpResponse<Amount[]>;

interface PagingResponse {
  data: Amount[];
  paging: IPaging;
}

@Injectable({ providedIn: "root" })
export class AmountService {
  public resourceUrl = SERVER_API_URL + "/amount";

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<HttpResponse<PagingResponse>> {
    const options = createRequestOption(req);
    return this.http.get<PagingResponse>(`${this.resourceUrl}`, {
      params: options,
      observe: "response"
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Amount>(`${this.resourceUrl}/${id}`, {
      observe: "response"
    });
  }

  filterAll(filter?: any): Observable<EntityArrayResponseType> {
    if (filter == null) {
      filter = {};
    }
    return this.http.post<Amount[]>(`${this.resourceUrl}/filter`, filter, {
      observe: "response"
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
      { observe: "response" }
    );
  }

  create(amount: Amount): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, amount, {
      observe: "response"
    });
  }

  update(amount: Amount): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}/${amount.id}`, amount, {
      observe: "response"
    });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: "response"
    });
  }
}
