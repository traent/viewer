const urls = {
  backend: '{{IDENTITY_STUB_URL}}',
  orn: '{{DEFAULT_ORGNODE_STUB_URL}}',
  era: '{{ORGAPP_STUB_URL}}',
  admin: '{{T3ADMINAPP_STUB_URL}}',
  id: '{{T3APP_STUB_URL}}',
  viewer: '{{VIEWER_STUB_URL}}',
};

const privacyPolicyLedgerUrl = 'https://traent-dev-pages.s3.amazonaws.com/TermsOfService.ledger';
const privacyPolicyDocumentName = 'PrivacyPolicy';
const termsAndConditionsDocumentName = 'TermsAndConditions';

export const environment = {
  production: true,
  urls,
  companyName: 'Traent',
  enableAnalytics: true,
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
  sentry: {
    dsn: 'https://9e7189164643437f933fe92262ebcb0e@o936212.ingest.sentry.io/6457328',
  },
  t3ApiUrl: urls.backend,
  t3ApiVersion: 'v0',
  termsAndConditionsUrl: `${urls.viewer}/?ledgerUrl=${privacyPolicyLedgerUrl}&documentName=${termsAndConditionsDocumentName}`,
};
