import React from 'react';
import { Switch } from 'react-router';

import CommissionList from '@/ui/app/commission/commission/CommissionList';
import { SecureRoute } from '@okta/okta-react';

const CommissionRoutes = () => (
    <Switch>
        <SecureRoute exact path="/commission" component={CommissionList} />

        <SecureRoute
            exact
            path="/commission/commissions"
            component={CommissionList}
        />
    </Switch>
);

export default CommissionRoutes;
