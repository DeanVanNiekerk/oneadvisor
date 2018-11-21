// @flow

import React from 'react';
import { Route } from 'react-router';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import config from '@/config/config';
import Authentication from './Authentication';

import UserList from '@/ui/app/directory/user/UserList';

//Routes
import DirectoryRoutes from './routes/DirectoryRoutes';

const App = () => (
    <Security
        issuer={config.oidc.issuer}
        client_id={config.oidc.clientId}
        redirect_uri={config.oidc.redirectUri}
    >
        <Route path="/implicit/callback" component={ImplicitCallback} />

        <Authentication>
            <SecureRoute exact path="/" component={UserList} />
            <DirectoryRoutes />
        </Authentication>
    </Security>
);

export default App;
