import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('accessToken');
    const authReq = this.cloneRequestWithAuthHeader(req, authToken);

    return next
      .handle(authReq)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, req, next)
        )
      );
  }

  private cloneRequestWithAuthHeader(
    req: HttpRequest<any>,
    authToken: string | null
  ) {
    let clonedReq = req.clone();
    if (authToken) {
      clonedReq = clonedReq.clone({
        headers: clonedReq.headers.set('Authorization', `Bearer ${authToken}`),
      });
    }
    let userMode = localStorage.getItem('type');
    if (userMode) {
      userMode = userMode.replace(/"/g, '').toLowerCase();
      clonedReq = clonedReq.clone({
        headers: clonedReq.headers.set('User-Mode', userMode),
      });
    }
    return clonedReq;
  }

  private handleError(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (error.status === 401) {
      this.clearAuthData();
      const authReq = req.clone({
        headers: req.headers.delete('Authorization'),
      });
      this.router.navigate(['login']);
      return next.handle(authReq);
    } else if (error.status === 404) {
      console.log('404 error');
      return throwError(error);
    } else if (error.status === 405) {
      this.messageService.add({
        severity: 'error',
        summary: 'Metodo não permitido',
        detail: 'Esse usuário não está autorizado a realizar essa ação!',
        life: 4000,
      });
      return throwError(error);
    } else if (error.status === 500) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro Servidor',
        detail: 'Se o erro persistir, entre em contato com o suporte!',
        life: 4000,
      });
      return throwError(error);
    } else {
      return throwError(error);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
