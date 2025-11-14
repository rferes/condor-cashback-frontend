// Angular imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';

// RxJS imports
import { Observable, interval, firstValueFrom } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

// Application imports
import { environment } from '../../../../environments/environment';

// Type imports
import { LoginResponse } from '../entities/login.entity';

const INTERVALO = interval(3600000);
const REFRESH_TOKEN_URL = 'token/refresh/';
const LOGIN_URL = 'users/login_account/';
const LOGOUT_FORGET_DEVICE_URL = 'users/logout_device/';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseURL: string = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {
    INTERVALO.pipe(timeInterval()).subscribe(
      async () => await this.refreshToken()
    );
  }

  // Login
  login(payload: any): Observable<HttpResponse<LoginResponse>> {
    // Garante que o cookie do dispositivo existe
    this.setDeviceCookie();

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<LoginResponse>(this.baseURL + LOGIN_URL, payload, {
      headers: headers,
      withCredentials: true,
      observe: 'response',
    });
  }

  logoutForgetDevice(): Observable<any> {
    return this.http.post(
      this.baseURL + LOGOUT_FORGET_DEVICE_URL,
      {},
      {
        withCredentials: true,
      }
    );
  }

  // Token Refresh
  async refreshToken(): Promise<void> {
    const accessToken = this.getToken('accessToken');
    const refreshToken = this.getToken('refreshToken');

    if (refreshToken && accessToken) {
      try {
        const response: any = await firstValueFrom<any>(
          this.http.post(this.baseURL + REFRESH_TOKEN_URL, {
            refresh: refreshToken,
          })
        );
        if (response && response.access) {
          this.setToken('accessToken', response.access);
        }
      } catch (error: any) {
        this.handleError(error);
      }
    } else {
      this.clearTokens();
    }
  }

  getToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  setToken(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('type');
  }

  handleError(error: HttpErrorResponse): void {
    if (error.error && error.error.code) {
      if (error.error.code === 'token_not_valid') {
        this.clearTokens();
        this.router.navigate(['login']);
      }
    }
  }

  // Função para definir o cookie do dispositivo
  private setDeviceCookie() {
    // Gera um token único se não existir
    if (!this.getCookie('trusted_device')) {
      const deviceToken = this.generateDeviceToken();
      document.cookie = `trusted_device=${deviceToken}; path=/; max-age=2592000`; // 30 dias
    }
  }

  // Função para gerar token único
  private generateDeviceToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Função para ler cookie
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}
