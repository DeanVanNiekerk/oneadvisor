// @flow

export default {
  oidc: {
    clientId: "0oagr58c4ncsC9gr70h7",
    issuer: "https://dev-396180.oktapreview.com/oauth2/default",
    audience: "api://default",
    redirectUri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}/implicit/callback`,
    scope: "openid profile email"
  },
  baseApi: "https://localhost:6001"
};
