import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutoReloadCampaignCredit as Component } from '../entities/auto-reload-campaign-credit.entity';

const COMPONENT_URL = 'auto-reload-campaign-credits/';

@Injectable({
  providedIn: 'root',
})
export class AutoReloadCampaignCreditService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get(pk: string): Observable<HttpResponse<Component>> {
    return this.http.get<Component>(this.baseURL + COMPONENT_URL + pk + '/', {
      observe: 'response',
    });
  }

  partial_update(
    data: Component,
    pk: string
  ): Observable<HttpResponse<Component>> {
    return this.http.patch<Component>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }
}
