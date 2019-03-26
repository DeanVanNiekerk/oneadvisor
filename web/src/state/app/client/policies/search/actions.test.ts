import { Filters } from '@/app/table';
import { policiesApi } from '@/config/api/client';

import * as actions from './actions';

describe('policy: policys: search actions', () => {
    it('should dispatch API when fetchPolicies is called', () => {
        const filters: Filters = {
            number: ['12']
        };

        const api = `${policiesApi}?pageNumber=1&pageSize=10&sortColumn=number&sortDirection=asc&filters=number%3D12`;

        const expectedAction = {
            type: 'API',
            endpoint: api,
            dispatchPrefix: 'POLICIES_SEARCH'
        };

        expect(actions.searchPolicies(filters)).toEqual(expectedAction);
    });
});
