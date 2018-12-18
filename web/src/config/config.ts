export default {
    oidc: {
        clientId: __OIDC_CLIENT_ID__,
        issuer: __OIDC_ISSUER__,
        redirectUri: `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? `:${window.location.port}` : ''
        }/implicit/callback`
    },
    baseApi: __OA_BASE_API__,
    ui: {
        pageHeaderHeight: 48,
        footerHeight: 50,
        pageSize: 10
    }
};
