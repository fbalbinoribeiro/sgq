import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';

const timeoutMs = 30000;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthToken(request)).pipe(
      timeout(timeoutMs),
      catchError((error) => {
        if (
          error.status === HttpStatusCode.Unauthorized ||
          error.status === HttpStatusCode.InternalServerError
        ) {
          this.authService.signOut();
        }
        throw error;
      })
    );
  }

  addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authService.currentToken === null) {
      return request;
    }

    const token = this.authService.currentToken;
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
