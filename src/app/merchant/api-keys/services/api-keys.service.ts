import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MerchantApiKey, CreateKeyRequest } from '../entities/api-keys.entity';

const COMPONENT_URL = 'merchant-keys/';

export interface LinkedMerchantCreditOptions {
  id: string;
  name: string;
  document: string;
  url?: string;
  is_active?: boolean;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MerchantApiKeysService {
  private baseURL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Lista todas as chaves do merchant
  list(): Observable<HttpResponse<ListResponse<MerchantApiKey>>> {
    return this.http.get<ListResponse<MerchantApiKey>>(
      this.baseURL + COMPONENT_URL,
      {
        observe: 'response',
      }
    );
  }

  // Cria uma nova chave
  create(data: CreateKeyRequest): Observable<HttpResponse<MerchantApiKey>> {
    return this.http.post<MerchantApiKey>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  // Revoga uma chave existente
  revoke(keyId: string): Observable<HttpResponse<void>> {
    return this.http.patch<void>(
      `${this.baseURL}${COMPONENT_URL}${keyId}/`,
      { status: 'revoked' },
      { observe: 'response' }
    );
  }

  // "Deleta" (revoga) uma chave
  delete(keyId: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.baseURL}${COMPONENT_URL}${keyId}/`, {
      observe: 'response',
    });
  }

  // Toggle status (active/inactive) of a key
  toggleStatus(keyId: string): Observable<HttpResponse<void>> {
    return this.http.patch<void>(
      `${this.baseURL}${COMPONENT_URL}${keyId}/toggle/`,
      {},
      { observe: 'response' }
    );
  }
}
