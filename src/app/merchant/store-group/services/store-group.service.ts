import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreGroup as ComponentEntity } from '../entities/store-group.entity';
import { Store } from 'src/app/merchant/store/entities/store.entity';

const COMPONENT_URL = 'store-groups/';

@Injectable({
  providedIn: 'root',
})
export class StoreGroupService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      {
        observe: 'response',
      }
    );
  }

  list(): Observable<HttpResponse<ListResponse<ComponentEntity>>> {
    return this.http.get<ListResponse<ComponentEntity>>(
      this.baseURL + COMPONENT_URL,
      {
        observe: 'response',
      }
    );
  }

  create(data: ComponentEntity): Observable<HttpResponse<ComponentEntity>> {
    return this.http.post<ComponentEntity>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  update(
    data: ComponentEntity,
    pk: string
  ): Observable<HttpResponse<ComponentEntity>> {
    return this.http.put<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  partial_update(
    data: ComponentEntity,
    pk: string
  ): Observable<HttpResponse<ComponentEntity>> {
    return this.http.patch<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  delete(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.delete<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      {
        observe: 'response',
      }
    );
  }

  listStoreGroupsByMerchant(
    merchantId: string = 'me'
  ): Observable<HttpResponse<ComponentEntity[]>> {
    return this.http.get<ComponentEntity[]>(
      `${this.baseURL}${COMPONENT_URL}list-storegroups-merchant/`,
      {
        params: { merchant_id: merchantId },
        observe: 'response',
      }
    );
  }
}
