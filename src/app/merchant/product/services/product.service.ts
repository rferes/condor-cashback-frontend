import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../entities/product.entity';

const COMPONENT_URL = 'products/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get(pk: string): Observable<HttpResponse<Product>> {
    return this.http.get<Product>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  list(): Observable<HttpResponse<ListResponse<Product>>> {
    return this.http.get<ListResponse<Product>>(this.baseURL + COMPONENT_URL, {
      observe: 'response',
    });
  }

  create(data: Product): Observable<HttpResponse<Product>> {
    return this.http.post<Product>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  update(data: Product, pk: string): Observable<HttpResponse<Product>> {
    return this.http.put<Product>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  partial_update(data: Product, pk: string): Observable<HttpResponse<Product>> {
    return this.http.patch<Product>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  delete(pk: string): Observable<HttpResponse<Product>> {
    return this.http.delete<Product>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  addFile(storesFile: FormData): Observable<HttpResponse<Product>> {
    return this.http.post<Product>(
      this.baseURL + COMPONENT_URL + 'create_using_file/',
      storesFile,
      { observe: 'response' }
    );
  }
}
