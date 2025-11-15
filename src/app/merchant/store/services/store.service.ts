import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../entities/store.entity';

const COMPONENT_URL = 'stores/';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get(pk: string): Observable<HttpResponse<Store>> {
    return this.http.get<Store>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  list(): Observable<HttpResponse<ListResponse<Store>>> {
    return this.http.get<ListResponse<Store>>(this.baseURL + COMPONENT_URL, {
      observe: 'response',
    });
  }

  create(data: Store): Observable<HttpResponse<Store>> {
    return this.http.post<Store>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  update(data: Store, pk: string): Observable<HttpResponse<Store>> {
    return this.http.put<Store>(this.baseURL + COMPONENT_URL + pk + '/', data, {
      observe: 'response',
    });
  }

  partial_update(data: Store, pk: string): Observable<HttpResponse<Store>> {
    return this.http.patch<Store>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  delete(pk: string): Observable<HttpResponse<Store>> {
    return this.http.delete<Store>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  addFile(storesFile: FormData): Observable<HttpResponse<Store>> {
    return this.http.post<Store>(
      this.baseURL + COMPONENT_URL + 'create_using_file/',
      storesFile,
      { observe: 'response' }
    );
  }
}
