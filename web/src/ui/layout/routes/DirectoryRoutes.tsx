import React from 'react';
import { Switch } from 'react-router';

import CommissionTypeList from '@/ui/app/directory/lookup/commissionType/CommissionTypeList';
import CompanyList from '@/ui/app/directory/lookup/company/CompanyList';
import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import RoleList from '@/ui/app/directory/role/RoleList';
import UserList from '@/ui/app/directory/user/UserList';
import { SecureRoute } from '@okta/okta-react';
import AuditLogList from '@/ui/app/directory/audit/logs/AuditLogList';

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

        <SecureRoute
            exact
            path="/directory/lookups/companies"
            component={CompanyList}
        />
        <SecureRoute
            exact
            path="/directory/lookups/commTypes"
            component={CommissionTypeList}
        />
        <SecureRoute
            exact
            path="/directory/audit/logs"
            component={AuditLogList}
        />
    </Switch>
);

export default DirectoryRoutes;
