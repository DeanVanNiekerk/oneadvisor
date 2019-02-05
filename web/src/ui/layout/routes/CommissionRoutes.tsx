import React from 'react';
import { Switch } from 'react-router';

import CommissionImport from '@/ui/app/commission/import/CommissionImport';
import StatementList from '@/ui/app/commission/statement/StatementList';
import StatementPreview from '@/ui/app/commission/statement/StatementPreview';
import { SecureRoute } from '@okta/okta-react';

const CommissionRoutes = () => (
    <Switch>
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
    </Switch>
);

export default CommissionRoutes;
