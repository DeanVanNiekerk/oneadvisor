import React from 'react';
import { Switch, Route } from 'react-router';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import config from 'config/config';
import UserList from 'ui/user/list/UserList';
import Layout from 'ui/layout/Layout';

export default () => (
  <Security
    issuer={config.oidc.issuer}
    client_id={config.oidc.clientId}
    redirect_uri={config.oidc.redirectUri}>

    <Switch>

      <Route path="/implicit/callback" component={ImplicitCallback} />

      <Layout>
        <SecureRoute exact path='/' component={UserList} />
        <SecureRoute exact path='/users' component={UserList} />
      </Layout>

    </Switch>

  </Security>
);
