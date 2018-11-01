// @flow

import React from 'react';
import { Switch, Route } from 'react-router';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import config from 'config/config';
import Authentication from './Authentication';

//Directory
import UserList from 'ui/app/directory/user/UserList';

const App = () => (
  <Security 
    issuer={config.oidc.issuer}
    client_id={config.oidc.clientId}
    redirect_uri={config.oidc.redirectUri}>

    <Switch>

      <Route path="/implicit/callback" component={ImplicitCallback} />

      <Authentication>
    
        <SecureRoute exact path='/' component={UserList} />

        <SecureRoute exact path='/directory' component={UserList} />
        <SecureRoute exact path='/directory/users' component={UserList} />

      </Authentication>

    </Switch>

  </Security>
);

export default App;
