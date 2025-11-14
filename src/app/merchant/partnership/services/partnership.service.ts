import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Partnership as ComponentEntity } from '../entities/partnership.entity';

const COMPONENT_URL = 'merchant-partnerships/';

export interface LinkedMerchantCreditOptions {
  id: string;
  name: string;
  city: string;
  type: string;
  partnership_date: Date;
  total_value: number;
  cashback_value: number;
  quantity_receipts: number;
}

@Injectable({
  providedIn: 'root',
})
export class MerchantPartnershipService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  list_hosts(): Observable<HttpResponse<ComponentEntity[]>> {
    return this.http.get<ComponentEntity[]>(
      this.baseURL + COMPONENT_URL + 'list_hosts/',
      {
        observe: 'response',
      }
    );
  }

  list_guests(): Observable<HttpResponse<ComponentEntity[]>> {
    return this.http.get<ComponentEntity[]>(
      this.baseURL + COMPONENT_URL + 'list_guests/',
      {
        observe: 'response',
      }
    );
  }

  create(data: {
    document: string;
  }): Observable<HttpResponse<ComponentEntity>> {
    return this.http.post<ComponentEntity>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  partial_update(
    data: Partial<ComponentEntity>,
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

  delete(pk: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  list_linked_merchant_credits(): Observable<
    HttpResponse<LinkedMerchantCreditOptions[]>
  > {
    return this.http.get<LinkedMerchantCreditOptions[]>(
      this.baseURL + COMPONENT_URL + 'list_linked_credits_partnerships/',
      {
        observe: 'response',
      }
    );
  }

  get_partnership_guest_data(pk: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      this.baseURL + COMPONENT_URL + pk + '/get_partnership_guest_data/',
      {
        observe: 'response',
      }
    );
  }

  get_partnership_host_data(pk: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      this.baseURL + COMPONENT_URL + pk + '/get_partnership_host_data/',
      { observe: 'response' }
    );
  }
}
