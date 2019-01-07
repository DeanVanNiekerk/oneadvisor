import React from 'react';
import { Switch } from 'react-router';

import MemberImport from '@/ui/app/member/import/MemberImport';
import MemberList from '@/ui/app/member/member/MemberList';
import { SecureRoute } from '@okta/okta-react';

const MemberRoutes = () => (
    <Switch>
        <SecureRoute exact path="/member" component={MemberList} />

        <SecureRoute exact path="/member/members" component={MemberList} />
        <SecureRoute exact path="/member/import" component={MemberImport} />
    </Switch>
);

export default MemberRoutes;
