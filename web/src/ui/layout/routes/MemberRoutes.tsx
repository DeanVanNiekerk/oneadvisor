import React from 'react';
import { Switch } from 'react-router';

import MemberList from '@/ui/app/member/member/MemberList';
import { SecureRoute } from '@okta/okta-react';

const MemberRoutes = () => (
    <Switch>
        <SecureRoute exact path="/member" component={MemberList} />

        <SecureRoute exact path="/member/members" component={MemberList} />
    </Switch>
);

export default MemberRoutes;
