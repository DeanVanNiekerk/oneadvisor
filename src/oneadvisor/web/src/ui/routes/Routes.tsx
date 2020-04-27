import React, { Suspense } from "react";
import { Route, Switch } from "react-router";

import SecureRoute from "@/ui/layout/SecureRoute";

import { Activate, ResetPassword, ResetPasswordRequest, SignIn } from "./account";
import {
    ClientExport,
    ClientImport,
    ClientList,
    ClientPreview,
    PolicyList,
    PolicyProductList,
    PolicyProductTypeList,
    PolicyTypeCharacteristicList,
} from "./client";
import {
    ClientRevenueReport,
    CommissionLapseReport,
    CommissionList,
    CommissionStatementTemplateList,
    CommissionTypeList,
    ProjectionsReport,
    SplitRulePolicyList,
    StatementList,
    StatementPreview,
    UserMonthlyCommissionReport,
} from "./commission";
import { RoaInvest } from "./compliance";
import {
    AdviceScopeList,
    AdviceServiceList,
    AuditLogList,
    ChangeLogList,
    CompanyList,
    LicenseCategoryList,
    OrganisationList,
    RoleList,
    UserList,
} from "./directory";
import { SuspenseLoader } from "./SuspenseLoader";

const Routes: React.FC = () => (
    <Suspense fallback={<SuspenseLoader />}>
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
            <SecureRoute
                exact
                path="/client/lookups/policyProducts"
                component={PolicyProductList}
            />
            <SecureRoute
                exact
                path="/client/lookups/policyTypeCharacteristics"
                component={PolicyTypeCharacteristicList}
            />
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
            <SecureRoute
                exact
                path="/commission/reports/projections"
                component={ProjectionsReport}
            />
            <SecureRoute
                exact
                path="/commission/reports/commissionLapse"
                component={CommissionLapseReport}
            />
            <SecureRoute
                exact
                path="/commission/lookups/commTypes"
                component={CommissionTypeList}
            />
            {/* ------------------------------------------------------------------------------------- */}
            {/* DIRECTORY --------------------------------------------------------------------------- */}
            <SecureRoute exact path="/directory" component={UserList} />
            <SecureRoute exact path="/directory/users" component={UserList} />
            <SecureRoute exact path="/directory/organisations" component={OrganisationList} />
            <SecureRoute exact path="/directory/roles" component={RoleList} />
            <SecureRoute exact path="/directory/lookups/companies" component={CompanyList} />
            <SecureRoute exact path="/directory/lookups/adviceScopes" component={AdviceScopeList} />
            <SecureRoute
                exact
                path="/directory/lookups/adviceServices"
                component={AdviceServiceList}
            />
            <SecureRoute
                exact
                path="/directory/lookups/licenseCategories"
                component={LicenseCategoryList}
            />
            <SecureRoute exact path="/directory/logs/changeLogs" component={ChangeLogList} />
            <SecureRoute exact path="/directory/logs/auditLogs" component={AuditLogList} />
            {/* ------------------------------------------------------------------------------------- */}
            {/* COMPLIANCE -------------------------------------------------------------------------- */}
            <SecureRoute exact path="/compliance" component={RoaInvest} />
            {/* ------------------------------------------------------------------------------------- */}
        </Switch>
    </Suspense>
);

export default Routes;
