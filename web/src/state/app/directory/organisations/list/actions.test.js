// @flow

import { organisationsApi } from '@/config/api/directory';
import * as actions from './actions';

describe('directory: organisations: list actions', () => {
    it('should dispatch API when fetchOrganisations is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${organisationsApi}?pageNumber=2&pageSize=10`,
            dispatchPrefix: 'ORGANISATIONS_LIST'
        };

        let pageOptions = {
            size: 10,
            number: 2
        };

        expect(actions.fetchOrganisations(pageOptions)).toEqual(expectedAction);
    });

    it('should dispatch ORGANISATIONS_LIST_PAGE_NUMBER_RECEIVE when clearAuthentication is called', () => {
        const expectedAction = {
            type: 'ORGANISATIONS_LIST_PAGE_NUMBER_RECEIVE',
            payload: 2
        };

        expect(actions.receivePageNumber(2)).toEqual(expectedAction);
    });
});
