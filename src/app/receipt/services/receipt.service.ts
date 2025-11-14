import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Receipt as ComponentEntity } from '../entities/receipt.entity';
import { Receipt_In } from '../entities/receipt.entity';
import { uuid } from 'uuidv4';

const COMPONENT_URL = 'receipts/';
const COMPONENT_BY_INFLUENCER_DOCUMENT_URL = 'get_receipts_by_influencer/';
const COMPONENT_BY_CONSUMER_DOCUMENT_URL = 'get_receipts_by_consumer/';
const COMPONENT_SEARCH_URL = 'search_receipt/';
const COMPONENT_GRAPH_SELL_BY_DAY_URL = 'graph_receipts_sell_by_day/';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
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

  create(data: ComponentEntity): Observable<HttpResponse<Receipt_In>> {
    return this.http.post<ComponentEntity>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  get_receipts_by_consumer(
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
  get_receipts_by_influencer(
    pk: string
  ): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL +
        COMPONENT_URL +
        pk +
        '/' +
        COMPONENT_BY_INFLUENCER_DOCUMENT_URL,
      {
        observe: 'response',
      }
    );
  }
  search(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/' + COMPONENT_SEARCH_URL,
      {
        observe: 'response',
      }
    );
  }

  graph_receipts_sell_by_day(): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(
      this.baseURL + COMPONENT_URL + COMPONENT_GRAPH_SELL_BY_DAY_URL,
      {
        observe: 'response',
      }
    );
  }
}
