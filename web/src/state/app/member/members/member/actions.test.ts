import { membersApi } from '@/config/api/member';

import * as actions from './actions';

describe('member actions', () => {
    it('should dispatch API when fetchMember is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${membersApi}/99`,
            dispatchPrefix: 'MEMBERS_MEMBER'
        };

        expect(actions.fetchMember('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updateMember is called', () => {
        const member = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            maidenName: '',
            initials: 'DJ',
            preferredName: 'ripper',
            idNumber: '12341234',
            dateOfBirth: '1982-10-03'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${membersApi}/10`,
            method: 'POST',
            payload: member,
            onSuccess: onSuccess,
            dispatchPrefix: 'MEMBERS_MEMBER_EDIT'
        };

        expect(actions.updateMember(member, onSuccess)).toEqual(expectedAction);
    });
});
