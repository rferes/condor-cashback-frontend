import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Merchant as ComponentEntity } from '../entities/profile.entity';
import { DashboardMerchant } from '../../dashboard/entities/dashboard.entity';

const COMPONENT_URL = 'merchants/';
const DASHBOARD_URL = 'dashboard_data/';
const MERCHANT_BY_URL = 'merchantByUrl/';
const INVITE_BY_EMAIL_URL = 'inviteMerchantByEmail/';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
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

  create(payload: any): Observable<HttpResponse<ComponentEntity>> {
    return this.http.post<ComponentEntity>(
      this.baseURL + COMPONENT_URL,
      payload,
      {
        observe: 'response',
      }
    );
  }

  update(payload: any): Observable<HttpResponse<ComponentEntity>> {
    return this.http.patch<ComponentEntity>(
      this.baseURL + COMPONENT_URL + 'me/',
      payload,
      {
        observe: 'response',
      }
    );
  }

  getByUrl(url: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + url + '/' + MERCHANT_BY_URL,
      {
        observe: 'response',
      }
    );
  }

  dashboard_data(pk: string): Observable<HttpResponse<DashboardMerchant>> {
    return this.http.get<DashboardMerchant>(
      this.baseURL + COMPONENT_URL + pk + '/' + DASHBOARD_URL,
      {
        observe: 'response',
      }
    );
  }

  inviteMerchantByEmail(payload: any): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      this.baseURL + COMPONENT_URL + INVITE_BY_EMAIL_URL,
      payload,
      {
        observe: 'response',
      }
    );
  }
}
