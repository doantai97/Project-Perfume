import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { SERVER_API_URL } from "../app.constants";
import { Fragrant } from "../model/fragrant.model";
import { Observable } from "rxjs";
import { createRequestOption } from "../utils/request.utils";
import { IPaging } from "../model/base-respone.model";

type EntityResponseType = HttpResponse<Fragrant>;
type EntityArrayResponseType = HttpResponse<Fragrant[]>;

interface PagingResponse {
  data: Fragrant[];
  paging: IPaging;
}

@Injectable({ providedIn: "root" })
export class FragrantService {
  public resourceUrl = SERVER_API_URL + "/fragrant";

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<HttpResponse<PagingResponse>> {
    const options = createRequestOption(req);
    return this.http.get<PagingResponse>(`${this.resourceUrl}`, {
      params: options,
      observe: "response"
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Fragrant>(`${this.resourceUrl}/${id}`, {
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

  filterAll(filter?: any): Observable<EntityArrayResponseType> {
    if (filter == null) {
      filter = {};
    }
    return this.http.post<Fragrant[]>(`${this.resourceUrl}/filter`, filter, {
      observe: "response"
    });
  }

  create(fragrant: Fragrant): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, fragrant, {
      observe: "response"
    });
  }

  update(fragrant: Fragrant): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}/${fragrant.id}`, fragrant, {
      observe: "response"
    });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: "response"
    });
  }
}
