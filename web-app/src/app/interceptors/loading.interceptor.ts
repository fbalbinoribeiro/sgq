import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from '../stores/app-state';
import { LoadingActions } from './loading.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store<AppState>) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.store.dispatch(LoadingActions.startLoading());
    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.store.dispatch(LoadingActions.stopLoading());
          }
        },
        error: () => {
          this.store.dispatch(LoadingActions.stopLoading());
        },
      })
    );
  }
}
