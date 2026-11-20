import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionService} from './session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private session: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service.


    const authToken = `Bearer ${this.session.token}`;

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = !request.url.includes('assets/simulador.js') ? request.clone({
      headers: request.headers.set('Authorization', authToken)
    }) : request;

    return next.handle(authReq);
  }
}
