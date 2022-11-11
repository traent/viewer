import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class ApiOauthInterceptor implements HttpInterceptor {
  constructor(private readonly oidcSecurityService: OidcSecurityService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * Any interceptor cannot base its requests on `OidcSecurityService.isAuthenticated$`
     * Issue reference: https://github.com/damienbod/angular-auth-oidc-client/issues/920#issuecomment-968935143
     */
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token) => {
        if (!token) {
          return next.handle(req);
        }

        const header = 'Bearer ' + token;
        const headers = req.headers.set('Authorization', header);
        const reqWithAuthentication = req.clone({ headers });

        return next.handle(reqWithAuthentication);
      }),
    );
  }
}
