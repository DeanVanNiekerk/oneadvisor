import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
  client_id: '0oagr58c4ncsC9gr70h7',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/auth/callback`,
  response_type: 'token id_token',
  scope: 'openid profile',
  authority: 'https://dev-396180.oktapreview.com/oauth2/default',
  //silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  //automaticSilentRenew: true,
  //filterProtocolClaims: true,
  //loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;