import React from "react";
import { Route, Switch } from "react-router";

import Activate from "@/ui/account/Activate";
import ResetPassword from "@/ui/account/ResetPassword";
import ResetPasswordRequest from "@/ui/account/ResetPasswordRequest";
import SignIn from "@/ui/account/SignIn";
import ClientList from "@/ui/app/client/client/list/ClientList";
import ClientPreview from "@/ui/app/client/client/preview/ClientPreview";
import ClientExport from "@/ui/app/client/export/ClientExport";
import ClientImport from "@/ui/app/client/import/ClientImport";
import PolicyProductList from "@/ui/app/client/lookup/policyProduct/PolicyProductList";
import PolicyProductTypeList from "@/ui/app/client/lookup/policyProductType/PolicyProductTypeList";
import PolicyList from "@/ui/app/client/policy/list/PolicyList";
import CommissionList from "@/ui/app/commission/commission/CommissionList";
import CommissionTypeList from "@/ui/app/commission/lookup/commissionType/CommissionTypeList";
import ClientRevenueReport from "@/ui/app/commission/reports/clientRevenue/ClientRevenueReport";
import CommissionLapseReport from "@/ui/app/commission/reports/commissionLapse/CommissionLapseReport";
import ProjectionsReport from "@/ui/app/commission/reports/projections/ProjectionsReport";
import UserMonthlyCommissionReport from "@/ui/app/commission/reports/userMonthlyCommission/UserMonthlyCommissionReport";
import SplitRulePolicyList from "@/ui/app/commission/splitRulePolicy/SplitRulePolicyList";
import StatementList from "@/ui/app/commission/statement/list/StatementList";
import StatementPreview from "@/ui/app/commission/statement/preview/StatementPreview";
import CommissionStatementTemplateList from "@/ui/app/commission/template/TemplateList";
import AuditLogList from "@/ui/app/directory/audit/logs/AuditLogList";
import ChangeLogList from "@/ui/app/directory/changeLogs/ChangeLogList";
import CompanyList from "@/ui/app/directory/lookup/company/CompanyList";
import OrganisationList from "@/ui/app/directory/organisation/OrganisationList";
import RoleList from "@/ui/app/directory/role/RoleList";
import UserList from "@/ui/app/directory/user/UserList";

import SecureRoute from "../SecureRoute";

const Routes: React.FC = () => (
    <Switch>
        {/* ACCOUNT ----------------------------------------------------------------------------- */}
        <Route exact path={["/signin", "/signin/admin"]} component={SignIn} />
        <Route exact path="/activate" component={Activate} />
        <Route exact path="/resetPasswordRequest" component={ResetPasswordRequest} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        {/* ------------------------------------------------------------------------------------- */}
        {/* CLIENT ------------------------------------------------------------------------------- */}
        <SecureRoute exact path="/" component={ClientList} />
        <SecureRoute exact path="/client" component={ClientList} />
        <SecureRoute exact path="/client/clients" component={ClientList} />
        <SecureRoute exact path="/client/policies" component={PolicyList} />
        <SecureRoute exact path="/client/import" component={ClientImport} />
        <SecureRoute exact path="/client/export" component={ClientExport} />
        <SecureRoute exact path="/client/clients/:clientId" component={ClientPreview} />
        <SecureRoute
            exact
            path="/client/lookups/policyProductTypes"
            component={PolicyProductTypeList}
        />
        <SecureRoute exact path="/client/lookups/policyProducts" component={PolicyProductList} />
        {/* ------------------------------------------------------------------------------------- */}
        {/* COMMISSION -------------------------------------------------------------------------- */}
        <SecureRoute exact path="/commission" component={StatementList} />
        <SecureRoute exact path="/commission/statements" component={StatementList} />
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
        <SecureRoute exact path="/commission/commissionEntries" component={CommissionList} />
        <SecureRoute
            exact
            path="/commission/commissionSplitRulePolicies"
            component={SplitRulePolicyList}
        />
        <SecureRoute
            exact
            path="/commission/reports/revenueClient"
            component={ClientRevenueReport}
        />
        <SecureRoute
            exact
            path="/commission/reports/userMonthlyCommission"
            component={UserMonthlyCommissionReport}
        />
        <SecureRoute exact path="/commission/reports/projections" component={ProjectionsReport} />
        <SecureRoute
            exact
            path="/commission/reports/commissionLapse"
            component={CommissionLapseReport}
        />
        <SecureRoute exact path="/commission/lookups/commTypes" component={CommissionTypeList} />
        {/* ------------------------------------------------------------------------------------- */}
        {/* DIRECTORY --------------------------------------------------------------------------- */}
        <SecureRoute exact path="/directory" component={UserList} />
        <SecureRoute exact path="/directory/users" component={UserList} />
        <SecureRoute exact path="/directory/organisations" component={OrganisationList} />
        <SecureRoute exact path="/directory/roles" component={RoleList} />
        <SecureRoute exact path="/directory/lookups/companies" component={CompanyList} />
        <SecureRoute exact path="/directory/logs/changeLogs" component={ChangeLogList} />
        <SecureRoute exact path="/directory/logs/auditLogs" component={AuditLogList} />
        {/* ------------------------------------------------------------------------------------- */}
    </Switch>
);

export default Routes;
