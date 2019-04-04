import { commissionTypesApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: commissionTypes: list actions', () => {
    it('should dispatch API when fetchCommissionTypes is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${commissionTypesApi}`,
            dispatchPrefix: 'COMMISSIONTYPES_LIST'
        };

        expect(actions.fetchCommissionTypes()).toEqual(expectedAction);
    });
});
