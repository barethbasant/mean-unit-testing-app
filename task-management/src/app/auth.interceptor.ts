import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown | any>> {
    if (request.url.includes('/login') || request.url.includes('/register')) {
      return next.handle(request);
    }
    const token = localStorage.getItem(environment.accessTokenKey);

    return next.handle(
      token
        ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : request
    );
  }
}
