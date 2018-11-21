// @flow

import { organisationsApi } from '@/config/api/directory';
import * as actions from './actions';

describe('directory: organisations: list actions', () => {
    it('should dispatch API when fetchOrganisations is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${organisationsApi}`,
            dispatchPrefix: 'ORGANISATIONS_LIST'
        };

        expect(actions.fetchOrganisations()).toEqual(expectedAction);
    });
});
