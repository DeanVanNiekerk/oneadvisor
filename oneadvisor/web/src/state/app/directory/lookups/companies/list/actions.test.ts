import { companiesApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: companies: list actions', () => {
    it('should dispatch API when fetchCompanies is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${companiesApi}`,
            dispatchPrefix: 'COMPANIES_LIST'
        };

        expect(actions.fetchCompanies()).toEqual(expectedAction);
    });
});
