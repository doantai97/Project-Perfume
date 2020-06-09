import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { SERVER_API_URL } from "../app.constants";
import { Observable } from "rxjs";
import { IPaging, Paging, ResponseMsg } from "../model/base-respone.model";
import { createRequestOption } from "../utils/request.utils";
import { Product } from "../model/product.model";

type EntityResponseType = HttpResponse<Product>;
type EntityArrayResponseType = HttpResponse<Product[]>;

interface PagingResponse {
  data: Product[];
  paging: Paging;
}

type PagingResponseType = HttpResponse<PagingResponse>;

@Injectable({ providedIn: "root" })
export class ProductService {
  public resourceUrl: string = SERVER_API_URL + "/product";

  constructor(private http: HttpClient) {}

  // findAll(): Observable<EntityArrayResponseType> {
  //     return this.http.get<Product[]>(`${SERVER_API_URL}/`, {observe: 'response'});
  // }

  query(req?: any): Observable<HttpResponse<PagingResponse>> {
    const options = createRequestOption(req);
    return this.http.get<PagingResponse>(`${this.resourceUrl}`, {
      params: options,
      observe: "response"
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Product>(`${this.resourceUrl}/id/${id}`, {
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
    return this.http.post<Product[]>(`${this.resourceUrl}/filter`, filter, {
      observe: "response"
    });
  }

  create(product: Product): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, product, {
      observe: "response"
    });
  }
  findByCode(code: string): Observable<HttpResponse<ResponseMsg>> {
    return this.http.get<ResponseMsg>(`${this.resourceUrl}/${code}`, {
      observe: "response"
    });
  }

  update(product: Product): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}/${product.id}`, product, {
      observe: "response"
    });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: "response"
    });
  }
}
