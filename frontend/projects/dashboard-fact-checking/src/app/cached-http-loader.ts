import { HttpBackend, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { filter, map, Observable } from 'rxjs';

import cacheBusting from '../../i18n-cache-busting.json';
import { environment } from '../environments/environment';

export class CachedHttpLoader extends TranslateLoader {

  /** HttpBackend replace HttpClient to handle the circular dependency error
   * when TranslateService is injected on ErrorDetailsInterceptor.
   * workaround suggested on:
   * - https://github.com/ngx-translate/core/issues/1317#issuecomment-1087336042
   * */
  constructor(
    private readonly http: HttpBackend,
    private readonly prefix?: string,
    private readonly suffix?: string,
  ) {
    super();
  }

  getTranslation(lang: string): Observable<any> {
    let path = `${this.prefix}${lang}${this.suffix}`;
    if (environment.production) {
      path += `?v=${(cacheBusting as any)[lang]}`;
    }
    const httpRequest = new HttpRequest('GET', path);
    return this.http.handle(httpRequest).pipe(
      filter((httpEvent: HttpEvent<any>): httpEvent is HttpResponse<any> => httpEvent instanceof HttpResponse),
      map((httpResponse: HttpResponse<any>) => httpResponse.body),
    );
  }
}
