import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { SendEmailVerifyResponse } from '../entities/email.entity';

const Email_VERIFY_URL = 'verification/emailSendVerificationCode/';
//const Email_VERIFY_CHECK_URL = 'verification/emailCheckVerificationCode/';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseURL: string = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  sendEmailVerify(
    payload: any
  ): Observable<HttpResponse<SendEmailVerifyResponse>> {
    return this.http.post<SendEmailVerifyResponse>(
      this.baseURL + Email_VERIFY_URL,
      payload,
      { observe: 'response' }
    );
  }
}
