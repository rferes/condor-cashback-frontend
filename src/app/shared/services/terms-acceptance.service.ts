import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TermsAcceptance } from '../entities/terms-acceptance.entity';
import { ListResponse } from '../entities/list-response.entity';
const COMPONENT_URL = 'terms/';

@Injectable({
  providedIn: 'root',
})
export class TermsAcceptanceService {
  private baseURL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(): Observable<HttpResponse<ListResponse<TermsAcceptance>>> {
    return this.http.get<ListResponse<TermsAcceptance>>(
      this.baseURL + COMPONENT_URL,
      {
        observe: 'response',
      }
    );
  }

  get(id: number): Observable<HttpResponse<TermsAcceptance>> {
    return this.http.get<TermsAcceptance>(
      `${this.baseURL}${COMPONENT_URL}${id}/`,
      {
        observe: 'response',
      }
    );
  }

  create(payload: {
    terms_version: string;
    acceptance_type:
      | 'consumer_terms'
      | 'privacy_policy'
      | 'merchant_terms'
      | 'influencer_terms';
  }): Observable<HttpResponse<TermsAcceptance>> {
    return this.http.post<TermsAcceptance>(
      this.baseURL + COMPONENT_URL,
      payload,
      {
        observe: 'response',
      }
    );
  }
}
