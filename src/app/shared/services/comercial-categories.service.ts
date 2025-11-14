// Angular imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse } from '../entities/list-response.entity';
import { Observable } from 'rxjs';

// Environment imports
import { environment } from '../../../environments/environment';

// ComponentEntity imports
import { ComercialCategory } from '../entities/comercial-category.entity';

const COMERCIAL_CATEGORIES_URL = 'comercial-categories/';

@Injectable({
  providedIn: 'root',
})
export class ComercialCategoryService {
  private baseURL: string = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  list(): Observable<HttpResponse<ListResponse<ComercialCategory>>> {
    return this.http.get<ListResponse<ComercialCategory>>(
      this.baseURL + COMERCIAL_CATEGORIES_URL,
      {
        observe: 'response',
      }
    );
  }
}
