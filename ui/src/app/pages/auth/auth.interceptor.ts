import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { authenticatedApiRoutes } from '../../utils/constants';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const authToken = this.auth.store.token;

    if (!authenticatedApiRoutes.some(route => environment.PK_API_URL + route === req.url)) {
      return next.handle(req);
    }

    if (!authToken) {
      throw new Error(
        '[AuthInterceptor]: Unauthenticated user is trying to access a restricted API route'
      );
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next.handle(authReq);
  }
}
