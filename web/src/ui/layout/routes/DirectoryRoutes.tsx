import React from 'react';
import { Switch } from 'react-router';

import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import UserList from '@/ui/app/directory/user/UserList';
import { SecureRoute } from '@okta/okta-react';



const DirectoryRoutes = () => (
    <Switch>
        <SecureRoute exact path="/directory" component={UserList} />

        <SecureRoute exact path="/directory/users" component={UserList} />
        <SecureRoute exact path="/directory/organisations" component={OrganisationList} />
    </Switch>
);

export default DirectoryRoutes;
