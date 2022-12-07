import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiModule } from '@api/api.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxT3DialogModule } from '@traent/ngx-dialog';
import { NgxT3ToastModule } from '@traent/ngx-toast';
import { AuthModule } from 'angular-auth-oidc-client';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiOauthInterceptor } from './core/interceptors';
import { ServiceWorkerService } from './core/services/service-worker.service';
import { environment } from '../environments/environment';

const registerServiceWorkerFactory = (sws: ServiceWorkerService) => () => sws.init();

const icons = [
  // Icons registry
  ['ack-error', 'assets/@traent/design-system/icons/ack-error.svg'],
  ['ack-incomplete', 'assets/@traent/design-system/icons/ack-incomplete.svg'],
  ['ack-ok', 'assets/@traent/design-system/icons/ack-ok.svg'],
  ['agreements', 'assets/@traent/design-system/icons/agreements.svg'],
  ['checkbox', 'assets/@traent/design-system/icons/checkbox.svg'],
  ['code', 'assets/@traent/design-system/icons/code.svg'],
  ['document-remove', 'assets/@traent/design-system/icons/document-remove.svg'],
  ['document-upload', 'assets/@traent/design-system/icons/document-upload.svg'],
  ['download', 'assets/@traent/design-system/icons/download.svg'],
  ['iot', 'assets/@traent/design-system/icons/iot.svg'],
  ['project-log', 'assets/@traent/design-system/icons/project-log.svg'],
  ['projects', 'assets/@traent/design-system/icons/projects.svg'],
  ['stream-overview', 'assets/@traent/design-system/icons/stream-overview.svg'],
  ['things', 'assets/@traent/design-system/icons/things.svg'],
  ['thread-reference', 'assets/@traent/design-system/icons/thread-reference-icon.svg'],
  ['version-new', 'assets/@traent/design-system/icons/version-new.svg'],
  ['workflow', 'assets/@traent/design-system/icons/workflow.svg'],
];

const HttpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    ApiModule.forRoot({ rootUrl: `${environment.t3ApiUrl}/${environment.t3ApiVersion}` }),
    AuthModule.forRoot({
      config: {
        authority: environment.oidc.authority,
        autoUserInfo: false,
        clientId: environment.oidc.client_id,
        customParamsAuthRequest: environment.oidc.extraQueryParams,
        customParamsRefreshTokenRequest: environment.oidc.extraQueryParams,
        ignoreNonceAfterRefresh: true,
        postLogoutRedirectUri: environment.oidc.post_logout_redirect_uri,
        redirectUrl: environment.oidc.redirect_uri,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        responseType: environment.oidc.response_type,
        scope: environment.oidc.scope,
        silentRenew: true,
        triggerAuthorizationResultEvent: true,
        useRefreshToken: true,
      },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxT3ToastModule,
    NgxT3DialogModule, //todo: this should be removed (a task to investigate further has been created)
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: registerServiceWorkerFactory, multi: true, deps: [ServiceWorkerService] },
    { provide: HTTP_INTERCEPTORS, useClass: ApiOauthInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { scrollStrategy: new NoopScrollStrategy(), hasBackdrop: true } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    icons.forEach(([name, path]) => matIconRegistry.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(path)));
  }
}
