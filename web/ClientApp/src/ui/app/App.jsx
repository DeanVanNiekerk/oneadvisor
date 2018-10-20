import React from 'react';
import { Switch, Route } from 'react-router';

import AppRoute from 'ui/app/AppRoute';
import Callback from 'ui/auth/Callback';
import UserList from 'ui/user/list/UserList';
import Login from 'ui/auth/Login';
import SilentRefresh from 'ui/auth/SilentRefresh';

export default () => (
  <Switch>

    <AppRoute exact path='/' component={UserList} />
    <AppRoute exact path='/users' component={UserList} />

    <Route exact path='/login' component={Login} />
    <Route exact path="/auth/callback" component={Callback} />
    <Route exact path="/auth/silentrefresh" component={SilentRefresh} />

  </Switch>
);
