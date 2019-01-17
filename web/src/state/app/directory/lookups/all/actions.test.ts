import { allLookupsApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: lookups: actions', () => {
    it('should dispatch API when fetchAllLookups is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: allLookupsApi,
            dispatchPrefix: 'LOOKUPS',
            onSuccess: expect.any(Function)
        };

        expect(actions.fetchAllLookups()).toEqual(expectedAction);
    });
});
