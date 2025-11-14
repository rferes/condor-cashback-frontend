import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RedComission as ComponentEntity } from '../entities/red-comission.entity';
import { Transaction } from 'src/app/payment/transaction/entities/transaction.entity';

const COMPONENT_URL = 'red-comissions/';
const WITHDRAW_URL = 'withdraw/';

@Injectable({
  providedIn: 'root',
})
export class RedComissionService {
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

  listProvisioned(): Observable<HttpResponse<ListResponse<ComponentEntity>>> {
    return this.http.get<ListResponse<ComponentEntity>>(
      this.baseURL + COMPONENT_URL + '?status=PROVISIONED',
      {
        observe: 'response',
      }
    );
  }

  withdraw(payload: any): Observable<HttpResponse<Transaction>> {
    return this.http.post<Transaction>(
      this.baseURL + COMPONENT_URL + WITHDRAW_URL,
      payload,
      {
        observe: 'response',
      }
    );
  }
}
