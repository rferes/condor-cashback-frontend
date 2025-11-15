import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wallet as Component } from '../entities/wallet.entity';
import { Wallet_expiron_soon } from '../entities/wallet.entity';

const COMPONENT_URL = 'wallet/';
const EXPIRING_SOON_URL = 'campaign_credits_expiring_soon/';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
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

  campaign_credits_expiring_soon(): Observable<
    HttpResponse<Wallet_expiron_soon>
  > {
    return this.http.get<Wallet_expiron_soon>(
      this.baseURL + COMPONENT_URL + EXPIRING_SOON_URL,
      {
        observe: 'response',
      }
    );
  }
}
