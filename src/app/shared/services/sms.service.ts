import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import {
  SendSMSCodeVerifyResponse,
  SMSCodeCheckVerifyResponse,
} from '../entities/sms.entity';

const SMS_SEND_VERIFY_URL = 'verification/smsSendVerificationCode/';
const SMS_CHECK_VERIFY_URL = 'verification/smsCheckVerificationCode/';

@Injectable({
  providedIn: 'root',
})
export class SMSService {
  private baseURL: string = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  sendSMSVerify(
    payload: any
  ): Observable<HttpResponse<SendSMSCodeVerifyResponse>> {
    return this.http.post<SendSMSCodeVerifyResponse>(
      this.baseURL + SMS_SEND_VERIFY_URL,
      payload,
      { observe: 'response' }
    );
  }

  checkSMSVerify(
    payload: any
  ): Observable<HttpResponse<SMSCodeCheckVerifyResponse>> {
    return this.http.post<SMSCodeCheckVerifyResponse>(
      this.baseURL + SMS_CHECK_VERIFY_URL,
      payload,
      { observe: 'response' }
    );
  }
}
