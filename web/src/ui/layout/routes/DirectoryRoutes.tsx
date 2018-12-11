import React from 'react';
import { Switch } from 'react-router';

import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import RoleList from '@/ui/app/directory/role/RoleList';
import UserList from '@/ui/app/directory/user/UserList';
import { SecureRoute } from '@okta/okta-react';

const DirectoryRoutes = () => (
    <Switch>
        <SecureRoute exact path="/directory" component={UserList} />

        <SecureRoute exact path="/directory/users" component={UserList} />
        <SecureRoute
            exact
            path="/directory/organisations"
            component={OrganisationList}
        />
        <SecureRoute exact path="/directory/roles" component={RoleList} />
    </Switch>
);

export default DirectoryRoutes;
