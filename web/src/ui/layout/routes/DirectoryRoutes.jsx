// @flow

import React from 'react';
import { SecureRoute } from '@okta/okta-react';

import UserList from '@/ui/app/directory/user/UserList';
import NewUser from '@/ui/app/directory/user/NewUser';
import EditUser from '@/ui/app/directory/user/EditUser';

const DirectoryRoutes = () => (
    <>
        <SecureRoute exact path="/directory" component={UserList} />
        <SecureRoute exact path="/directory/users" component={UserList} />
        <SecureRoute exact path="/directory/users/new" component={NewUser} />
        <SecureRoute exact path="/directory/users/:userId" component={EditUser} />
    </>
);

export default DirectoryRoutes;
