import React from 'react';
import { Route, Switch } from 'react-router';

import SignIn from '@/ui/account/SignIn';
import CommissionImport from '@/ui/app/commission/import/CommissionImport';
import StatementList from '@/ui/app/commission/statement/StatementList';
import StatementPreview from '@/ui/app/commission/statement/StatementPreview';
import AuditLogList from '@/ui/app/directory/audit/logs/AuditLogList';
import CommissionTypeList from '@/ui/app/directory/lookup/commissionType/CommissionTypeList';
import CompanyList from '@/ui/app/directory/lookup/company/CompanyList';
import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import RoleList from '@/ui/app/directory/role/RoleList';
import UserList from '@/ui/app/directory/user/UserList';
import MemberExport from '@/ui/app/member/export/MemberExport';
import MemberImport from '@/ui/app/member/import/MemberImport';
import MemberList from '@/ui/app/member/member/MemberList';
import MemberPreview from '@/ui/app/member/member/MemberPreview';

import SecureRoute from '../SecureRoute';

//TODO: review PrivateRoute: https://reacttraining.com/react-router/web/example/auth-workflow

const Routes = () => (
    <Switch>
        {/* ACCOUNT ----------------------------------------------------------------------------- */}
        <Route exact path="/signin" component={SignIn} />
        {/* ------------------------------------------------------------------------------------- */}

        {/* MEMBER ------------------------------------------------------------------------------- */}
        <SecureRoute exact path="/" component={MemberList} />
        <SecureRoute exact path="/member" component={MemberList} />
        <SecureRoute exact path="/member/members" component={MemberList} />
        <SecureRoute exact path="/member/import" component={MemberImport} />
        <SecureRoute exact path="/member/export" component={MemberExport} />
        <SecureRoute
            exact
            path="/member/members/:memberId"
            component={MemberPreview}
        />

        {/* ------------------------------------------------------------------------------------- */}

        {/* COMMISSION -------------------------------------------------------------------------- */}
        <SecureRoute exact path="/commission" component={StatementList} />
        <SecureRoute
            exact
            path="/commission/import"
            component={CommissionImport}
        />
        <SecureRoute
            exact
            path="/commission/statements"
            component={StatementList}
        />
        <SecureRoute
            exact
            path="/commission/statements/:commissionStatementId"
            component={StatementPreview}
        />
        {/* ------------------------------------------------------------------------------------- */}

        {/* DIRECTORY --------------------------------------------------------------------------- */}
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
        {/* ------------------------------------------------------------------------------------- */}
    </Switch>
);

export default Routes;
