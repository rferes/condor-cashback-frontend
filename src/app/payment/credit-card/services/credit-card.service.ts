import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreditCard as ComponentEntity } from '../entities/credit-card.entity';

const COMPONENT_URL = 'credit-cards/';
const MERCHANT_SESSION = 'merchant_session_cc/';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
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

  create(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  delete(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.delete<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      {
        observe: 'response',
      }
    );
  }

  create_session(): Observable<HttpResponse<ListResponse<ComponentEntity>>> {
    return this.http.get<ListResponse<ComponentEntity>>(
      this.baseURL + COMPONENT_URL + MERCHANT_SESSION,
      {
        observe: 'response',
      }
    );
  }
}
