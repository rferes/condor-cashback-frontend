import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AddressByCEP,
  City,
  State,
} from 'src/app/shared/entities/address.entity';

const CITIES_URL = 'cities/';
const STATES_URL = 'states/';
const CITIES_PER_STATES_URL = '/get_city_by_state/';
const ADDRES_BY_CEP_URL = 'address/cep/';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseURL: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listCities(): Observable<ListResponse<City>> {
    return this.http.get<ListResponse<City>>(this.baseURL + CITIES_URL);
  }

  listStates(): Observable<ListResponse<State>> {
    return this.http.get<ListResponse<State>>(this.baseURL + STATES_URL);
  }

  listCitiesByState(states_id: number): Observable<City> {
    return this.http.get<City>(
      this.baseURL + CITIES_URL + states_id + CITIES_PER_STATES_URL
    );
  }

  getAddressByZipcode(zipcode: string): Observable<HttpResponse<AddressByCEP>> {
    return this.http.get<AddressByCEP>(
      this.baseURL + ADDRES_BY_CEP_URL + zipcode + '/',
      { observe: 'response' }
    );
  }
}
