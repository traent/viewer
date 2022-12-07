enum Env {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  gkops,
  ci,
}

// Select a different environment based on the current browser location.
// This allows to pick the correct backend urls when in CI or deployed to Gkops.
let env = Env.gkops;
if (window.location.host.includes('e4s1.net')) {
  env = Env.ci;
}


const gkopsPattern = /^(https?:\/\/)[^/]*(-[a-f0-9]{40}\..*$)/;

const urls = {
  [Env.gkops]: {
    app: window.location.origin,
    backend: 'https://traent-backend.gkops.net',
    orn: 'https://traent-orn.gkops.net',
    era: window.location.origin.replace(gkopsPattern, '$1era$2'),
    admin: window.location.origin.replace(gkopsPattern, '$1admin$2'),
    id: window.location.origin.replace(gkopsPattern, '$1id$2'),
    viewer: window.location.origin.replace(gkopsPattern, '$1viewer$2'),
    sentry: null,
  },
  [Env.ci]: {
    app: window.location.origin,
    backend: 'http://backend.e4s1.net:5000',
    orn: 'http://orn.e4s1.net:4000',
    era: 'http://era.e4s1.net:4500',
    admin: 'http://admin.e4s1.net:4300',
    id: 'http://id.e4s1.net:4400',
    viewer: 'http://viewer.e4s1.net:4600',
    sentry: null,
  },
}[env];

const privacyPolicyLedgerUrl = 'https://traent-dev-pages.s3.amazonaws.com/TermsOfService.ledger';
const privacyPolicyDocumentName = 'PrivacyPolicy';
const termsAndConditionsDocumentName = 'TermsAndConditions';

export const environment = {
  dynamicEndpoints: true,
  production: true,
  urls,
  companyName: 'Traent',
  enableAnalytics: false,
  oidc: {
    authority: urls.backend,
    client_id: 'viewer-app',
    redirect_uri: `${urls.app}/assets/html/login-response.html`,
    post_logout_redirect_uri: urls.viewer,
    response_type: 'code',
    scope: 'openid email profile roles offline_access',
    extraQueryParams: {
      audience: 'backend',
    },
  },
  privacyPolicyUrl: `${urls.viewer}/?ledgerUrl=${privacyPolicyLedgerUrl}&documentName=${privacyPolicyDocumentName}`,
  sentry: urls.sentry,
  t3ApiUrl: urls.backend,
  t3ApiVersion: 'v0',
  termsAndConditionsUrl: `${urls.viewer}/?ledgerUrl=${privacyPolicyLedgerUrl}&documentName=${termsAndConditionsDocumentName}`,
};
