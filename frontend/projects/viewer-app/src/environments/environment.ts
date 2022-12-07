// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const urls = {
  backend: 'https://backend.e4s1.net:5001',
  orn: 'https://orn.e4s1.net:4001',
  era: 'https://era.e4s1.net:4500',
  admin: 'https://admin.e4s1.net:4300',
  id: 'https://id.e4s1.net:4400',
  viewer: 'https://viewer.e4s1.net:4600',
};

const privacyPolicyLedgerUrl = 'https://traent-dev-pages.s3.amazonaws.com/TermsOfService.ledger';
const privacyPolicyDocumentName = 'PrivacyPolicy';
const termsAndConditionsDocumentName = 'TermsAndConditions';

export const environment = {
  production: false,
  urls,
  companyName: 'Traent',
  enableAnalytics: false,
  oidc: {
    authority: urls.backend,
    client_id: 'viewer-app',
    redirect_uri: `${urls.viewer}/assets/html/login-response.html`,
    post_logout_redirect_uri: urls.viewer,
    response_type: 'code',
    scope: 'openid email profile roles offline_access',
    extraQueryParams: {
      audience: 'backend',
    },
  },
  privacyPolicyUrl: `${urls.viewer}/?ledgerUrl=${privacyPolicyLedgerUrl}&documentName=${privacyPolicyDocumentName}`,
  sentry: null,
  t3ApiUrl: urls.backend,
  t3ApiVersion: 'v0',
  termsAndConditionsUrl: `${urls.viewer}/?ledgerUrl=${privacyPolicyLedgerUrl}&documentName=${termsAndConditionsDocumentName}`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
