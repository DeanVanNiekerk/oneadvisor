// @flow

import React from 'react';
import { Switch } from 'react-router';
import { SecureRoute } from '@okta/okta-react';

import UserList from '@/ui/app/directory/user/UserList';
import NewUser from '@/ui/app/directory/user/NewUser';
import EditUser from '@/ui/app/directory/user/EditUser';

import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import NewOrganisation from '@/ui/app/directory/organisation/NewOrganisation';
import EditOrganisation from '@/ui/app/directory/organisation/EditOrganisation';

const DirectoryRoutes = () => (
    <Switch>
        <SecureRoute exact path="/directory" component={UserList} />

        <SecureRoute exact path="/directory/users" component={UserList} />
        <SecureRoute exact path="/directory/users/new" component={NewUser} />
        <SecureRoute exact path="/directory/users/:userId" component={EditUser} />

        <SecureRoute exact path="/directory/organisations" component={OrganisationList} />
        <SecureRoute exact path="/directory/organisations/new" component={NewOrganisation} />
        <SecureRoute exact path="/directory/organisations/:organisationId" component={EditOrganisation} />
    </Switch>
);

export default DirectoryRoutes;
