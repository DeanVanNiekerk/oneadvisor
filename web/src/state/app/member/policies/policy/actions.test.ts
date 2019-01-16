import { policiesApi } from '@/config/api/member';

import { PolicyEdit } from '../';
import * as actions from './actions';

describe('policy actions', () => {
    it('should dispatch API when fetchPolicy is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${policiesApi}/99`,
            dispatchPrefix: 'POLICIES_POLICY'
        };

        expect(actions.fetchPolicy('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updatePolicy is called', () => {
        const policy: PolicyEdit = {
            id: '10',
            memberId: '12',
            companyId: '100',
            userId: '1',
            number: '987654'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${policiesApi}/10`,
            method: 'POST',
            payload: policy,
            onSuccess: onSuccess,
            dispatchPrefix: 'POLICIES_POLICY_EDIT'
        };

        expect(actions.updatePolicy(policy, onSuccess)).toEqual(expectedAction);
    });
});
