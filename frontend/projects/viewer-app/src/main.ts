import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular-ivy';
import { Integrations } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import gitVersionInfo from '../../../git-version.json';

const sentryConfig = environment.sentry as (null | {
  dsn: string;
});

if (sentryConfig) {
  Sentry.init({
    dsn: sentryConfig?.dsn,
    environment: window.location.hostname,
    release: 'viewer@' + gitVersionInfo.InformationalVersion,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['localhost', window.location.origin],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.3,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
