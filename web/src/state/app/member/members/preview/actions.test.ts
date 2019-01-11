import { membersApi } from '@/config/api/member';

import { MemberPreview } from '../';
import * as actions from './actions';

describe('member actions', () => {
    it('should dispatch API when fetchMemberPreview is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${membersApi}/99/preview`,
            dispatchPrefix: 'MEMBERS_MEMBER_PREVIEW'
        };

        expect(actions.fetchMemberPreview('99')).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_MEMBER_PREVIEW_RECEIVE when receiveMemberPreview is called', () => {
        const member: MemberPreview = {
            id: '10',
            userId: '123',
            firstName: 'Dean',
            lastName: 'Jackson',
            idNumber: '12341234',
            dateOfBirth: '1982-10-03',
            userFirstName: 'Louis',
            userLastName: 'Snetler',
            policyCount: 2
        };

        const expectedAction = {
            type: 'MEMBERS_MEMBER_PREVIEW_RECEIVE',
            payload: member
        };

        expect(actions.receiveMemberPreview(member)).toEqual(expectedAction);
    });
});
