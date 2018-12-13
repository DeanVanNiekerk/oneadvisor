import { membersApi } from '@/config/api/member';

import * as actions from './actions';

describe('member: members: list actions', () => {
    it('should dispatch API when fetchMembers is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${membersApi}`,
            dispatchPrefix: 'MEMBERS_LIST'
        };

        expect(actions.fetchMembers()).toEqual(expectedAction);
    });
});
