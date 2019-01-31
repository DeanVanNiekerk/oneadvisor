import React from 'react';
import { Route, Switch } from 'react-router';

import config from '@/config/config';
import MemberList from '@/ui/app/member/member/MemberList';
import { ImplicitCallback, SecureRoute, Security } from '@okta/okta-react';

import Authentication from './Authentication';
import CommissionRoutes from './routes/CommissionRoutes';
//Routes
import DirectoryRoutes from './routes/DirectoryRoutes';
import MemberRoutes from './routes/MemberRoutes';

const App = () => (
    <Security
        issuer={config.oidc.issuer}
        client_id={config.oidc.clientId}
        redirect_uri={config.oidc.redirectUri}
    >
        <Switch>
            <Route path="/implicit/callback" component={ImplicitCallback} />

            <Authentication>
                <SecureRoute exact path="/" component={MemberList} />
                <DirectoryRoutes />
                <MemberRoutes />
                <CommissionRoutes />
            </Authentication>
        </Switch>
    </Security>
);

export default App;
