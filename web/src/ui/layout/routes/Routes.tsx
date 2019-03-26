import React from 'react';
import { Route, Switch } from 'react-router';

import Activate from '@/ui/account/Activate';
import ResetPassword from '@/ui/account/ResetPassword';
import ResetPasswordRequest from '@/ui/account/ResetPasswordRequest';
import SignIn from '@/ui/account/SignIn';
import ClientList from '@/ui/app/client/client/ClientList';
import ClientPreview from '@/ui/app/client/client/ClientPreview';
import ClientExport from '@/ui/app/client/export/ClientExport';
import ClientImport from '@/ui/app/client/import/ClientImport';
import PolicyList from '@/ui/app/client/policy/PolicyList';
import ClientRevenueReport from '@/ui/app/commission/reports/clientRevenue/ClientRevenueReport';
import StatementList from '@/ui/app/commission/statement/StatementList';
import StatementPreview from '@/ui/app/commission/statement/StatementPreview';
import CommissionStatementTemplateList from '@/ui/app/commission/template/TemplateList';
import AuditLogList from '@/ui/app/directory/audit/logs/AuditLogList';
import CommissionTypeList from '@/ui/app/directory/lookup/commissionType/CommissionTypeList';
import CompanyList from '@/ui/app/directory/lookup/company/CompanyList';
import OrganisationList from '@/ui/app/directory/organisation/OrganisationList';
import RoleList from '@/ui/app/directory/role/RoleList';
import UserList from '@/ui/app/directory/user/UserList';

import SecureRoute from '../SecureRoute';

const Routes = () => (
    <Switch>
        {/* ACCOUNT ----------------------------------------------------------------------------- */}
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/activate" component={Activate} />
        <Route
            exact
            path="/resetPasswordRequest"
            component={ResetPasswordRequest}
        />
        <Route exact path="/resetPassword" component={ResetPassword} />
        {/* ------------------------------------------------------------------------------------- */}
        {/* CLIENT ------------------------------------------------------------------------------- */}
        <SecureRoute exact path="/" component={ClientList} />
        <SecureRoute exact path="/client" component={ClientList} />
        <SecureRoute exact path="/client/clients" component={ClientList} />
        <SecureRoute exact path="/client/policies" component={PolicyList} />
        <SecureRoute exact path="/client/import" component={ClientImport} />
        <SecureRoute exact path="/client/export" component={ClientExport} />
        <SecureRoute
            exact
            path="/client/clients/:clientId"
            component={ClientPreview}
        />
        {/* ------------------------------------------------------------------------------------- */}
        {/* COMMISSION -------------------------------------------------------------------------- */}
        <SecureRoute exact path="/commission" component={StatementList} />
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
        <SecureRoute
            exact
            path="/commission/templates"
            component={CommissionStatementTemplateList}
        />
        <SecureRoute
            exact
            path="/commission/reports/revenueClient"
            component={ClientRevenueReport}
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
