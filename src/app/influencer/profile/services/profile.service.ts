import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Influencer as ComponentEntity } from '../entities/profile.entity';
import { DashboardInfluencer } from '../../dashboard/entities/dashboard.entity';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';

const COMPONENT_URL = 'influencers/';
const DASHBOARD_URL = 'dashboard_data/';
const INFLUENCER_BY_URL = 'influencerByUrl/';
const INFLUENCER_BY_EMAIL = 'inviteInfluencerByEmail/';

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

  getByUrl(url: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + url + '/' + INFLUENCER_BY_URL,
      {
        observe: 'response',
      }
    );
  }

  list(params?: any): Observable<HttpResponse<ListResponse<ComponentEntity>>> {
    return this.http.get<ListResponse<ComponentEntity>>(
      this.baseURL + COMPONENT_URL,
      {
        observe: 'response',
        params: params,
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

  inviteInfluencerByEmail(payload: any): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      this.baseURL + COMPONENT_URL + INFLUENCER_BY_EMAIL,
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

  dashboard_data(pk: string): Observable<HttpResponse<DashboardInfluencer>> {
    return this.http.get<DashboardInfluencer>(
      this.baseURL + COMPONENT_URL + pk + '/' + DASHBOARD_URL,
      {
        observe: 'response',
      }
    );
  }
  merchant_partnership_list(): Observable<HttpResponse<Merchant[]>> {
    return this.http.get<Merchant[]>(
      this.baseURL + COMPONENT_URL + 'merchant_partnership_list/',
      {
        observe: 'response',
      }
    );
  }
}
