import React from 'react';
import { Route, Switch } from 'react-router';

import SignIn from '@/ui/account/SignIn';
import StatementList from '@/ui/app/commission/statement/StatementList';
import StatementPreview from '@/ui/app/commission/statement/StatementPreview';
import CommissionStatementTemplateList from '@/ui/app/commission/template/TemplateList';
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

//withRouter() on SecureRoute is stuffing up the typing... check later, happening after package upgrade.

const Routes = () => (
    <Switch>
        {/* ACCOUNT ----------------------------------------------------------------------------- */}
        <Route exact path="/signin" component={SignIn} />
        {/* ------------------------------------------------------------------------------------- */}
        {/* MEMBER ------------------------------------------------------------------------------- */}
        //@ts-ignore
        <SecureRoute exact path="/" component={MemberList} />
        //@ts-ignore
        <SecureRoute exact path="/member" component={MemberList} />
        //@ts-ignore
        <SecureRoute exact path="/member/members" component={MemberList} />
        //@ts-ignore
        <SecureRoute exact path="/member/import" component={MemberImport} />
        //@ts-ignore
        <SecureRoute exact path="/member/export" component={MemberExport} />
        //@ts-ignore
        <SecureRoute
            exact
            path="/member/members/:memberId"
            component={MemberPreview}
        />
        {/* ------------------------------------------------------------------------------------- */}
        {/* COMMISSION -------------------------------------------------------------------------- */}
        //@ts-ignore
        <SecureRoute exact path="/commission" component={StatementList} />
        //@ts-ignore
        <SecureRoute
            exact
            path="/commission/statements"
            component={StatementList}
        />
        //@ts-ignore
        <SecureRoute
            exact
            path="/commission/statements/:commissionStatementId"
            component={StatementPreview}
        />
        //@ts-ignore
        <SecureRoute
            exact
            path="/commission/templates"
            component={CommissionStatementTemplateList}
        />
        {/* ------------------------------------------------------------------------------------- */}
        {/* DIRECTORY --------------------------------------------------------------------------- */}
        //@ts-ignore
        <SecureRoute exact path="/directory" component={UserList} />
        //@ts-ignore
        <SecureRoute exact path="/directory/users" component={UserList} />
        //@ts-ignore
        <SecureRoute
            exact
            path="/directory/organisations"
            component={OrganisationList}
        />
        //@ts-ignore
        <SecureRoute exact path="/directory/roles" component={RoleList} />
        //@ts-ignore
        <SecureRoute
            exact
            path="/directory/lookups/companies"
            component={CompanyList}
        />
        //@ts-ignore
        <SecureRoute
            exact
            path="/directory/lookups/commTypes"
            component={CommissionTypeList}
        />
        //@ts-ignore
        <SecureRoute
            exact
            path="/directory/audit/logs"
            component={AuditLogList}
        />
        {/* ------------------------------------------------------------------------------------- */}
    </Switch>
);

export default Routes;
