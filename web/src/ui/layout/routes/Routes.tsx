import React from 'react';
import { Route, Switch } from 'react-router';

import Activate from '@/ui/account/Activate';
import ResetPassword from '@/ui/account/ResetPassword';
import ResetPasswordRequest from '@/ui/account/ResetPasswordRequest';
import SignIn from '@/ui/account/SignIn';
import MemberRevenueReport from '@/ui/app/commission/reports/memberRevenue/MemberRevenueReport';
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
import PolicyList from '@/ui/app/member/policy/PolicyList';

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
        {/* MEMBER ------------------------------------------------------------------------------- */}
        <SecureRoute exact path="/" component={MemberList} />
        <SecureRoute exact path="/member" component={MemberList} />
        <SecureRoute exact path="/member/members" component={MemberList} />
        <SecureRoute exact path="/member/policies" component={PolicyList} />
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
            path="/commission/reports/revenueMember"
            component={MemberRevenueReport}
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
