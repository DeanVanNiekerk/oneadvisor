import React from 'react';
import { Switch } from 'react-router';

//import CommissionList from '@/ui/app/commission/commission/CommissionList';
import CommissionImport from '@/ui/app/commission/import/CommissionImport';
import StatementList from '@/ui/app/commission/statement/StatementList';
import { SecureRoute } from '@okta/okta-react';

const CommissionRoutes = () => (
    <Switch>
        <SecureRoute exact path="/commission" component={StatementList} />

        {/* <SecureRoute
            exact
            path="/commission/commissions"
            component={CommissionList}
        /> */}
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
    </Switch>
);

export default CommissionRoutes;
