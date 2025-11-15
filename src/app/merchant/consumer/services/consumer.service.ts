import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consumer as ComponentEntity } from 'src/app/merchant/consumer/entities/consumer.entity';
import { Receipt } from 'src/app/receipt/entities/receipt.entity';

const COMPONENT_URL = 'consumers/';
const LASTS_CONSUMER_BY_RECEIPT_URL = 'get_lasts_new_consumers/';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
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

  get_by_cpf(cpf: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + 'get_by_cpf/',
      {
        params: new HttpParams().set('cpf', cpf),
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

  create(data: ComponentEntity): Observable<HttpResponse<ComponentEntity>> {
    return this.http.post<ComponentEntity>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  update(
    data: ComponentEntity,
    pk: string
  ): Observable<HttpResponse<ComponentEntity>> {
    return this.http.put<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      data,
      {
        observe: 'response',
      }
    );
  }

  partial_update(
    data: ComponentEntity,
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

  delete(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.delete<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      {
        observe: 'response',
      }
    );
  }

  get_lasts_new_consumers(): Observable<HttpResponse<[Receipt]>> {
    return this.http.get<[Receipt]>(
      this.baseURL + COMPONENT_URL + LASTS_CONSUMER_BY_RECEIPT_URL,
      {
        observe: 'response',
      }
    );
  }
}
