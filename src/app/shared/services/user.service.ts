// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

// RxJS imports
import { Observable } from 'rxjs';

// Environment imports
import { environment } from '../../../environments/environment';

// Entities imports
import {
  User,
  UserCreateResponse,
  CheckDocumentResponse,
  UserChangeEmailResponse,
  UserChangePasswordResponse,
  UserChangeCellphoneResponse,
} from '../entities/user.entity';

const USER_URL = 'users/';
const USER_CHECK_DOCUMENT_URL = 'users/validate_document/';
const USER_FORGOT_PASSWORD_URL = 'users/change_password/';
const USER_CHANGE_EMAIL_URL = 'users/change_email/';
const USER_CHANGE_CELLPHONE_URL = 'users/change_cellphone/';
const USER_CHANGE_CELLPHONE_STEP1_URL = 'users/change_cellphone_step1/';
const USER_CHANGE_CELLPHONE_STEP2_URL = 'users/change_cellphone_step2/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseURL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkDocument(payload: any): Observable<HttpResponse<CheckDocumentResponse>> {
    return this.http.post<CheckDocumentResponse>(
      this.baseURL + USER_CHECK_DOCUMENT_URL,
      payload,
      { observe: 'response' }
    );
  }

  get(): Observable<User> {
    return this.http.get<User>(this.baseURL + USER_URL + 'me/');
  }

  create(payload: any): Observable<HttpResponse<UserCreateResponse>> {
    return this.http.post<UserCreateResponse>(
      this.baseURL + USER_URL,
      payload,
      { observe: 'response' }
    );
  }

  partialUpdate(payload: any): Observable<HttpResponse<User>> {
    return this.http.patch<User>(this.baseURL + USER_URL + 'me/', payload, {
      observe: 'response',
    });
  }

  changeEmail(payload: any): Observable<HttpResponse<UserChangeEmailResponse>> {
    return this.http.post<UserChangeEmailResponse>(
      this.baseURL + USER_CHANGE_EMAIL_URL,
      payload,
      { observe: 'response' }
    );
  }

  forgotPassword(
    payload: any
  ): Observable<HttpResponse<UserChangePasswordResponse>> {
    return this.http.post<UserChangePasswordResponse>(
      this.baseURL + USER_FORGOT_PASSWORD_URL,
      payload,
      { observe: 'response' }
    );
  }

  changeCellphone(
    payload: any
  ): Observable<HttpResponse<UserChangeCellphoneResponse>> {
    return this.http.post<UserChangeCellphoneResponse>(
      this.baseURL + USER_CHANGE_CELLPHONE_URL,
      payload,
      { observe: 'response' }
    );
  }

  changeCellphoneStep1(payload: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.baseURL + USER_CHANGE_CELLPHONE_STEP1_URL,
      payload,
      { observe: 'response' }
    );
  }

  changeCellphoneStep2(
    payload: any
  ): Observable<HttpResponse<UserChangeCellphoneResponse>> {
    return this.http.post<UserChangeCellphoneResponse>(
      this.baseURL + USER_CHANGE_CELLPHONE_STEP2_URL,
      payload,
      { observe: 'response' }
    );
  }
}
