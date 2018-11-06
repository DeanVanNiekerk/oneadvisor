// @flow

import React from 'react';
import { Switch, Route } from 'react-router';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import config from 'config/config';
import Authentication from './Authentication';
import { theme } from 'ui/styles/theme';
import base from 'ui/styles/base.css';

//Directory
import UserList from 'ui/app/directory/user/UserList';

const App = () => (
    <Security
        issuer={config.oidc.issuer}
        client_id={config.oidc.clientId}
        redirect_uri={config.oidc.redirectUri}
    >
        <CssBaseline />

        <MuiThemeProvider theme={theme}>
            <Switch>
                <Route path="/implicit/callback" component={ImplicitCallback} />

                <Authentication>
                    <SecureRoute exact path="/" component={UserList} />

                    <SecureRoute exact path="/directory" component={UserList} />
                    <SecureRoute
                        exact
                        path="/directory/users"
                        component={UserList}
                    />
                </Authentication>
            </Switch>
        </MuiThemeProvider>
    </Security>
);

export default App;
