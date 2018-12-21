import { branchesApi } from '@/config/api/directory';

import * as actions from './actions';

describe('branch actions', () => {
    it('should dispatch API when fetchBranch is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${branchesApi}/99`,
            dispatchPrefix: 'BRANCHES_BRANCH'
        };

        expect(actions.fetchBranch('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updateBranch is called', () => {
        const branch = {
            id: '10',
            organisationId: '99',
            name: 'Org1'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${branchesApi}/10`,
            method: 'POST',
            payload: branch,
            onSuccess: onSuccess,
            dispatchPrefix: 'BRANCHES_BRANCH_EDIT'
        };

        expect(actions.updateBranch(branch, onSuccess)).toEqual(expectedAction);
    });

    it('should dispatch API when insertBranch is called', () => {
        const branch = {
            id: '',
            organisationId: '99',
            name: 'Org1'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${branchesApi}`,
            method: 'POST',
            payload: branch,
            onSuccess: onSuccess,
            dispatchPrefix: 'BRANCHES_BRANCH_EDIT'
        };

        expect(actions.insertBranch(branch, onSuccess)).toEqual(expectedAction);
    });
});
