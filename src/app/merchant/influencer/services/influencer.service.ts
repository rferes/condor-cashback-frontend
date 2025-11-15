import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MerchantInfluencerFriendship as ComponentEntity } from 'src/app/shared/entities/merchant-influencer-friendship.entity';

const COMPONENT_URL = 'merchant-influencer-friendships/';

@Injectable({
  providedIn: 'root',
})
export class MerchantInfluencerFriendshipService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  list(): Observable<HttpResponse<ComponentEntity>> {
    return this.http.get<ComponentEntity>(this.baseURL + COMPONENT_URL, {
      observe: 'response',
    });
  }

  create(data: any): Observable<HttpResponse<ComponentEntity>> {
    return this.http.post<ComponentEntity>(this.baseURL + COMPONENT_URL, data, {
      observe: 'response',
    });
  }

  // partial_update(
  //   data: ComponentEntity,
  //   pk: string
  // ): Observable<HttpResponse<ComponentEntity>> {
  //   return this.http.patch<ComponentEntity>(
  //     this.baseURL + COMPONENT_URL + pk + '/',
  //     data,
  //     {
  //       observe: 'response',
  //     }
  //   );
  // }

  delete(pk: string): Observable<HttpResponse<ComponentEntity>> {
    return this.http.delete<ComponentEntity>(
      this.baseURL + COMPONENT_URL + pk + '/',
      {
        observe: 'response',
      }
    );
  }
}
