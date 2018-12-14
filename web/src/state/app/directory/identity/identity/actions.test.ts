import { identityApi } from '@/config/api/directory';

import * as actions from './actions';

describe('identity actions', () => {
    it('should dispatch API when fetchIdentity is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${identityApi}`,
            dispatchPrefix: 'IDENTITY'
        };

        expect(actions.fetchIdentity()).toEqual(expectedAction);
    });
});
