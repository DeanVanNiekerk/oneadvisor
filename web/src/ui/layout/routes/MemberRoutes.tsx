import React from 'react';
import { Switch } from 'react-router';

import MemberExport from '@/ui/app/member/export/MemberExport';
import MemberImport from '@/ui/app/member/import/MemberImport';
import MemberList from '@/ui/app/member/member/MemberList';
import MemberPreview from '@/ui/app/member/member/MemberPreview';
import { SecureRoute } from '@okta/okta-react';

const MemberRoutes = () => (
    <Switch>
        <SecureRoute exact path="/member" component={MemberList} />

        <SecureRoute exact path="/member/members" component={MemberList} />
        <SecureRoute exact path="/member/import" component={MemberImport} />
        <SecureRoute exact path="/member/export" component={MemberExport} />
        <SecureRoute
            exact
            path="/member/members/:memberId"
            component={MemberPreview}
        />
    </Switch>
);

export default MemberRoutes;
