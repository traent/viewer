const urls = {
  backend: 'https://id-service.traent.com',
  era: 'https://era.traent.com',
  id: 'https://id.traent.com',
  viewer: 'https://viewer.traent.com',
};

const privacyPolicyLedgerUrl = 'https://traent-dev-pages.s3.amazonaws.com/TermsOfService.ledger';
const privacyPolicyDocumentName = 'PrivacyPolicy';
const termsAndConditionsDocumentName = 'TermsAndConditions';

export const environment = {
  production: true,
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
