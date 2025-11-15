import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coupon as ComponentEntity } from '../entities/coupon.entity';
import { uuid } from 'uuidv4';

const COMPONENT_URL = 'red-coupons/';
const COMPONENT_BY_INFLUENCER_DOCUMENT_URL = 'get_coupons_by_influencer/';
const COMPONENT_BY_CONSUMER_DOCUMENT_URL = 'get_coupons_by_consumer/';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
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

  get_coupons_by_consumer(
    pk: string
  ): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL +
        COMPONENT_URL +
        pk +
        '/' +
        COMPONENT_BY_CONSUMER_DOCUMENT_URL,
      {
        observe: 'response',
      }
    );
  }

  refund_coupon(pk: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(
      `${this.baseURL}${COMPONENT_URL}${pk}/refund_coupon/`,
      {},
      {
        observe: 'response',
      }
    );
  }
}
